import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Calendar, Clock, CreditCard, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, ShieldCheck, Sparkles, MessageCircle, FileText, Check } from 'lucide-react';
import { ServiceItem, ServicePackage, Booking } from '../types';

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const prefilledService = searchParams.get('service');
  const prefilledPackage = searchParams.get('package');

  // Step state: 1 = Service, 2 = Package & Time, 3 = Details, 4 = Review & Pay, 5 = Confirmation
  const [currentStep, setCurrentStep] = useState(1);

  // Data states
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);

  // Date & Availability states
  const todayStr = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [availableSlots, setAvailableSlots] = useState<{ timeSlot: string; available: boolean }[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  // Client Details
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [projectDetails, setProjectDetails] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Payment & Confirmation states
  const [payFullAmount, setPayFullAmount] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [paymentTransactionRef, setPaymentTransactionRef] = useState<string | null>(null);

  // Paystack interactive checkout modal state (for test mode checkout simulation)
  const [showPaystackModal, setShowPaystackModal] = useState(false);
  const [paystackAuthData, setPaystackAuthData] = useState<any>(null);

  // Load services from API
  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data: ServiceItem[]) => {
        setServices(data);
        setLoadingServices(false);
        if (prefilledService) {
          const match = data.find((s) => s.id === prefilledService || s.slug === prefilledService);
          if (match) {
            setSelectedService(match);
            if (prefilledPackage && match.packages) {
              const pkgMatch = match.packages.find((p) => p.id === prefilledPackage);
              if (pkgMatch) setSelectedPackage(pkgMatch);
            }
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load services:', err);
        setLoadingServices(false);
      });
  }, [prefilledService, prefilledPackage]);

  // Load slot availability whenever selectedDate changes
  useEffect(() => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    fetch(`/api/availability?date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => {
        setAvailableSlots(data.slots || []);
        setLoadingSlots(false);
        // Deselect if currently chosen slot is unavailable
        if (selectedSlot) {
          const slotItem = data.slots.find((s: any) => s.timeSlot === selectedSlot);
          if (!slotItem || !slotItem.available) {
            setSelectedSlot('');
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load slots:', err);
        setLoadingSlots(false);
      });
  }, [selectedDate]);

  // Handle service selection
  const handleSelectService = (srv: ServiceItem) => {
    setSelectedService(srv);
    if (srv.packages && srv.packages.length > 0) {
      setSelectedPackage(srv.packages[0]);
    } else {
      setSelectedPackage(null);
    }
    setCurrentStep(2);
  };

  // Step 4: Submit booking and trigger Paystack initialization
  const handleInitiateBookingAndPayment = async () => {
    if (!selectedService || !selectedDate || !selectedSlot || !clientName || !clientEmail || !clientPhone) {
      setBookingError('Please complete all required fields.');
      return;
    }
    if (!termsAccepted) {
      setBookingError('You must accept the studio booking and cancellation policy to proceed.');
      return;
    }

    setBookingError(null);
    setIsProcessingPayment(true);

    try {
      // 1. Create Booking on Server (validates slots, calculates server pricing)
      const bookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          packageId: selectedPackage ? selectedPackage.id : undefined,
          date: selectedDate,
          timeSlot: selectedSlot,
          clientName,
          clientEmail,
          clientPhone,
          projectDetails,
          termsAccepted: true,
        }),
      });

      const bookingData = await bookingRes.json();
      if (!bookingRes.ok) {
        throw new Error(bookingData.error || 'Failed to create booking reservation');
      }

      const createdBooking: Booking = bookingData.booking;
      setConfirmedBooking(createdBooking);

      // 2. Initialize Paystack Transaction on Server
      const paystackRes = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingReference: createdBooking.reference,
          customerEmail: clientEmail,
          customerName: clientName,
          payFullAmount,
        }),
      });

      const paystackData = await paystackRes.json();
      if (!paystackRes.ok) {
        throw new Error(paystackData.error || 'Failed to initialize Paystack checkout');
      }

      setPaymentTransactionRef(paystackData.data.reference);
      setPaystackAuthData(paystackData.data);
      setShowPaystackModal(true);
      setIsProcessingPayment(false);
    } catch (err: any) {
      setBookingError(err.message || 'An error occurred during booking creation.');
      setIsProcessingPayment(false);
    }
  };

  // Verify Paystack test payment on server
  const handleVerifyTestPayment = async () => {
    if (!paymentTransactionRef) return;
    setIsProcessingPayment(true);

    try {
      const res = await fetch(`/api/paystack/verify/${paymentTransactionRef}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Payment verification failed');
      }

      // Refresh booking record
      if (confirmedBooking) {
        const bRes = await fetch(`/api/bookings/${confirmedBooking.reference}`);
        const bData = await bRes.json();
        setConfirmedBooking(bData);
      }

      setShowPaystackModal(false);
      setCurrentStep(5); // Confirmation screen
    } catch (err: any) {
      setBookingError(err.message || 'Payment verification error');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Price calculations from selected records
  const calculatedPrice = selectedPackage
    ? selectedPackage.priceNgn
    : selectedService
    ? selectedService.approvedPriceNgn
    : 0;

  const calculatedDeposit = selectedPackage
    ? selectedPackage.depositNgn
    : Math.round(calculatedPrice * 0.5);

  const amountToPayNow = payFullAmount ? calculatedPrice : calculatedDeposit;

  return (
    <div className="min-h-screen bg-[#040609] text-slate-100 pt-28 pb-24 px-4 sm:px-6 lg:px-12 font-sans selection:bg-[#4E85BF] selection:text-white">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Step Indicator Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#89AACC]">
            <Sparkles className="w-3.5 h-3.5 text-[#4E85BF]" />
            <span>SESSION BOOKING & CONCIERGE · LEKKI PHASE 1</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
            RESERVE THE VAULT.
          </h1>

          {/* Stepper Wizard Bar */}
          {currentStep < 5 && (
            <div className="grid grid-cols-4 gap-2 pt-2">
              {[
                { num: 1, label: 'SERVICE' },
                { num: 2, label: 'DATE & TIME' },
                { num: 3, label: 'ARTIST DETAILS' },
                { num: 4, label: 'CHECKOUT' },
              ].map((s) => (
                <div key={s.num} className="space-y-1">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      currentStep >= s.num ? 'accent-gradient' : 'bg-white/10'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-mono block ${
                      currentStep === s.num ? 'text-white font-bold' : 'text-slate-500'
                    }`}
                  >
                    {s.num}. {s.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {bookingError && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{bookingError}</span>
          </div>
        )}

        {/* ==================================================== */}
        {/* STEP 1: SELECT A SERVICE                             */}
        {/* ==================================================== */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white uppercase">
                1. SELECT YOUR SESSION DISCIPLINE
              </h2>
              <span className="text-xs font-mono text-slate-400">Step 1 of 4</span>
            </div>

            {loadingServices ? (
              <div className="p-12 text-center text-slate-400 text-xs font-mono">
                Loading studio services...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((srv) => {
                  const isSelected = selectedService?.id === srv.id;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => handleSelectService(srv)}
                      className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer ${
                        isSelected
                          ? 'bg-[#0e1422] border-[#4E85BF] shadow-[0_8px_30px_rgba(78,133,191,0.25)]'
                          : 'bg-[#080b12] border-white/10 hover:border-white/20 hover:bg-[#0c1018]'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#89AACC]">
                            {srv.verifiedRoom}
                          </span>
                          {!srv.isPriceApproved && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300">
                              PROPOSED
                            </span>
                          )}
                        </div>
                        <h3 className="font-display text-lg font-bold text-white">{srv.title}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {srv.tagline}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-slate-500 block">STARTING AT</span>
                          <span className="font-mono text-base font-bold text-[#89AACC]">
                            ₦{srv.draftPriceNgn.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-white flex items-center gap-1 group-hover:text-[#89AACC]">
                          SELECT <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* STEP 2: CHOOSE PACKAGE, DATE & AVAILABLE TIME SLOT   */}
        {/* ==================================================== */}
        {currentStep === 2 && selectedService && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white uppercase">
                  2. SELECT PACKAGE & AVAILABLE TIME
                </h2>
                <span className="text-xs text-[#89AACC] font-mono">
                  {selectedService.title} · {selectedService.verifiedRoom}
                </span>
              </div>
              <button
                onClick={() => setCurrentStep(1)}
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> CHANGE SERVICE
              </button>
            </div>

            {/* Packages Selection (if available) */}
            {selectedService.packages && selectedService.packages.length > 0 && (
              <div className="space-y-3">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Select Package / Duration
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {selectedService.packages.map((pkg) => {
                    const isSelected = selectedPackage?.id === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                          isSelected
                            ? 'bg-[#0e1422] border-[#4E85BF] shadow-md'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div>
                          <h4 className="font-display text-xs font-bold text-white">{pkg.name}</h4>
                          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                            Duration: {pkg.durationHours} hours
                          </span>
                        </div>
                        <div>
                          <span className="font-mono text-base font-bold text-[#89AACC]">
                            ₦{pkg.priceNgn.toLocaleString()}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 block">
                            Deposit: ₦{pkg.depositNgn.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Date Picker & Time Slots */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 rounded-2xl bg-[#080b12] border border-white/10">
              {/* Date Input */}
              <div className="md:col-span-5 space-y-3">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#89AACC]" />
                  <span>Choose Session Date</span>
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-[#4E85BF] transition-colors"
                />
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Real-time slot availability for our Lekki Phase 1 tracking floor. Slots update instantly against existing confirmed sessions.
                </p>
              </div>

              {/* Slot Buttons with Concurrency Protection */}
              <div className="md:col-span-7 space-y-3">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#89AACC]" />
                  <span>Available Time Slots ({selectedDate})</span>
                </label>

                {loadingSlots ? (
                  <div className="p-8 text-center text-slate-500 text-xs font-mono">
                    Querying slot calendar...
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlot === slot.timeSlot;
                      return (
                        <button
                          key={slot.timeSlot}
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(slot.timeSlot)}
                          className={`py-3 px-2 rounded-xl text-xs font-mono text-center transition-all ${
                            !slot.available
                              ? 'bg-white/5 text-slate-600 border border-white/5 line-through cursor-not-allowed opacity-40'
                              : isSelected
                              ? 'accent-gradient text-white font-bold shadow-md'
                              : 'bg-black/40 border border-white/15 text-slate-300 hover:text-white hover:border-[#89AACC] cursor-pointer'
                          }`}
                        >
                          <div>{slot.timeSlot}</div>
                          <span className="text-[9px] block opacity-75">
                            {slot.available ? 'AVAILABLE' : 'BOOKED'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                BACK
              </button>
              <button
                disabled={!selectedSlot}
                onClick={() => setCurrentStep(3)}
                className="px-8 py-3 rounded-xl accent-gradient text-white text-xs font-bold tracking-wider uppercase disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>CONTINUE TO DETAILS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* STEP 3: ARTIST DETAILS & PROJECT BRIEF               */}
        {/* ==================================================== */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white uppercase">
                3. ARTIST CONTACT & PROJECT BRIEF
              </h2>
              <button
                onClick={() => setCurrentStep(2)}
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> BACK TO TIME
              </button>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-[#080b12] border border-white/10 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400 block">
                    ARTIST / PRODUCER FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Temitope Adesioye"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#4E85BF] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400 block">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="e.g. artist@example.com"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#4E85BF] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400 block">
                  PHONE / WHATSAPP NUMBER (FOR SESSION COORDINATION) *
                </label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="e.g. 09015104502"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#4E85BF] transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400 block">
                  PROJECT NOTES & HARDWARE PREFERENCES (OPTIONAL)
                </label>
                <textarea
                  rows={3}
                  value={projectDetails}
                  onChange={(e) => setProjectDetails(e.target.value)}
                  placeholder="Tell us about the record, requested microphone (Sony C-800G, Neumann U87), stem count, references..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#4E85BF] transition-colors resize-none"
                />
              </div>

              {/* Policy Checkbox */}
              <div className="pt-2 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-black/40 text-[#4E85BF] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
                  I accept the{' '}
                  <Link to="/booking-policy" target="_blank" className="text-[#89AACC] underline">
                    Booking and Cancellation Policy
                  </Link>{' '}
                  and agree to the payment terms. Cancellations made at least 48 hours prior to session receive full deposit rollover.
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                BACK
              </button>
              <button
                disabled={!clientName || !clientEmail || !clientPhone || !termsAccepted}
                onClick={() => setCurrentStep(4)}
                className="px-8 py-3 rounded-xl accent-gradient text-white text-xs font-bold tracking-wider uppercase disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>REVIEW & PAY</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* STEP 4: REVIEW SUMMARY & PAYSTACK CHECKOUT           */}
        {/* ==================================================== */}
        {currentStep === 4 && selectedService && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white uppercase">
                4. SESSION SUMMARY & CHECKOUT
              </h2>
              <button
                onClick={() => setCurrentStep(3)}
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> EDIT DETAILS
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Left: Summary Card */}
              <div className="md:col-span-7 p-6 rounded-2xl bg-[#080b12] border border-white/10 space-y-5">
                <span className="text-xs font-mono text-[#89AACC] uppercase tracking-wider block font-semibold">
                  RESERVATION BREAKDOWN
                </span>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400 font-mono">Service:</span>
                    <span className="font-bold text-white">{selectedService.title}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400 font-mono">Package:</span>
                    <span className="text-white">
                      {selectedPackage ? selectedPackage.name : selectedService.title}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400 font-mono">Room:</span>
                    <span className="text-[#89AACC] font-mono">{selectedService.verifiedRoom}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400 font-mono">Date & Slot:</span>
                    <span className="text-white font-mono">{selectedDate} ({selectedSlot})</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-400 font-mono">Artist:</span>
                    <span className="text-white">{clientName} ({clientPhone})</span>
                  </div>
                </div>

                {/* Deposit vs Full Payment Switcher */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                    PAYMENT OPTION
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setPayFullAmount(false)}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                        !payFullAmount
                          ? 'bg-[#4E85BF]/20 border-[#4E85BF] text-white font-bold'
                          : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div>Pay Deposit (50%)</div>
                      <span className="text-sm font-bold text-[#89AACC] block mt-1">
                        ₦{calculatedDeposit.toLocaleString()}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPayFullAmount(true)}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                        payFullAmount
                          ? 'bg-[#4E85BF]/20 border-[#4E85BF] text-white font-bold'
                          : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div>Pay Full Amount</div>
                      <span className="text-sm font-bold text-[#89AACC] block mt-1">
                        ₦{calculatedPrice.toLocaleString()}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Paystack Trigger & Trust Badges */}
              <div className="md:col-span-5 p-6 rounded-2xl bg-[#0e1422] border border-[#4E85BF]/40 space-y-6 shadow-xl">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#89AACC] uppercase tracking-wider block">
                    TOTAL DUE NOW (SECURED VIA PAYSTACK)
                  </span>
                  <div className="font-display text-3xl font-extrabold text-white">
                    ₦{amountToPayNow.toLocaleString()}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 block">
                    Currency: NGN (Nigerian Naira)
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>256-bit SSL Paystack Encrypted Checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#89AACC]" />
                    <span>Instant Booking Confirmation Reference</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleInitiateBookingAndPayment}
                  className="w-full py-4 rounded-xl accent-gradient text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>
                    {isProcessingPayment ? 'CONNECTING TO PAYSTACK...' : `PAY ₦${amountToPayNow.toLocaleString()} VIA PAYSTACK`}
                  </span>
                </button>

                <p className="text-[10px] text-center font-mono text-slate-400">
                  Accepts Mastercard, Visa, Verve, Bank Transfer, and USSD.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* STEP 5: BOOKING CONFIRMATION & REFERENCE             */}
        {/* ==================================================== */}
        {currentStep === 5 && confirmedBooking && (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#080b12] border border-emerald-500/40 text-center space-y-6 animate-in zoom-in-95 duration-300 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center shadow-lg">
              <Check className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <span className="text-xs font-mono text-emerald-400 tracking-widest uppercase block font-semibold">
                SESSION RESERVATION CONFIRMED
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                WE'LL SEE YOU IN THE VAULT.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Your session is locked in at SONICVAULT STUDIOS, Lekki Phase 1, Lagos. 
                Our studio engineering director has been notified and the acoustic chain will be pre-patched prior to your arrival.
              </p>
            </div>

            {/* Reference Badge */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 max-w-md mx-auto space-y-2 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Booking Reference:</span>
                <span className="text-white font-bold text-sm tracking-wider">{confirmedBooking.reference}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Session Date & Time:</span>
                <span className="text-white">{confirmedBooking.date} ({confirmedBooking.timeSlot})</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Service / Room:</span>
                <span className="text-[#89AACC]">{confirmedBooking.serviceName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment Status:</span>
                <span className="text-emerald-400 uppercase font-bold">{confirmedBooking.paymentStatus.replace('_', ' ')}</span>
              </div>
            </div>

            {/* Direct Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/2349015104502?text=${encodeURIComponent(`Hello SonicVault Studios, I have booked session ${confirmedBooking.reference} for ${confirmedBooking.serviceName} on ${confirmedBooking.date}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-emerald-600/30 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>NOTIFY STUDIO MANAGER ON WHATSAPP</span>
              </a>
              <Link
                to="/"
                className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-white/5 border border-white/15 text-slate-300 hover:text-white text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                RETURN HOME
              </Link>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* INTERACTIVE PAYSTACK TEST CHECKOUT MODAL             */}
        {/* ==================================================== */}
        {showPaystackModal && paystackAuthData && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#0a0f1a] border border-[#4E85BF]/60 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#00C3F7] flex items-center justify-center text-black font-bold text-xs">
                    P
                  </div>
                  <span className="font-display text-sm font-bold text-white tracking-wide">
                    PAYSTACK CHECKOUT (TEST MODE)
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  SANDBOX
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400 font-mono">Merchant:</span>
                  <span className="font-bold text-white">SONICVAULT STUDIOS</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400 font-mono">Booking Ref:</span>
                  <span className="font-bold text-[#89AACC]">{paystackAuthData.bookingReference}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400 font-mono">Customer:</span>
                  <span className="text-white">{paystackAuthData.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400 font-mono">Amount Due:</span>
                  <span className="font-bold text-lg text-emerald-400 font-mono">
                    ₦{paystackAuthData.amount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 space-y-1">
                <p className="font-semibold text-white">Simulated Payment Channel</p>
                <p>
                  Clicking below securely simulates Paystack's successful payment callback to{' '}
                  <span className="text-[#89AACC]">/api/paystack/verify</span>, confirming the booking and updating payment state idempotently.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleVerifyTestPayment}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wider uppercase transition-colors shadow-lg cursor-pointer"
                >
                  {isProcessingPayment ? 'VERIFYING TRANSACTION...' : `AUTHORIZE ₦${paystackAuthData.amount.toLocaleString()} PAYMENT`}
                </button>

                <button
                  type="button"
                  onClick={() => setShowPaystackModal(false)}
                  className="w-full py-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                >
                  CANCEL TRANSACTION
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
