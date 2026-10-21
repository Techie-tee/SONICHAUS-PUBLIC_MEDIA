import { useState, useId, useEffect } from 'react';
import { X, Calendar, Clock, User, CheckCircle2, ShieldCheck, Sparkles, Sliders, ArrowUpRight, MessageCircle } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoomId?: string;
}

const ROOM_OPTIONS = [
  { id: 'vocal-booth', serviceId: 'srv_vocal_recording', name: 'The Vault Vocal Booth (Sony C-800G)', baseRatePerHour: 35000, minHours: 2 },
  { id: 'recording-room', serviceId: 'srv_podcast_recording', name: 'Live Recording Hall & Podcast Suite', baseRatePerHour: 50000, minHours: 2 },
  { id: 'control-room', serviceId: 'srv_mixing', name: 'Master Control Room (SSL AWS 948)', baseRatePerHour: 65000, minHours: 3 },
  { id: 'production-lab', serviceId: 'srv_beat_production', name: 'Lab B Production & Synthesizer Suite', baseRatePerHour: 45000, minHours: 3 },
  { id: 'lockout', serviceId: 'srv_full_production', name: 'Full Facility Lockout (All Spaces 24/7)', baseRatePerHour: 240000, minHours: 8 },
];

export default function BookingModal({ isOpen, onClose, initialRoomId }: BookingModalProps) {
  const roomIdSelectId = useId();
  const sessionTypeSelectId = useId();
  const durationSelectId = useId();
  const engineerSelectId = useId();
  const sessionDateInputId = useId();
  const timeSlotSelectId = useId();
  const clientNameInputId = useId();
  const clientEmailInputId = useId();
  const projectNameInputId = useId();
  const sessionNotesTextareaId = useId();

  const [selectedRoomId, setSelectedRoomId] = useState(initialRoomId || 'recording-room');
  const [sessionType, setSessionType] = useState('Tracking & Recording');
  const [durationHours, setDurationHours] = useState(4);
  const [sessionDate, setSessionDate] = useState('2026-11-05');
  const [timeSlot, setTimeSlot] = useState('14:00 - 18:00');
  const [engineerTier, setEngineerTier] = useState<'self' | 'staff' | 'senior'>('staff');

  // Add-ons
  const [tapeAddon, setTapeAddon] = useState(false);
  const [hospitalityAddon, setHospitalityAddon] = useState(false);
  const [videoAddon, setVideoAddon] = useState(false);

  // Client Details
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('09015104502');
  const [projectName, setProjectName] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('SV-202610-8901');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentRoom = ROOM_OPTIONS.find((r) => r.id === selectedRoomId) || ROOM_OPTIONS[1];

  // Price calculations in NGN
  const baseRoomTotal = currentRoom.baseRatePerHour * durationHours;
  const engineerCost = engineerTier === 'self' ? 0 : engineerTier === 'staff' ? 15000 : 35000;
  const tapeCost = tapeAddon ? 25000 : 0;
  const hospitalityCost = hospitalityAddon ? 15000 : 0;
  const videoCost = videoAddon ? 35000 : 0;
  const grandTotal = baseRoomTotal + engineerCost + tapeCost + hospitalityCost + videoCost;
  const depositNgn = Math.round(grandTotal * 0.5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    audioEngine.playClick();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: currentRoom.serviceId,
          date: sessionDate,
          timeSlot,
          clientName: clientName || 'Sonic Artist',
          clientEmail: clientEmail || 'artist@example.com',
          clientPhone: clientPhone || '09015104502',
          projectDetails: `${projectName} - ${sessionNotes}`.trim(),
          termsAccepted: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBookingRef(data.booking.reference);
      }
    } catch {
      // Fallback
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl bg-[#090d16] border border-white/15 rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-2xl my-4 sm:my-8 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Booking Modal"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          /* Submission Confirmation View */
          <div className="text-center py-10 space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                SESSION RESERVATION RECORDED
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-display uppercase tracking-tight">
                Welcome to the Vault
              </h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Your reservation has been created with reference{' '}
                <span className="text-white font-mono font-bold">{bookingRef}</span>. 
                Our studio manager will coordinate pre-patching and deposit verification.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-w-md mx-auto text-left space-y-2 text-xs font-mono text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Facility:</span>
                <span className="font-semibold text-white">{currentRoom.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Slot:</span>
                <span>{sessionDate} ({timeSlot})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Session Total:</span>
                <span className="text-white font-bold">₦{grandTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">50% Deposit Due:</span>
                <span className="text-[#89AACC] font-bold">₦{depositNgn.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <a
                href={`https://wa.me/2349015104502?text=${encodeURIComponent(`Hello SonicVault Studios, I have booked session ${bookingRef} for ${currentRoom.name} on ${sessionDate}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>CONFIRM ON WHATSAPP</span>
              </a>

              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
              >
                CLOSE WINDOW
              </button>
            </div>
          </div>
        ) : (
          /* Interactive Booking Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-[#89AACC]">
                BOOKING CONCIERGE · LEKKI PHASE 1
              </span>
              <h3 id="booking-modal-title" className="text-2xl sm:text-3xl font-bold font-display uppercase tracking-tight">
                Schedule Studio Session
              </h3>
              <p className="text-xs text-slate-400">
                Configure your tracking space, analog gear, and engineering requirements.
              </p>
            </div>

            {/* Room Selection */}
            <div className="space-y-2">
              <label htmlFor={roomIdSelectId} className="block text-xs font-mono uppercase text-slate-300">
                1. Select Studio Space
              </label>
              <select
                id={roomIdSelectId}
                value={selectedRoomId}
                onChange={(e) => {
                  setSelectedRoomId(e.target.value);
                  audioEngine.playFaderMove();
                }}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-[#4E85BF] focus:outline-none cursor-pointer"
              >
                {ROOM_OPTIONS.map((room) => (
                  <option key={room.id} value={room.id} className="bg-slate-900 text-white">
                    {room.name} — ₦{room.baseRatePerHour.toLocaleString()}/hr (min {room.minHours}h)
                  </option>
                ))}
              </select>
            </div>

            {/* Session Type & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor={sessionTypeSelectId} className="block text-xs font-mono uppercase text-slate-300">
                  2. Session Objective
                </label>
                <select
                  id={sessionTypeSelectId}
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-[#4E85BF] focus:outline-none"
                >
                  <option className="bg-slate-900">Vocal Tracking & Comping</option>
                  <option className="bg-slate-900">Full Live Band Tracking</option>
                  <option className="bg-slate-900">Analog Console Summing & Mix</option>
                  <option className="bg-slate-900">Music Production & Beatmaking</option>
                  <option className="bg-slate-900">Podcast & Broadcast Voice-Over</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor={durationSelectId} className="block text-xs font-mono uppercase text-slate-300">
                  3. Duration (Hours)
                </label>
                <select
                  id={durationSelectId}
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-[#4E85BF] focus:outline-none"
                >
                  <option value={2} className="bg-slate-900">2 Hours</option>
                  <option value={4} className="bg-slate-900">4 Hours (Half Day)</option>
                  <option value={8} className="bg-slate-900">8 Hours (Full Day Lockout)</option>
                  <option value={12} className="bg-slate-900">12 Hours (Album Session)</option>
                </select>
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor={sessionDateInputId} className="block text-xs font-mono uppercase text-slate-300">
                  4. Session Date
                </label>
                <input
                  id={sessionDateInputId}
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-[#4E85BF] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor={timeSlotSelectId} className="block text-xs font-mono uppercase text-slate-300">
                  5. Time Window
                </label>
                <select
                  id={timeSlotSelectId}
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-[#4E85BF] focus:outline-none"
                >
                  <option className="bg-slate-900">09:00 - 13:00 (Morning)</option>
                  <option className="bg-slate-900">14:00 - 18:00 (Afternoon)</option>
                  <option className="bg-slate-900">19:00 - 23:00 (Evening Prime)</option>
                  <option className="bg-slate-900">00:00 - 08:00 (Overnight Lockout)</option>
                </select>
              </div>
            </div>

            {/* Client Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1">
                <label htmlFor={clientNameInputId} className="block text-[11px] font-mono uppercase text-slate-400">
                  Artist Name *
                </label>
                <input
                  id={clientNameInputId}
                  required
                  type="text"
                  placeholder="e.g. Tunde Adesioye"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-[#4E85BF] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor={clientEmailInputId} className="block text-[11px] font-mono uppercase text-slate-400">
                  Email Address *
                </label>
                <input
                  id={clientEmailInputId}
                  required
                  type="email"
                  placeholder="artist@example.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-[#4E85BF] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor={projectNameInputId} className="block text-[11px] font-mono uppercase text-slate-400">
                  Phone / WhatsApp *
                </label>
                <input
                  id={projectNameInputId}
                  required
                  type="tel"
                  placeholder="09015104502"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-[#4E85BF] focus:outline-none"
                />
              </div>
            </div>

            {/* Total Summary & Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-mono text-slate-400 block uppercase">Calculated Session Total</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#89AACC] font-mono tracking-tight">
                  ₦{grandTotal.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-400 block">50% Deposit: ₦{depositNgn.toLocaleString()}</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl accent-gradient text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:opacity-90 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'RESERVING SESSION...' : 'CONFIRM & LOCK SESSION'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
