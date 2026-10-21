import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#040609] text-slate-100 pt-28 pb-24 px-4 sm:px-6 lg:px-12 font-sans selection:bg-[#4E85BF] selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> BACK TO HOMEPAGE
        </Link>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#89AACC]">
            <Shield className="w-3.5 h-3.5 text-[#4E85BF]" />
            <span>LEGAL DOCUMENTATION · LEKKI PHASE 1, LAGOS</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight">
            PRIVACY POLICY
          </h1>
          <p className="text-xs font-mono text-slate-500">
            Last Updated: October 2026 · SonicVault Studios Ltd.
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#080b12] p-6 sm:p-10 rounded-2xl border border-white/10">
          <section className="space-y-2">
            <h2 className="font-display text-lg font-bold text-white">1. Scope and Information We Collect</h2>
            <p>
              SONICVAULT STUDIOS ("we", "our", "the Studio"), located at 38 Olanrewaju Ninalowo Crescent, Lekki Phase 1, Lagos State, Nigeria, respects client creative confidentiality and personal data rights under the Nigeria Data Protection Act (NDPA).
            </p>
            <p>
              We collect information necessary to reserve studio sessions, execute audio recording agreements, and process payments: full legal name, artist alias, email address, telephone/WhatsApp contact number, project details, and payment transaction references generated via Paystack.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-bold text-white">2. Audio Recordings and Creative Intellectual Property</h2>
            <p>
              Audio multi-tracks, master stems, project files, and demo takes recorded on our premises remain the absolute intellectual property of the commissioning client/artist, subject to full settlement of session invoices. We do not distribute, broadcast, or publish client audio without explicit written consent.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-bold text-white">3. Payment Security & Third-Party Processors</h2>
            <p>
              All online credit/debit card, USSD, and bank transfer transactions are securely tokenized through Paystack Payment Systems. SonicVault Studios does not store, inspect, or retain raw credit card numbers or banking PINs on its servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-bold text-white">4. Data Retention and Contact</h2>
            <p>
              Session files and stem archives are stored on redundant studio network arrays for thirty (30) days following session completion. For privacy inquiries or data removal, contact our data protection officer at <span className="text-[#89AACC] font-mono">Sonicvaultstudios@gmail.com</span> or via WhatsApp at <span className="text-[#89AACC] font-mono">+234 901 510 4502</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
