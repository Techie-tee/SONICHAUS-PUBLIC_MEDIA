import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';
import { db, hashPassword } from '../db/store.ts';

export const apiRouter = Router();

// In-memory session store for admin tokens
const activeSessions = new Map<string, { email: string; role: string; expiresAt: number }>();

function generateSessionToken(email: string, role: string): string {
  const token = `sv_sess_${crypto.randomBytes(24).toString('hex')}`;
  // 24 hour expiry
  activeSessions.set(token, { email, role, expiresAt: Date.now() + 24 * 60 * 60 * 1000 });
  return token;
}

// Authentication middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin session required' });
  }

  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ error: 'Session expired or invalid' });
  }

  (req as any).adminUser = session;
  next();
}

// ==========================================
// 1. HEALTH & SETTINGS
// ==========================================
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    studio: 'SONICVAULT STUDIOS',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

apiRouter.get('/settings', (_req, res) => {
  const settings = db.get('siteSettings');
  res.json({
    studioName: settings.studioName,
    address: settings.address,
    phone: settings.phone,
    internationalWhatsApp: settings.internationalWhatsApp,
    email: settings.email,
    socialHandle: settings.socialHandle,
    openingHours: settings.openingHours,
    paystackPublicKey: settings.paystackPublicKey,
    paystackTestMode: settings.paystackTestMode,
  });
});

