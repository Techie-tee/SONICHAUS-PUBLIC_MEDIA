import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';

export default function BookingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#040609] text-slate-100 pt-28 pb-24 px-4 sm:px-6 lg:px-12 font-sans selection:bg-[#4E85BF] selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> BACK TO HOMEPAGE
        </Link>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#89AACC]">
            <Calendar className="w-3.5 h-3.5 text-[#4E85BF]" />
            <span>SESSION RESERVATIONS & RESCHEDULING</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight">
            BOOKING & CANCELLATION POLICY
          </h1>
          <p className="text-xs font-mono text-slate-500">
            Rules ensuring fair access to the tracking floor and engineering talent
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#080b12] p-6 sm:p-10 rounded-2xl border border-white/10">
          <section className="space-y-2">
            <h2 className="font-display text-lg font-bold text-white">1. Deposit Requirement</h2>
            <p>
              To confirm and lock in studio time on our official calendar, a minimum 50% deposit (or full payment for single-hour bookings) must be completed via Paystack during checkout. Unpaid booking requests remain in pending status and do not hold the room.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-bold text-white">2. Rescheduling Policy</h2>
            <p>
              Clients may reschedule a session without penalty by notifying the studio manager at least forty-eight (48) hours prior to the booked time. The deposit will roll over completely to the newly agreed slot within sixty (60) days.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-bold text-white">3. Cancellations & No-Shows</h2>
            <p>
              Cancellations made less than 24 hours prior to session commencement, or client no-shows, will forfeit the 50% session deposit to cover reserved engineer and room lockout costs.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-bold text-white">4. Studio Disruption or Force Majeure</h2>
            <p>
              In the rare event of municipal power grid disruptions not bridged by our industrial soundproof generators, or technical hardware servicing, SonicVault Studios will immediately reschedule the session or issue a full refund at the client's discretion.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
