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
  });
});
