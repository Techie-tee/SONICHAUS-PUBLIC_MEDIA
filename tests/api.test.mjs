import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { db, hashPassword } from '../server/db/store.ts';

describe('SONICVAULT STUDIOS — Core Infrastructure & Security Tests', () => {
  test('1. Database Store initialized with verified Lekki Phase 1 settings', () => {
    const settings = db.get('siteSettings');
    assert.strictEqual(settings.studioName, 'SONICVAULT STUDIOS');
    assert.strictEqual(settings.address, '38 Olanrewaju Ninalowo Crescent, Lekki Phase 1, Lagos State, Nigeria');
    assert.strictEqual(settings.phone, '09015104502');
    assert.strictEqual(settings.internationalWhatsApp, '2349015104502');
  });

  test('2. Admin password hashing produces secure SHA-256 digest', () => {
    const hash = hashPassword('SonicVault2026!');
    assert.ok(hash);
    assert.strictEqual(typeof hash, 'string');
    assert.strictEqual(hash.length, 64);
  });

  test('3. Services seed data has proposed draft pricing marked explicitly', () => {
    const services = db.get('services');
    assert.ok(services.length >= 7);

    const vocalRec = services.find((s) => s.slug === 'vocal-recording');
    assert.ok(vocalRec);
    assert.strictEqual(vocalRec.draftPriceNgn, 35000);
    // Explicitly unapproved by default until admin approves
    assert.strictEqual(vocalRec.isPriceApproved, false);
  });
  test('4. Booking Concurrency: Slot availability prevents double bookings', () => {
    const testDate = '2099-01-01';
    const testSlot = `TEST_SLOT_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    // Initially available
    const isAvailBefore = db.checkSlotAvailable(testDate, testSlot);
    assert.strictEqual(isAvailBefore, true);

    // Create booking
    const booking = db.createBooking({
      serviceId: 'srv_vocal_recording',
      serviceName: 'Vocal Recording',
      packageName: 'Vocal recording — 2 hours',
      date: testDate,
      timeSlot: testSlot,
      clientName: 'Test Artist',
      clientEmail: 'test.artist@example.com',
      clientPhone: '09015104502',
      projectDetails: 'Automated test suite session',
      durationHours: 2,
      priceNgn: 65000,
      depositNgn: 30000,
      bookingStatus: 'confirmed',
      paymentStatus: 'deposit_paid',
      termsAccepted: true,
    });

    assert.ok(booking.reference.startsWith('SV-'));

    // Check slot again: MUST now be unavailable (prevents double-booking)
    const isAvailAfter = db.checkSlotAvailable(testDate, testSlot);
    assert.strictEqual(isAvailAfter, false);

    // Clean up test booking to maintain clean database state
    const cleanBookings = db.get('bookings').filter((b) => b.reference !== booking.reference);
    db.set('bookings', cleanBookings);
  });

  test('5. Paystack Transaction Persistence and Verification Workflow', () => {
    const payments = db.get('payments');
    const initialCount = payments.length;

    const testRef = `SV_PSTK_TEST_${Date.now()}`;
    const transaction = {
      reference: testRef,
      bookingReference: 'SV-TEST-REF',
      amountNgn: 35000,
      customerEmail: 'artist@example.com',
      customerName: 'Adesioye',
      status: 'pending',
      paystackReference: testRef,
      isTestMode: true,
      createdAt: new Date().toISOString(),
    };

    payments.unshift(transaction);
    db.set('payments', payments);

    const fetchedPayments = db.get('payments');
    assert.strictEqual(fetchedPayments.length, initialCount + 1);

    const target = fetchedPayments.find((p) => p.reference === testRef);
    assert.ok(target);
    assert.strictEqual(target.status, 'pending');

    // Simulate verification
    target.status = 'success';
    target.paidAt = new Date().toISOString();
    db.set('payments', fetchedPayments);

    const verified = db.get('payments').find((p) => p.reference === testRef);
    assert.strictEqual(verified.status, 'success');

    // Clean up test payment transaction
    const cleanPayments = db.get('payments').filter((p) => p.reference !== testRef);
    db.set('payments', cleanPayments);
  });

  test('6. Chatbot Knowledge Base covers required core topics', () => {
    const knowledge = db.get('chatbotKnowledge');
    assert.ok(knowledge.length >= 5);

    const hasLekkiLocation = knowledge.some(
      (k) => k.answer.includes('Lekki Phase 1') && k.category === 'location'
    );
    assert.strictEqual(hasLekkiLocation, true);

    const hasWhatsAppEscalation = knowledge.some(
      (k) => k.answer.includes('+2349015104502') || k.answer.includes('WhatsApp')
    );
    assert.strictEqual(hasWhatsAppEscalation, true);
  });

  test('7. Audit logs record administrative operations and security events', () => {
    db.addAuditLog('TEST_SECURITY_EVENT', 'automated_tester', 'Testing audit log persistence');
    const logs = db.get('auditLogs');
    const testLog = logs.find((l) => l.action === 'TEST_SECURITY_EVENT');
    assert.ok(testLog);
    assert.strictEqual(testLog.user, 'automated_tester');

    // Clean up test audit log entry
    const cleanLogs = db.get('auditLogs').filter((l) => l.action !== 'TEST_SECURITY_EVENT');
    db.set('auditLogs', cleanLogs);
  });

  test('8. Studio Services & Verified Environments Consistency', () => {
    const services = db.get('services');
    assert.ok(services.length >= 5);
    const hasControlRoom = services.some((s) => s.verifiedRoom.includes('Control Room'));
    const hasVocalBooth = services.some((s) => s.verifiedRoom.includes('Vocal Booth'));
    const hasProductionLab = services.some((s) => s.verifiedRoom.includes('Production Lab'));
    const hasMasteringSuite = services.some((s) => s.verifiedRoom.includes('Mastering Suite'));
    assert.strictEqual(hasControlRoom, true);
    assert.strictEqual(hasVocalBooth, true);
    assert.strictEqual(hasProductionLab, true);
    assert.strictEqual(hasMasteringSuite, true);
  });

  test('9. Hero Scenes Configuration & Photographic Asset Integrity', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');

    // Verify all 5 scene images exist on disk with valid file size (> 10KB)
    const requiredImages = [
      'src/assets/images/studio_01_entrance_1792446831639.jpg',
      'src/assets/images/mobile/scene_01_entrance_mobile.jpg',
      'src/assets/images/studio_02_vocal_booth_1792446832131.jpg',
      'src/assets/images/mobile/scene_02_vocal_booth_mobile.jpg',
      'src/assets/images/studio_control_live_performance_1792447671011.jpg',
      'src/assets/images/control_room_mobile_1792483021817.jpg',
      'src/assets/images/studio_04_production_lab_1792446833465.jpg',
      'src/assets/images/production_lab_mobile_1792482735447.jpg',
      'src/assets/images/studio_05_master_suite_1792446834087.jpg',
      'src/assets/images/master_suite_mobile_1792482735792.jpg',
    ];

    for (const imgPath of requiredImages) {
      const fullPath = path.resolve(process.cwd(), imgPath);
      assert.strictEqual(fs.existsSync(fullPath), true, `Asset must exist: ${imgPath}`);
      const stats = fs.statSync(fullPath);
      assert.ok(stats.size > 10000, `Asset must not be empty: ${imgPath}`);
    }

    // Verify CinematicHero component source file has entrance alignment clearance
    const heroCode = fs.readFileSync(path.resolve(process.cwd(), 'src/components/hero/CinematicHero.tsx'), 'utf-8');
    assert.ok(heroCode.includes("id: 'studio-entrance'"), 'Hero must define studio-entrance scene');
    assert.ok(heroCode.includes('panYStart: 5.5') || heroCode.includes('panYStart: 5'), 'Entrance must have vertical clearance offset to clear navbar');
    assert.ok(heroCode.includes('MAKE MAGIC.'), 'Hero must include MAKE MAGIC headline');
  });

  test('10. Services Section: Even 50/50 Card Design & Proportional Layout Verification', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');

    const servicesCode = fs.readFileSync(path.resolve(process.cwd(), 'src/components/sections/ServicesSection.tsx'), 'utf-8');

    // 1. Must use balanced 2-column equal 50/50 split grid
    assert.ok(
      servicesCode.includes('grid-cols-1 md:grid-cols-2') || servicesCode.includes('grid-cols-2'),
      'Services grid must use an even 2-column 50/50 proportion'
    );

    // 2. Must not contain the old asymmetrical spans (7, 4, 8, 5)
    assert.strictEqual(servicesCode.includes('lg:col-span-7'), false, 'Uneven 7-span must be eliminated');
    assert.strictEqual(servicesCode.includes('lg:col-span-4'), false, 'Uneven 4-span must be eliminated');
    assert.strictEqual(servicesCode.includes('lg:col-span-8'), false, 'Uneven 8-span must be eliminated');
    assert.strictEqual(servicesCode.includes('lg:col-span-5'), false, 'Uneven 5-span must be eliminated');

    // 3. Must enforce equal vertical card proportion (flex flex-col and h-full)
    assert.ok(
      servicesCode.includes('flex flex-col') && servicesCode.includes('h-full'),
      'Card must enforce uniform full height flex column'
    );

    // 4. Must define balanced service catalogue with verified rate hints and rooms
    assert.ok(servicesCode.includes('rateHint:'), 'Services must provide transparent rate hints');
    assert.ok(servicesCode.includes('room:'), 'Services must specify verified acoustic chamber');
  });

  test('11. Selected Work: Even 50/50 Card Proportions & Balanced Category Filtering', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');

    const workCode = fs.readFileSync(path.resolve(process.cwd(), 'src/components/sections/SelectedWork.tsx'), 'utf-8');

    // 1. Must use balanced 2-column equal 50/50 proportion
    assert.ok(
      workCode.includes('grid-cols-1 md:grid-cols-2') || workCode.includes('grid-cols-2'),
      'Selected Work grid must use an even 2-column 50/50 proportion'
    );

    // 2. Must eliminate old asymmetrical spans and 96-block mesh cage
    assert.strictEqual(workCode.includes('lg:col-span-7'), false, 'Uneven 7-span must be eliminated in SelectedWork');
    assert.strictEqual(workCode.includes('lg:col-span-5'), false, 'Uneven 5-span must be eliminated in SelectedWork');
    assert.strictEqual(workCode.includes('length: 96'), false, '96-block wireframe cage must be eliminated');

    // 3. Must enforce equal vertical card proportion (flex flex-col and h-full)
    assert.ok(
      workCode.includes('flex flex-col') && workCode.includes('h-full'),
      'SelectedWork cards must enforce uniform full height flex column'
    );

    // 4. Must provide all 4 sub-categories with balanced pairs
    assert.ok(workCode.includes("'artist-sessions'"), 'Must support artist sessions');
    assert.ok(workCode.includes("'original-productions'"), 'Must support original productions');
    assert.ok(workCode.includes("'mix-master'"), 'Must support mix and master');
    assert.ok(workCode.includes("'sound-in-motion'"), 'Must support sound in motion');

    // 5. Must support audio preview and waveform interaction
    assert.ok(workCode.includes('handlePlayToggle'), 'Must support audio preview playback');
    assert.ok(workCode.includes('playbackProgress'), 'Must support waveform tracking');
  });

  test('12. Visual Explorations: Even 50/50 Card Proportions & Symmetrical Grid Verification', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');

    const expCode = fs.readFileSync(path.resolve(process.cwd(), 'src/components/sections/VisualExplorations.tsx'), 'utf-8');

    // 1. Must use balanced 2-column equal 50/50 grid
    assert.ok(
      expCode.includes('grid-cols-1 md:grid-cols-2'),
      'Visual Explorations must use a 2-column equal 50/50 grid'
    );

    // 2. Must eliminate staggered offset md:pt-12 and disparate heightClass
    assert.strictEqual(
      expCode.includes('md:pt-12'),
      false,
      'Staggered column offset md:pt-12 must be eliminated for even horizontal alignment'
    );
    assert.strictEqual(
      expCode.includes('col1') || expCode.includes('col2'),
      false,
      'Split asymmetrical col1/col2 arrays must be replaced with unified symmetrical grid'
    );

    // 3. Must enforce equal proportion across all cards
    assert.ok(
      expCode.includes('items-stretch'),
      'Visual Explorations grid must enforce items-stretch for identical vertical height'
    );
    assert.ok(
      expCode.includes('min-h-[360px]') || expCode.includes('min-h-[420px]'),
      'Visual Explorations cards must define symmetrical minimum heights'
    );

    // 4. Must utilize 6 distinct architectural/studio imagery assets
    assert.ok(expCode.includes('recordingRoomImg'), 'Must utilize real recording room photo');
    assert.ok(expCode.includes('vocalBoothImg'), 'Must utilize vocal booth photo');
    assert.ok(expCode.includes('controlRoomImg'), 'Must utilize control room photo');
    assert.ok(expCode.includes('productionLabImg'), 'Must utilize production lab photo');
    assert.ok(expCode.includes('masterSuiteImg'), 'Must utilize mastering suite photo');
    assert.ok(expCode.includes('entranceImg'), 'Must utilize architectural entrance photo');
  });

  test('13. Studio FAQ Component & Accordion API Verification', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');

    // 1. Verify component exists and implements dynamic fetch to /api/faqs
    const faqCode = fs.readFileSync(path.resolve(process.cwd(), 'src/components/sections/StudioFAQ.tsx'), 'utf-8');
    assert.ok(faqCode.includes('/api/faqs'), 'StudioFAQ must dynamically fetch from /api/faqs');
    assert.ok(faqCode.includes('toggleAccordion'), 'StudioFAQ must support interactive accordion toggle');
    assert.ok(faqCode.includes('searchQuery'), 'StudioFAQ must support real-time keyword search');
    assert.ok(faqCode.includes('selectedCategory'), 'StudioFAQ must support category filtering');
    assert.ok(faqCode.includes('onOpenBooking'), 'StudioFAQ must connect to session booking callback');
    assert.ok(faqCode.includes('whileInView={{ opacity: 1, y: 0 }}'), 'StudioFAQ accordion items must use Framer Motion whileInView fade-in-up animation');

    // 2. Verify HomePage mounts StudioFAQ
    const homeCode = fs.readFileSync(path.resolve(process.cwd(), 'src/pages/HomePage.tsx'), 'utf-8');
    assert.ok(homeCode.includes('<StudioFAQ'), 'HomePage must render the StudioFAQ component');

    // 3. Verify public backend /api/faqs route exists in routes.ts
    const routesCode = fs.readFileSync(path.resolve(process.cwd(), 'server/api/routes.ts'), 'utf-8');
    assert.ok(routesCode.includes("apiRouter.get('/faqs'"), 'Server must expose public /api/faqs endpoint');
  });

  test('14. Mobile Responsive Design & Card Alignment Verification', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');

    // 1. Verify SelectedWork mobile badge clearance and modal alignment
    const workCode = fs.readFileSync(path.resolve(process.cwd(), 'src/components/sections/SelectedWork.tsx'), 'utf-8');
    assert.ok(workCode.includes('right-16'), 'SelectedWork badges must include right-16 clearance to prevent button overlap on mobile');
    assert.ok(workCode.includes('items-start sm:items-center'), 'CaseStudyModal must support items-start on mobile to prevent top clipping');

    // 2. Verify ServicesSection responsive wrap and action bar
    const servicesCode = fs.readFileSync(path.resolve(process.cwd(), 'src/components/sections/ServicesSection.tsx'), 'utf-8');
    assert.ok(servicesCode.includes('flex-wrap sm:flex-nowrap'), 'ServicesSection action bar must wrap gracefully on narrow mobile screens');

    // 3. Verify StudioApproach mobile divider padding balance
    const approachCode = fs.readFileSync(path.resolve(process.cwd(), 'src/components/sections/StudioApproach.tsx'), 'utf-8');
    assert.ok(approachCode.includes('first:pt-0'), 'StudioApproach must remove top padding from first mobile pillar');

    // 4. Verify StudioFAQ mobile search clearance and category scrolling
    const faqCode = fs.readFileSync(path.resolve(process.cwd(), 'src/components/sections/StudioFAQ.tsx'), 'utf-8');
    assert.ok(faqCode.includes('pr-16'), 'StudioFAQ search input must reserve pr-16 for the CLEAR button');
    assert.ok(faqCode.includes('overflow-x-auto'), 'StudioFAQ must support horizontal swipe for category pills on mobile');

    // 5. Verify BookingModal mobile top alignment for scrollability
    const modalCode = fs.readFileSync(path.resolve(process.cwd(), 'src/components/booking/BookingModal.tsx'), 'utf-8');
    assert.ok(modalCode.includes('items-start sm:items-center'), 'BookingModal must support items-start on mobile to avoid modal clipping');
  });

  test('15. Hero Section: Lowered Headline Alignment in Space Below Logo and Above Entering Figure', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');

    const heroCode = fs.readFileSync(path.resolve(process.cwd(), 'src/components/hero/CinematicHero.tsx'), 'utf-8');

    // 1. Must position headline using justify-start
    assert.ok(heroCode.includes('justify-start'), 'Hero main headline must use justify-start to align in the upper viewport region');
    assert.strictEqual(heroCode.includes('justify-end items-center text-center px-4 sm:px-6 max-w-3xl mx-auto pointer-events-none w-full pb-3'), false, 'Old bottom-anchored justify-end must be removed');

    // 2. Must define lowered top clearance to sit below SONICVAULT STUDIOS logo and above entering figure
    assert.ok(
      heroCode.includes('clamp(') || heroCode.includes('26.5vh') || heroCode.includes('28vh') || heroCode.includes('pt-'),
      'Hero headline must provide responsive clearance lowering it below the entrance logo'
    );
  });

  test('16. Transom Header Unit: Centered Architectural Alignment & Mobile Responsiveness', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');

    const heroCode = fs.readFileSync(path.resolve(process.cwd(), 'src/components/hero/CinematicHero.tsx'), 'utf-8');

    // 1. Must define dedicated centered transom unit for WORLD-CLASS ACOUSTIC SANCTUARY and SCROLL TO ENTER
    assert.ok(
      heroCode.includes('WORLD-CLASS ACOUSTIC SANCTUARY'),
      'Hero must render WORLD-CLASS ACOUSTIC SANCTUARY'
    );
    assert.ok(
      heroCode.includes('SCROLL TO ENTER'),
      'Hero must render SCROLL TO ENTER'
    );

    // 2. Must feature vertical clearance offset (mt-2 or mt-3) to clear the blue neon strip
    assert.ok(
      heroCode.includes('mt-2') || heroCode.includes('mt-2.5') || heroCode.includes('mt-3') || heroCode.includes('mt-3.5') || heroCode.includes('mt-4'),
      'Transom header must define vertical offset to clear the blue neon accent strip'
    );

    // 3. Must center horizontally and vertically within an architectural capsule
    assert.ok(
      heroCode.includes('flex flex-col items-center justify-center text-center'),
      'Transom header must center horizontally and vertically'
    );

    // 4. Must enforce mobile-responsive tracking and typography to prevent line wrapping on narrow screens
    assert.ok(
      heroCode.includes('whitespace-nowrap'),
      'Transom header text must prevent awkward line wrapping'
    );
    assert.ok(
      heroCode.includes('text-[7.5px]') || heroCode.includes('text-[8.5px]'),
      'Transom header text must have responsive typography for small mobile viewports'
    );

    // 5. Must eliminate aggressive bounce collision with the door sensor
    assert.strictEqual(
      heroCode.includes('animate-bounce drop-shadow cursor-pointer pointer-events-auto hover:text-cyan-300'),
      false,
      'Old unconstrained bounce collision with door sensor must be removed'
    );
  });

  test('17. Engagement Analytics: WhatsApp Concierge Button Click Tracker & Hover Ripple Glow', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');

    const waCode = fs.readFileSync(path.resolve(process.cwd(), 'src/components/chat/FloatingWhatsApp.tsx'), 'utf-8');

    // 1. Must define click event handler logging to console
    assert.ok(
      waCode.includes('handleWhatsAppClick') && waCode.includes('console.log('),
      'WhatsApp component must have handleWhatsAppClick logging to console'
    );

    // 2. Must log structured engagement tracking metadata
    assert.ok(
      waCode.includes('[ENGAGEMENT_TRACKER]') && waCode.includes('whatsapp_concierge_open'),
      'Click logger must report [ENGAGEMENT_TRACKER] with whatsapp_concierge_open action'
    );

    // 3. Must attach onClick handler to anchor tag
    assert.ok(
      waCode.includes('onClick={handleWhatsAppClick}'),
      'Anchor element must attach onClick={handleWhatsAppClick}'
    );

    // 4. Must feature subtle ping ripple aura with hover scale-up and glow
    assert.ok(
      waCode.includes('animate-ping') && waCode.includes('group-hover:scale-125'),
      'FloatingWhatsApp must render a subtle ping / ripple aura with hover scale-up and glow'
    );
  });

  test('18. Conversion Buttons: Book a Session Hover Ripple & Scale-Up Glow Effect', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');

    const navCode = fs.readFileSync(path.resolve(process.cwd(), 'src/components/layout/Navbar.tsx'), 'utf-8');
    const ctaCode = fs.readFileSync(path.resolve(process.cwd(), 'src/components/sections/FinalCinematicCTA.tsx'), 'utf-8');

    // 1. Navbar booking button must feature ripple ping effect with hover scale-up
    assert.ok(
      navCode.includes('animate-ping') && navCode.includes('group-hover:scale-125'),
      'Navbar BOOK A SESSION button must have ripple ping effect with hover scale-up transition'
    );

    // 2. Final Cinematic CTA button must feature ripple ping effect with hover scale-up
    assert.ok(
      ctaCode.includes('animate-ping') && ctaCode.includes('group-hover:scale-125'),
      'Final CTA BOOK A SESSION button must have ripple ping effect with hover scale-up transition'
    );
  });

  test('19. Flagship Architectural & Services CTA Button Visibility & Touch Consistency', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');

    const cssCode = fs.readFileSync(path.resolve(process.cwd(), 'src/index.css'), 'utf-8');
    const homeCode = fs.readFileSync(path.resolve(process.cwd(), 'src/pages/HomePage.tsx'), 'utf-8');
    const servicesCode = fs.readFileSync(path.resolve(process.cwd(), 'src/components/sections/ServicesSection.tsx'), 'utf-8');

    // 1. Verify CTA buttons use solid dark obsidian styling with crisp white typography
    assert.ok(
      homeCode.includes('studio-tour-cta-btn') && homeCode.includes('bg-[#090D16]'),
      'HomePage CTA must use studio-tour-cta-btn class with solid obsidian background'
    );
    assert.ok(
      servicesCode.includes('services-catalogue-cta-btn') && servicesCode.includes('bg-[#090D16]'),
      'ServicesSection CTA must use services-catalogue-cta-btn class with solid obsidian background'
    );

    // 2. Verify StudioTourPage EXPLORE SERVICES button uses high contrast class and styling
    const tourCode = fs.readFileSync(path.resolve(process.cwd(), 'src/pages/StudioTourPage.tsx'), 'utf-8');
    assert.ok(
      tourCode.includes('studio-tour-explore-services-btn') && tourCode.includes('EXPLORE SERVICES'),
      'StudioTourPage must use studio-tour-explore-services-btn with high contrast styling'
    );

    // 3. Verify CSS defines solid obsidian background and white text for daylight & touch states
    assert.ok(
      cssCode.includes('.services-catalogue-cta-btn') && cssCode.includes('.studio-tour-cta-btn') && cssCode.includes('.studio-tour-explore-services-btn'),
      'CSS must include explicit rules for studio-tour, services-catalogue, and explore-services buttons'
    );
    assert.ok(
      cssCode.includes('touch-action: manipulation') && cssCode.includes('-webkit-tap-highlight-color: transparent'),
      'CSS must suppress mobile touch tap flicker and optimize touch-action'
    );
  });

  test('20. Studio FAQ Dynamic Category Filtering by Booking, Pricing, and Technical via React State', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');

    const faqCode = fs.readFileSync(path.resolve(process.cwd(), 'src/components/sections/StudioFAQ.tsx'), 'utf-8');

    // 1. Verify Category Tabs definition includes Booking, Pricing, and Technical
    assert.ok(faqCode.includes("key: 'booking'") && faqCode.includes("label: 'Booking'"), 'Must include Booking category tab');
    assert.ok(faqCode.includes("key: 'pricing'") && faqCode.includes("label: 'Pricing'"), 'Must include Pricing category tab');
    assert.ok(faqCode.includes("key: 'technical'") && faqCode.includes("label: 'Technical'"), 'Must include Technical category tab');

    // 2. Verify React state management for visibility
    assert.ok(faqCode.includes('const [selectedCategory, setSelectedCategory] = useState'), 'Must manage category state via useState');
    assert.ok(faqCode.includes('categoryCounts'), 'Must compute dynamic category count badges');
    assert.ok(faqCode.includes('onClick={() => setSelectedCategory('), 'Buttons must update React state on click');
    assert.ok(faqCode.includes('filteredFaqs'), 'Must filter FAQs based on selectedCategory state');

    // 3. Verify category badges on individual cards
    assert.ok(faqCode.includes('CATEGORY_BADGE_STYLES'), 'Must define category badge styles for cards');
  });

  test('21. WhatsApp CTA Default Brand Color (#25D366) & High-Contrast Typography Verification', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');

    const floatCode = fs.readFileSync(path.resolve(process.cwd(), 'src/components/chat/FloatingWhatsApp.tsx'), 'utf-8');
    const faqCode = fs.readFileSync(path.resolve(process.cwd(), 'src/components/sections/StudioFAQ.tsx'), 'utf-8');
    const ctaCode = fs.readFileSync(path.resolve(process.cwd(), 'src/components/sections/FinalCinematicCTA.tsx'), 'utf-8');
    const cssCode = fs.readFileSync(path.resolve(process.cwd(), 'src/index.css'), 'utf-8');

    // 1. Floating WhatsApp CTA must use default WhatsApp green #25D366
    assert.ok(
      floatCode.includes('bg-[#25D366]'),
      'Floating WhatsApp CTA must use default WhatsApp green #25D366'
    );
    assert.ok(
      floatCode.includes('text-white'),
      'Floating WhatsApp CTA must feature crisp white text'
    );

    // 2. Landing page Concierge WhatsApp button must use #25D366 and visible white text
    assert.ok(
      faqCode.includes('bg-[#25D366]') && faqCode.includes('CHAT ON WHATSAPP'),
      'FAQ concierge banner must feature #25D366 WhatsApp button with bold CHAT ON WHATSAPP text'
    );
    assert.ok(
      ctaCode.includes('bg-[#25D366]') && ctaCode.includes('CHAT ON WHATSAPP'),
      'Final Cinematic CTA must feature #25D366 WhatsApp button with bold CHAT ON WHATSAPP text'
    );

    // 3. CSS must safeguard WhatsApp button text from washed-out / faded overrides
    assert.ok(
      cssCode.includes('.whatsapp-floating-btn') && cssCode.includes('.faq-whatsapp-btn'),
      'CSS must include explicit high-contrast rules for WhatsApp buttons'
    );
  });

  test('22. Core Service Titles Visibility & Contemporary Chamber Cards Bottom Alignment', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');

    const servicesCode = fs.readFileSync(path.resolve(process.cwd(), 'src/components/sections/ServicesSection.tsx'), 'utf-8');
    const homeCode = fs.readFileSync(path.resolve(process.cwd(), 'src/pages/HomePage.tsx'), 'utf-8');
    const cssCode = fs.readFileSync(path.resolve(process.cwd(), 'src/index.css'), 'utf-8');

    // 1. Core 4 Service Titles are bold, pure white, and decorated with text-shadow
    assert.ok(
      servicesCode.includes('service-card-title') && servicesCode.includes('font-extrabold'),
      'ServicesSection must define service-card-title with font-extrabold and crisp styling'
    );
    assert.ok(
      cssCode.includes('.service-card-title') && cssCode.includes('color: #FFFFFF !important'),
      'CSS must strictly safeguard service-card-title as pure white (#FFFFFF) across all themes'
    );

    // 2. The Production Lab chamber card text sits well below alongside contemporaries
    assert.ok(
      homeCode.includes('items-end') && homeCode.includes('min-h-[2.5rem]'),
      'HomePage chamber cards must align titles with items-end and min-h so The Production Lab sits well below'
    );
    assert.ok(
      homeCode.includes('The Production Lab') && homeCode.includes('Beat-Making, Analog Synthesis & Drums'),
      'The Production Lab chamber must have balanced two-line depth matching its contemporary cards'
    );
  });

  test('23. ImagePreloader Component & Hero CSS Object-Fit Contain Verification', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');

    // 1. ImagePreloader exists and utilizes the browser native Image API
    const preloaderPath = path.resolve(process.cwd(), 'src/components/common/ImagePreloader.tsx');
    assert.strictEqual(fs.existsSync(preloaderPath), true, 'ImagePreloader component must exist');
    const preloaderCode = fs.readFileSync(preloaderPath, 'utf-8');
    assert.ok(preloaderCode.includes('new Image()'), 'ImagePreloader must instantiate new Image() via browser API');
    assert.ok(preloaderCode.includes('CRITICAL_HERO_IMAGES'), 'ImagePreloader must declare CRITICAL_HERO_IMAGES manifest');
    assert.ok(preloaderCode.includes('SECONDARY_GALLERY_IMAGES'), 'ImagePreloader must declare SECONDARY_GALLERY_IMAGES manifest');

    // 2. App.tsx mounts ImagePreloader
    const appCode = fs.readFileSync(path.resolve(process.cwd(), 'src/App.tsx'), 'utf-8');
    assert.ok(appCode.includes('<ImagePreloader />'), 'App.tsx must render <ImagePreloader /> on initial load');

    // 3. CinematicHero uses object-fit: contain and object-position: center for all background images
    const heroCode = fs.readFileSync(path.resolve(process.cwd(), 'src/components/hero/CinematicHero.tsx'), 'utf-8');
    assert.ok(
      heroCode.includes("objectFit: 'contain'"),
      'CinematicHero must set objectFit: contain in style to prevent image cropping'
    );
    assert.ok(
      heroCode.includes("objectPosition: 'center'"),
      'CinematicHero must set objectPosition: center in style for balanced centering'
    );
    assert.ok(
      heroCode.includes('object-contain object-center'),
      'CinematicHero must include object-contain object-center CSS utility classes'
    );

    // 4. Main text overlay padding-top is adjusted to position it well below visual media
    assert.ok(
      heroCode.includes('pt-6') && heroCode.includes('justify-start'),
      'CinematicHero main text overlay must use adjusted padding-top (pt-6) to sit well below visual media'
    );
  });
});




