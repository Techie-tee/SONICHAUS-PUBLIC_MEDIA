import { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle2, AlertCircle, Clock, Instagram, Sparkles, Navigation } from 'lucide-react';

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
          {/* Left: Verified Business Info & Direct Links */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-[#080b12] border border-white/10 space-y-6">
              <span className="text-xs font-mono text-[#89AACC] tracking-widest uppercase block">
                OFFICIAL STUDIO DETAILS
              </span>

              {/* Address */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#89AACC]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-sm font-bold text-white">Physical Location</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    38 Olanrewaju Ninalowo Crescent, Lekki Phase 1, Lagos State, Nigeria
                  </p>
                  <a
                    href="https://maps.google.com/?q=38+Olanrewaju+Ninalowo+Crescent+Lekki+Phase+1+Lagos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-[#89AACC] hover:underline pt-1"
                  >
                    <span>Get Directions via Google Maps</span>
                    <Navigation className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Phone & Direct Calling */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#89AACC]">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-sm font-bold text-white">Telephone Concierge</h4>
                  <p className="text-xs text-slate-300 font-mono">09015104502</p>
                  <a
                    href="tel:09015104502"
                    className="inline-block text-[11px] font-mono text-[#89AACC] hover:underline"
                  >
                    Call Studio Directly
                  </a>
                </div>
              </div>

              {/* WhatsApp Link */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-sm font-bold text-white">WhatsApp Studio Manager</h4>
                  <p className="text-xs text-slate-300 font-mono">+234 901 510 4502</p>
                  <a
                    href="https://wa.me/2349015104502?text=Hello%20SonicVault%2C%20I%20would%20like%20to%20enquire%20about%20a%20studio%20session."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-[11px] font-mono text-emerald-400 hover:underline"
                  >
                    Chat on WhatsApp (Instant Response)
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#89AACC]">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-sm font-bold text-white">Official Studio Email</h4>
                  <a
                    href="mailto:Sonicvaultstudios@gmail.com"
                    className="text-xs text-slate-300 font-mono hover:text-white transition-colors"
                  >
                    Sonicvaultstudios@gmail.com
                  </a>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#89AACC]">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-sm font-bold text-white">Session Hours</h4>
                  <p className="text-xs text-slate-300">
                    Monday – Sunday: 24/7 By Appointment Only
                  </p>
                  <span className="text-[10px] font-mono text-emerald-400 block">
                    • Lockout and overnight sessions available
                  </span>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-2 border-t border-white/5 flex items-center gap-3 text-xs text-slate-400">
                <Instagram className="w-4 h-4 text-[#89AACC]" />
                <span className="font-mono">Handle: @SONICVAULTSTUDIO38</span>
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
