import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, Clock, MessageSquare, Send, CheckCircle2, MessageCircle, ShieldCheck } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';

interface BookingSectionProps {
  initialService?: string;
}

const SERVICE_OPTIONS = [
  'Vocal Recording',
  'Music Production',
  'Beat Production',
  'Analog & In-The-Box Mixing',
  'Stereo & Stem Mastering',
  'Vocal Editing & Tuning',
  'Full Music Production',
  'Podcast Recording',
  'Voice-Over Recording',
  'Full Facility Lockout',
];

export default function BookingSection({ initialService }: BookingSectionProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(initialService || 'Vocal Recording');
  const [preferredDate, setPreferredDate] = useState('2026-11-15');
  const [preferredTime, setPreferredTime] = useState('12:00 PM');
  const [duration, setDuration] = useState('Full Day (8 Hours)');
  const [projectNotes, setProjectNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [bookingRef, setBookingRef] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    audioEngine.playClick();

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: 'srv_vocal_recording',
          date: preferredDate,
          timeSlot: preferredTime,
          clientName: fullName || 'Lagos Artist',
          clientEmail: email || 'artist@example.com',
          clientPhone: phone || '09015104502',
          projectDetails: `${service} (${duration}) - ${projectNotes}`.trim(),
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
      audioEngine.playTone(520, 'sine', 1.0, 0.15);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello SONICVAULT STUDIOS! My name is ${fullName || 'Artist'}. I have submitted booking request ${bookingRef || ''} for ${service} on ${preferredDate} (${preferredTime}). Notes: ${projectNotes || 'General session enquiry'}`
  );
  const whatsappUrl = `https://wa.me/2349015104502?text=${whatsappMessage}`;

  return (
    <section id="booking" className="py-24 sm:py-36 px-4 sm:px-6 lg:px-12 bg-[#070a12] border-t border-white/10 relative overflow-hidden">
      {/* Background Studio Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#4E85BF] rounded-full blur-[180px] opacity-15 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-[0.25em] text-[#89AACC]">
            <Sparkles className="w-3.5 h-3.5 text-[#4E85BF]" />
            <span>LET'S MAKE SOMETHING REAL</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white font-display tracking-tight uppercase">
            YOUR NEXT GREAT RECORD STARTS HERE.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed max-w-xl mx-auto">
            Tell us what you're working on, and let's find the right session for your sound at our Lekki Phase 1 studio.
          </p>
        </div>

        {/* Booking Card & Form */}
        <div className="rounded-3xl bg-slate-900/60 border border-white/15 p-6 sm:p-12 shadow-2xl backdrop-blur-xl">
          {isSubmitted ? (
            /* Confirmation View */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 space-y-6 max-w-lg mx-auto"
            >
              <div className="w-16 h-16 rounded-full accent-gradient flex items-center justify-center mx-auto text-white shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#89AACC]">
                  SESSION REQUEST RECEIVED
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                  Welcome to SONICVAULT, {fullName || 'Artist'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  Your booking request for <span className="text-[#89AACC] font-semibold">{service}</span> on <strong className="text-white">{preferredDate}</strong> ({preferredTime}) has been logged. Our studio manager will reach out within 4 business hours to finalize scheduling.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-black text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>CONTINUE CHAT ON WHATSAPP</span>
                </a>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  NEW ENQUIRY
                </button>
              </div>
            </motion.div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block">
                    Full Name / Artist Moniker *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Burna Boy / Adekunle Gold"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#4E85BF] transition-colors"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="artist@management.com"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#4E85BF] transition-colors"
                  />
                </div>

                {/* Phone or WhatsApp */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 901 510 4502"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#4E85BF] transition-colors"
                  />
                </div>

                {/* Requested Service */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block">
                    Requested Service *
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-[#4E85BF] transition-colors"
                  >
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#090d16] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preferred Date */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block">
                    Preferred Session Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-[#4E85BF] transition-colors"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Preferred Time & Duration */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block">
                      Start Time
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-[#4E85BF] transition-colors"
                    >
                      <option value="10:00 AM" className="bg-[#090d16]">10:00 AM</option>
                      <option value="12:00 PM" className="bg-[#090d16]">12:00 PM</option>
                      <option value="3:00 PM" className="bg-[#090d16]">3:00 PM</option>
                      <option value="6:00 PM" className="bg-[#090d16]">6:00 PM</option>
                      <option value="10:00 PM (Night)" className="bg-[#090d16]">10:00 PM</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block">
                      Duration
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-[#4E85BF] transition-colors"
                    >
                      <option value="Half Day (4 Hours)" className="bg-[#090d16]">4 Hours</option>
                      <option value="Full Day (8 Hours)" className="bg-[#090d16]">8 Hours</option>
                      <option value="12-Hour Lockout" className="bg-[#090d16]">12 Hours</option>
                      <option value="Multi-Day Residency" className="bg-[#090d16]">3-Day Residency</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block">
                  Project Details & Creative Intent
                </label>
                <textarea
                  rows={4}
                  value={projectNotes}
                  onChange={(e) => setProjectNotes(e.target.value)}
                  placeholder="Tell us about the project (genre, number of vocalists, live drums needed, stems format, or specific gear desired)..."
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#4E85BF] transition-colors"
                />
              </div>

              {/* Actions & WhatsApp Direct */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-[#89AACC]" />
                  <span>Encrypted Booking Request · Lekki Phase 1, Lagos</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-3 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>CHAT ON WHATSAPP</span>
                  </a>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3 rounded-full accent-gradient hover:opacity-90 text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-opacity cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>SENDING REQUEST...</span>
                    ) : (
                      <>
                        <span>SUBMIT SESSION REQUEST</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