// ==========================================
// 2. ADMIN AUTH
// ==========================================
apiRouter.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const adminUsers = db.get('adminUsers');
  const user = adminUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  const hashed = hashPassword(password);

  if (!user || user.passwordHash !== hashed) {
    db.addAuditLog('AUTH_FAILED', email, 'Failed admin login attempt');
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  const token = generateSessionToken(user.email, user.role);
  db.addAuditLog('AUTH_SUCCESS', user.email, 'Admin logged in');

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

apiRouter.get('/auth/me', requireAdmin, (req, res) => {
  const session = (req as any).adminUser;
  const adminUsers = db.get('adminUsers');
  const user = adminUsers.find((u) => u.email.toLowerCase() === session.email.toLowerCase());
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

apiRouter.post('/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeSessions.delete(token);
  }
  res.json({ message: 'Logged out successfully' });
});

// ==========================================
// 3. SERVICES & PRICING
// ==========================================
apiRouter.get('/services', (_req, res) => {
  const services = db.get('services');
  res.json(services);
});

apiRouter.get('/services/:id', (req, res) => {
  const services = db.get('services');
  const service = services.find((s) => s.id === req.params.id || s.slug === req.params.id);
  if (!service) return res.status(404).json({ error: 'Service not found' });
  res.json(service);
});

// Admin price approval
apiRouter.post('/services/:id/approve-pricing', requireAdmin, (req, res) => {
  const services = db.get('services');
  const index = services.findIndex((s) => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Service not found' });

  const service = services[index];
  service.isPriceApproved = true;
  service.approvedPriceNgn = req.body.approvedPriceNgn || service.draftPriceNgn;
  service.packages = service.packages.map((pkg) => ({
    ...pkg,
    isApproved: true,
  }));

  services[index] = service;
  db.set('services', services);
  db.addAuditLog('PRICE_APPROVED', (req as any).adminUser.email, `Pricing approved for service ${service.title}`);

  res.json({ message: 'Pricing approved successfully', service });
});

apiRouter.put('/services/:id', requireAdmin, (req, res) => {
  const services = db.get('services');
  const index = services.findIndex((s) => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Service not found' });

  services[index] = { ...services[index], ...req.body };
  db.set('services', services);
  db.addAuditLog('SERVICE_UPDATED', (req as any).adminUser.email, `Updated service ${services[index].title}`);

  res.json(services[index]);
});

// ==========================================
// 4. AVAILABILITY & CALENDAR
// ==========================================
const STANDARD_SLOTS = [
  '09:00 - 11:00',
  '11:30 - 13:30',
  '14:00 - 16:00',
  '16:30 - 18:30',
  '19:00 - 21:00',
  '21:30 - 01:30',
];

apiRouter.get('/availability', (req, res) => {
  const date = req.query.date as string;
  if (!date) return res.status(400).json({ error: 'Date query param required (YYYY-MM-DD)' });

  const bookings = db.get('bookings').filter((b) => b.date === date && b.bookingStatus !== 'cancelled');
  const bookedSlots = bookings.map((b) => b.timeSlot);

  const slotStatus = STANDARD_SLOTS.map((slot) => ({
    timeSlot: slot,
    available: !bookedSlots.includes(slot),
  }));

  res.json({ date, slots: slotStatus });
});

// ==========================================
// 5. BOOKINGS
// ==========================================
apiRouter.post('/bookings', (req, res) => {
  const {
    serviceId,
    packageId,
    date,
    timeSlot,
    clientName,
    clientEmail,
    clientPhone,
    projectDetails,
    termsAccepted,
  } = req.body;

  if (!serviceId || !date || !timeSlot || !clientName || !clientEmail || !clientPhone) {
    return res.status(400).json({ error: 'Missing required booking fields' });
  }

  if (!termsAccepted) {
    return res.status(400).json({ error: 'You must accept the booking policy and terms' });
  }

  // Check slot availability (Concurrency protection)
  if (!db.checkSlotAvailable(date, timeSlot)) {
    return res.status(409).json({ error: 'This time slot is already reserved. Please select another slot.' });
  }

  const services = db.get('services');
  const service = services.find((s) => s.id === serviceId);
  if (!service) return res.status(404).json({ error: 'Selected service not found' });

  // Calculate price and deposit strictly on server
  let selectedPkg = service.packages.find((p) => p.id === packageId);
  if (!selectedPkg && service.packages.length > 0) {
    selectedPkg = service.packages[0];
  }

  const durationHours = selectedPkg ? selectedPkg.durationHours : service.defaultDurationHours;
  const priceNgn = selectedPkg ? selectedPkg.priceNgn : service.approvedPriceNgn;
  const depositNgn = selectedPkg ? selectedPkg.depositNgn : Math.round(priceNgn * 0.5);

  const newBooking = db.createBooking({
    serviceId: service.id,
    serviceName: service.title,
    packageName: selectedPkg ? selectedPkg.name : service.title,
    date,
    timeSlot,
    clientName,
    clientEmail,
    clientPhone,
    projectDetails: projectDetails || '',
    durationHours,
    priceNgn,
    depositNgn,
    bookingStatus: 'pending_payment',
    paymentStatus: 'unpaid',
    termsAccepted: true,
  });

  res.status(201).json({
    message: 'Booking created. Proceed to payment.',
    booking: newBooking,
  });
});

apiRouter.get('/bookings', requireAdmin, (req, res) => {
  const status = req.query.status as string;
  let bookings = db.get('bookings');
  if (status) {
    bookings = bookings.filter((b) => b.bookingStatus === status);
  }
  res.json(bookings);
});

apiRouter.get('/bookings/:reference', (req, res) => {
  const booking = db.get('bookings').find((b) => b.reference === req.params.reference);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  res.json(booking);
});

apiRouter.patch('/bookings/:reference', (req, res) => {
  const { bookingStatus, notes, date, timeSlot } = req.body;
  const booking = db.get('bookings').find((b) => b.reference === req.params.reference);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  if (date && timeSlot && (date !== booking.date || timeSlot !== booking.timeSlot)) {
    if (!db.checkSlotAvailable(date, timeSlot)) {
      return res.status(409).json({ error: 'Reschedule slot is already booked' });
    }
  }

  const updated = db.updateBooking(req.params.reference, {
    ...(bookingStatus && { bookingStatus }),
    ...(notes !== undefined && { notes }),
    ...(date && { date }),
    ...(timeSlot && { timeSlot }),
  });

  res.json(updated);
});

// ==========================================
// 6. PAYSTACK INTEGRATION
// ==========================================
apiRouter.post('/paystack/initialize', (req, res) => {
  const { bookingReference, customerEmail, customerName, payFullAmount } = req.body;
  if (!bookingReference || !customerEmail) {
    return res.status(400).json({ error: 'Booking reference and email required' });
  }

  const booking = db.get('bookings').find((b) => b.reference === bookingReference);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const amountNgn = payFullAmount ? booking.priceNgn : booking.depositNgn;
  const paystackRef = `SV_PSTK_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  const payments = db.get('payments');
  const transaction = {
    reference: paystackRef,
    bookingReference: booking.reference,
    amountNgn,
    customerEmail,
    customerName: customerName || booking.clientName,
    status: 'pending' as const,
    paystackReference: paystackRef,
    isTestMode: true,
    createdAt: new Date().toISOString(),
  };

  payments.unshift(transaction);
  db.set('payments', payments);
  db.addAuditLog('PAYMENT_INITIATED', customerEmail, `Paystack checkout initialized for booking ${booking.reference}: ₦${amountNgn.toLocaleString()}`);

  res.json({
    status: true,
    message: 'Authorization URL created',
    data: {
      reference: paystackRef,
      amount: amountNgn,
      currency: 'NGN',
      email: customerEmail,
      bookingReference: booking.reference,
      checkoutUrl: `/paystack-checkout?reference=${paystackRef}`,
    },
  });
});

apiRouter.get('/paystack/verify/:reference', (req, res) => {
  const { reference } = req.params;
  const payments = db.get('payments');
  const index = payments.findIndex((p) => p.reference === reference);
  if (index === -1) return res.status(404).json({ error: 'Payment transaction not found' });

  const transaction = payments[index];
  if (transaction.status === 'success') {
    return res.json({ status: true, message: 'Payment already verified', transaction });
  }

  // Mark payment success
  transaction.status = 'success';
  transaction.channel = 'card';
  transaction.paidAt = new Date().toISOString();
  payments[index] = transaction;
  db.set('payments', payments);

  // Update booking status
  const booking = db.get('bookings').find((b) => b.reference === transaction.bookingReference);
  if (booking) {
    const isFull = transaction.amountNgn >= booking.priceNgn;
    db.updateBooking(booking.reference, {
      paymentStatus: isFull ? 'fully_paid' : 'deposit_paid',
      bookingStatus: 'confirmed',
      paymentReference: transaction.reference,
    });
  }

  db.addAuditLog('PAYMENT_VERIFIED', transaction.customerEmail, `Payment ${reference} verified for booking ${transaction.bookingReference}`);

  res.json({
    status: true,
    message: 'Payment verified successfully',
    transaction,
  });
});

apiRouter.post('/paystack/webhook', (req, res) => {
  const event = req.body;
  if (!event || !event.data || !event.data.reference) {
    return res.status(400).json({ error: 'Invalid webhook payload' });
  }

  const { reference } = event.data;
  const payments = db.get('payments');
  const transaction = payments.find((p) => p.reference === reference);

  if (transaction) {
    transaction.status = 'success';
    transaction.paidAt = new Date().toISOString();
    db.set('payments', payments);

    if (transaction.bookingReference) {
      db.updateBooking(transaction.bookingReference, {
        bookingStatus: 'confirmed',
        paymentStatus: 'deposit_paid',
        paymentReference: reference,
      });
    }
  }

  res.json({ received: true });
});

// ==========================================
// 7. EQUIPMENT CATALOGUE
// ==========================================
apiRouter.get('/equipment', (req, res) => {
  const category = req.query.category as string;
  let equipment = db.get('equipment');
  if (category && category !== 'all') {
    equipment = equipment.filter((e) => e.category === category);
  }
  res.json(equipment);
});

apiRouter.post('/equipment', requireAdmin, (req, res) => {
  const equipment = db.get('equipment');
  const newItem = {
    ...req.body,
    id: `eq_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
    isPublished: true,
  };
  equipment.unshift(newItem);
  db.set('equipment', equipment);
  db.addAuditLog('EQUIPMENT_ADDED', (req as any).adminUser.email, `Added equipment ${newItem.name}`);
  res.status(201).json(newItem);
});

apiRouter.put('/equipment/:id', requireAdmin, (req, res) => {
  const equipment = db.get('equipment');
  const index = equipment.findIndex((e) => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Equipment not found' });
  equipment[index] = { ...equipment[index], ...req.body };
  db.set('equipment', equipment);
  res.json(equipment[index]);
});

apiRouter.delete('/equipment/:id', requireAdmin, (req, res) => {
  let equipment = db.get('equipment');
  equipment = equipment.filter((e) => e.id !== req.params.id);
  db.set('equipment', equipment);
  res.json({ message: 'Equipment deleted' });
});

// ==========================================
// 8. TEAM PROFILES
// ==========================================
apiRouter.get('/team', (_req, res) => {
  const team = db.get('team').filter((t) => t.isPublished);
  res.json(team);
});

apiRouter.post('/team', requireAdmin, (req, res) => {
  const team = db.get('team');
  const newMember = {
    ...req.body,
    id: `tm_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
    isPublished: true,
  };
  team.push(newMember);
  db.set('team', team);
  res.status(201).json(newMember);
});

apiRouter.put('/team/:id', requireAdmin, (req, res) => {
  const team = db.get('team');
  const index = team.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Team member not found' });
  team[index] = { ...team[index], ...req.body };
  db.set('team', team);
  res.json(team[index]);
});

// ==========================================
// 9. PORTFOLIO & PROJECTS
// ==========================================
apiRouter.get('/portfolio', (_req, res) => {
  const projects = db.get('projects').filter((p) => p.isPublished);
  res.json(projects);
});

apiRouter.get('/portfolio/:id', (req, res) => {
  const project = db.get('projects').find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

// ==========================================
// 10. ENQUIRIES (CONTACT)
// ==========================================
apiRouter.post('/enquiries', (req, res) => {
  const { name, email, phone, serviceInterest, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const enquiries = db.get('enquiries');
  const newEnquiry = {
    id: `enq_${Date.now()}`,
    name,
    email,
    phone: phone || '',
    serviceInterest: serviceInterest || 'General Enquiry',
    message,
    status: 'unread' as const,
    createdAt: new Date().toISOString(),
  };

  enquiries.unshift(newEnquiry);
  db.set('enquiries', enquiries);
  db.addAuditLog('ENQUIRY_RECEIVED', email, `New enquiry from ${name} (${serviceInterest})`);

  res.status(201).json({
    message: 'Thank you. Your message has been received by SonicVault Studios.',
    enquiryId: newEnquiry.id,
  });
});

apiRouter.get('/enquiries', requireAdmin, (_req, res) => {
  res.json(db.get('enquiries'));
});

apiRouter.patch('/enquiries/:id', requireAdmin, (req, res) => {
  const enquiries = db.get('enquiries');
  const enquiry = enquiries.find((e) => e.id === req.params.id);
  if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
  if (req.body.status) enquiry.status = req.body.status;
  db.set('enquiries', enquiries);
  res.json(enquiry);
});

// ==========================================
// 11. CHATBOT KNOWLEDGE BASE & AI QUERY
// ==========================================
apiRouter.post('/chatbot/query', async (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query text required' });
  }

  const normalized = query.toLowerCase().trim();
  const knowledge = db.get('chatbotKnowledge').filter((k) => k.isPublished);

  // Exact or keyword match
  let matched = knowledge.find((item) =>
    item.keywords.some((kw) => normalized.includes(kw.toLowerCase()))
  );

  if (matched) {
    return res.json({
      answer: matched.answer,
      category: matched.category,
      suggestions: ['Book a Session', 'View Equipment', 'Studio Tour', 'WhatsApp Support'],
    });
  }

  // Quick greetings
  if (normalized.includes('hello') || normalized.includes('hi') || normalized.includes('hey')) {
    return res.json({
      answer: 'Welcome to SONICVAULT STUDIOS — where sound becomes art. 🎙️ Are you here to book a session, explore our services, discover our equipment, or listen to our work?',
      suggestions: ['Book a Session', 'View Services', 'Studio Location', 'Speak on WhatsApp'],
    });
  }

  // Server-side Gemini 2.5 Flash integration when GEMINI_API_KEY is configured
  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI();
      const settings = db.get('siteSettings');
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
        config: {
          systemInstruction: `You are the concierge AI assistant for SONICVAULT STUDIOS, a luxury, state-of-the-art music recording and production studio located at ${settings.address || '38 Olanrewaju Ninalowo Crescent, Lekki Phase 1, Lagos, Nigeria'}.
Studio Contact: Phone ${settings.phone || '09015104502'}, WhatsApp +${settings.internationalWhatsApp || '2349015104502'}, Email ${settings.email || 'Sonicvaultstudios@gmail.com'}.
Key Facilities: Vocal Booth, Live Recording Room, Analog Control Room, Production Lab, Mastering Suite.
Tone: Warm, sophisticated, professional, concise (1-3 sentences max).
Encourage booking a session or reaching out on WhatsApp. Do not make up unverified pricing.`,
        },
      });

      if (response.text) {
        return res.json({
          answer: response.text.trim(),
          suggestions: ['Book a Session', 'Speak on WhatsApp', 'View Equipment', 'Studio Tour'],
          whatsappUrl: `https://wa.me/${settings.internationalWhatsApp || '2349015104502'}`,
        });
      }
    } catch (aiErr) {
      console.warn('[AI Concierge] Gemini generation error, using fallback:', aiErr);
    }
  }

  return res.json({
    answer: "I don't have verified information on that specific detail in our published vault guide. For bespoke requests or direct questions, please message our studio team immediately on WhatsApp at +2349015104502 or call 09015104502.",
    suggestions: ['Speak on WhatsApp', 'Book a Session', 'View Equipment'],
    whatsappUrl: 'https://wa.me/2349015104502',
  });
});

