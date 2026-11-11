import { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle2, AlertCircle, Clock, Instagram, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceInterest: 'Vocal Recording',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit enquiry');

      setStatus({
        type: 'success',
        message: 'Your message has been securely submitted to SonicVault Studios. Our studio manager will reach out via email or WhatsApp within a few hours.',
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        serviceInterest: 'Vocal Recording',
        message: '',
      });
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'An error occurred while submitting your message. Please reach us directly on WhatsApp.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040609] text-slate-100 pt-28 pb-24 px-4 sm:px-6 lg:px-12 font-sans selection:bg-[#4E85BF] selection:text-white">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#89AACC]">
            <Sparkles className="w-3.5 h-3.5 text-[#4E85BF]" />
            <span>DIRECT VAULT CONTACT & CONCIERGE · LEKKI PHASE 1</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white uppercase leading-[1.05]">
            LET'S MAKE / SOMETHING REAL.
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Reach out for bespoke recording lockouts, mixing & mastering inquiries, studio walkthroughs, or general questions. 
            All in-person visits to our Lekki Phase 1 facility are strictly by appointment.
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Verified Business Info & Direct Links (Sticky so it stays visible on scroll) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 z-20">
            <div className="p-6 rounded-2xl bg-[#080b12] border border-white/10 space-y-6 shadow-xl">
              <div className="flex items-center justify-between pb-1 border-b border-white/10">
                <span className="text-xs font-mono text-[#89AACC] font-bold tracking-widest uppercase block">
                  OFFICIAL STUDIO DETAILS
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  OPEN FOR BOOKINGS
                </span>
              </div>

              {/* Physical Location: Google Maps Red Pin */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 dark:bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0 text-[#EA4335] shadow-sm shadow-red-500/10 group-hover:scale-105 group-hover:bg-red-500/20 transition-all">
                  <MapPin className="w-5 h-5 text-[#EA4335] fill-[#EA4335]/20" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-sm font-bold text-white">Physical Location</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                    38 Olanrewaju Ninalowo Crescent, Lekki Phase 1, Lagos State, Nigeria
                  </p>
                </div>
              </div>

              {/* Telephone Concierge: Telecom Blue */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0 text-[#2563EB] shadow-sm shadow-blue-500/10 group-hover:scale-105 group-hover:bg-blue-500/20 transition-all">
                  <Phone className="w-5 h-5 text-[#2563EB] fill-[#2563EB]/20" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-sm font-bold text-white">Telephone Concierge</h4>
                  <a
                    href="tel:09015104502"
                    className="inline-block text-xs font-mono font-bold text-[#2563EB] hover:text-[#1D4ED8] dark:hover:text-blue-300 hover:underline tracking-wide"
                  >
                    09015104502
                  </a>
                </div>
              </div>

              {/* WhatsApp Studio Manager: Authentic WhatsApp Green */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 dark:bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center shrink-0 text-[#25D366] shadow-sm shadow-[#25D366]/10 group-hover:scale-105 group-hover:bg-[#25D366]/20 transition-all">
                  <MessageCircle className="w-5 h-5 text-[#25D366] fill-[#25D366]/20" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-sm font-bold text-white">WhatsApp Studio Manager</h4>
                  <a
                    href="https://wa.me/2349015104502?text=Hello%20SonicVault%2C%20I%20would%20like%20to%20enquire%20about%20a%20studio%20session."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs font-mono font-bold text-[#25D366] hover:underline tracking-wide"
                  >
                    +234 901 510 4502
                  </a>
                </div>
              </div>

              {/* Official Studio Email: Official Gmail Logo & Bold High-Contrast Link */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-[#EA4335]/10 dark:bg-[#EA4335]/15 border border-[#EA4335]/30 flex items-center justify-center shrink-0 shadow-sm shadow-[#EA4335]/10 group-hover:scale-105 group-hover:bg-[#EA4335]/20 transition-all p-2">
                  {/* Official Google Gmail Logo */}
                  <svg
                    viewBox="52 42 88 66"
                    className="w-full h-full shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Official Gmail Logo"
                  >
                    <path fill="#4285f4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6" />
                    <path fill="#34a853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15" />
                    <path fill="#fbbc04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2" />
                    <path fill="#ea4335" d="M72 74V48l24 18 24-18v26L96 92" />
                    <path fill="#c5221f" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2" />
                  </svg>
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <h4 className="font-display text-sm font-bold text-white">Official Studio Email</h4>
                  <a
                    href="mailto:Sonicvaultstudios@gmail.com"
                    className="studio-email-link inline-block text-xs sm:text-sm font-mono font-extrabold break-all transition-all"
                    title="Send email to Sonicvaultstudios@gmail.com"
                  >
                    Sonicvaultstudios@gmail.com
                  </a>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Guaranteed response within 2–4 hours from our Studio Director.
                  </p>
                </div>
              </div>

              {/* Session Hours: Descriptive Warm Amber/Gold */}
              <div className="flex items-start gap-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-[#F59E0B] shadow-sm shadow-amber-500/10 group-hover:scale-105 group-hover:bg-amber-500/20 transition-all">
                  <Clock className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-sm font-bold text-white">Session Hours</h4>
                  <p className="text-xs text-slate-300 font-sans font-medium">
                    Monday – Sunday: 24/7 By Appointment Only
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-500 dark:text-amber-400 font-semibold block pt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
                    Lockout and overnight sessions available
                  </span>
                </div>
              </div>

              {/* Official Instagram Handle: Authentic Instagram Logo & Gradient */}
              <div className="pt-4 border-t border-white/10 flex items-center gap-3.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center shrink-0 shadow-md shadow-[#dc2743]/20 group-hover:scale-110 group-hover:rotate-3 transition-transform p-2">
                  {/* Official Instagram Camera Logo */}
                  <svg className="w-5 h-5 text-white fill-white" viewBox="0 0 24 24" aria-label="Official Instagram">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-white">Official Instagram</h4>
                  <a
                    href="https://instagram.com/SONICVAULTSTUDIO38"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono font-bold text-[#dc2743] hover:underline"
                  >
                    @SONICVAULTSTUDIO38
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Validated Interactive Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#080b12] border border-white/10 space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-mono text-[#89AACC] tracking-widest uppercase block">
                  ENQUIRY & BOOKING REQUEST
                </span>
                <h3 className="font-display text-2xl font-bold text-white">
                  Send A Direct Message
                </h3>
                <p className="text-xs text-slate-400">
                  Fill out this form and our engineering director will review your project brief.
                </p>
              </div>

              {status && (
                <div
                  className={`p-4 rounded-xl flex items-start gap-3 text-xs ${
                    status.type === 'success'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                  }`}
                >
                  {status.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <p className="leading-relaxed">{status.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-400 block">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Tunde Adebayo"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#4E85BF] transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-400 block">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. tunde@example.com"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#4E85BF] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-400 block">
                      PHONE / WHATSAPP NUMBER
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 08012345678"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#4E85BF] transition-colors"
                    />
                  </div>

                  {/* Service Interest */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-400 block">
                      SERVICE OF INTEREST
                    </label>
                    <select
                      value={formData.serviceInterest}
                      onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#4E85BF] transition-colors"
                    >
                      <option value="Vocal Recording">Vocal Recording</option>
                      <option value="Music Production & Beat-Making">Music Production & Beat-Making</option>
                      <option value="Analog Mixing">Analog Mixing</option>
                      <option value="Mastering">Precision Mastering</option>
                      <option value="Mixing & Mastering Bundle">Mixing & Mastering Bundle</option>
                      <option value="Full Record Production">Full Record Production</option>
                      <option value="Podcast / Voice-Over">Podcast / Voice-Over</option>
                      <option value="Studio Lockout">Multi-Day Studio Lockout</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-slate-400 block">
                    PROJECT DETAILS & PREFERRED DATES *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your tracks, deadline, references, or specific microphones requested..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#4E85BF] transition-colors resize-none"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl accent-gradient text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-xl disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'SUBMITTING ENQUIRY...' : 'SUBMIT ENQUIRY'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
