import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#040609] text-slate-100 pt-28 pb-24 px-4 sm:px-6 lg:px-12 font-sans selection:bg-[#4E85BF] selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> BACK TO HOMEPAGE
        </Link>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#89AACC]">
            <FileText className="w-3.5 h-3.5 text-[#4E85BF]" />
            <span>TERMS OF SERVICE · SONICVAULT STUDIOS</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight">
            TERMS & CONDITIONS
          </h1>
          <p className="text-xs font-mono text-slate-500">
            Governing Studio Usage at 38 Olanrewaju Ninalowo Crescent, Lekki Phase 1, Lagos State
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#080b12] p-6 sm:p-10 rounded-2xl border border-white/10">
          <section className="space-y-2">
            <h2 className="font-display text-lg font-bold text-white">1. Studio Access and Conduct</h2>
            <p>
              Access to SONICVAULT facilities is strictly restricted to confirmed session bookings. Clients and their authorized creative entourage must maintain professional studio decorum. Smoking, open flames, and unauthorized liquid containers in proximity to vintage microphones and analog outboard consoles are strictly prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-bold text-white">2. Studio Hardware Care and Liability</h2>
            <p>
              Clients are provided access to high-end acoustic gear including the Sony C-800G, Neumann U87 Ai, Tube-Tech CL 1B, and SSL console under the supervision of a certified SonicVault engineer. Malicious damage or gross negligence toward studio assets will incur full repair or replacement liability.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-bold text-white">3. Punctuality and Session Overtime</h2>
            <p>
              Session clock starts strictly at the confirmed booking hour. Punctuality is the client's responsibility. If subsequent studio scheduling permits, overtime will be billed at standard hourly rates calculated in 30-minute intervals.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-bold text-white">4. Stem Release and Handover</h2>
            <p>
              Uncompressed master audio stems (WAV files) will be released immediately upon verification of complete session payment balance.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