// Public FAQ endpoint for Landing Page Accordion
apiRouter.get('/faqs', (_req, res) => {
  const allKnowledge = db.get('chatbotKnowledge') || [];
  const published = allKnowledge.filter((k) => k.isPublished);
  const categories = Array.from(new Set(published.map((k) => k.category)));
  res.json({
    faqs: published,
    categories,
    total: published.length,
  });
});

apiRouter.get('/chatbot/knowledge', requireAdmin, (_req, res) => {
  res.json(db.get('chatbotKnowledge'));
});

// ==========================================
// 12. ADMIN METRICS & AUDIT LOGS
// ==========================================
apiRouter.get('/admin/metrics', requireAdmin, (_req, res) => {
  const bookings = db.get('bookings');
  const payments = db.get('payments');
  const enquiries = db.get('enquiries');
  const equipment = db.get('equipment');

  const totalRevenue = payments
    .filter((p) => p.status === 'success')
    .reduce((sum, p) => sum + p.amountNgn, 0);

  const confirmedBookings = bookings.filter((b) => b.bookingStatus === 'confirmed').length;
  const pendingBookings = bookings.filter((b) => b.bookingStatus === 'pending_payment' || b.bookingStatus === 'pending_review').length;
  const unreadEnquiries = enquiries.filter((e) => e.status === 'unread').length;

  res.json({
    totalRevenueNgn: totalRevenue,
    confirmedBookings,
    pendingBookings,
    unreadEnquiries,
    totalEquipment: equipment.length,
    recentBookings: bookings.slice(0, 5),
    recentPayments: payments.slice(0, 5),
  });
});

apiRouter.get('/admin/audit-logs', requireAdmin, (_req, res) => {
  res.json(db.get('auditLogs'));
});
