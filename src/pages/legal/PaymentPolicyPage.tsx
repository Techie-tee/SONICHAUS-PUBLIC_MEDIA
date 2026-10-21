import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard } from 'lucide-react';

export default function PaymentPolicyPage() {
  return (
    <div className="min-h-screen bg-[#040609] text-slate-100 pt-28 pb-24 px-4 sm:px-6 lg:px-12 font-sans selection:bg-[#4E85BF] selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> BACK TO HOMEPAGE
        </Link>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#89AACC]">
            <CreditCard className="w-3.5 h-3.5 text-[#4E85BF]" />
            <span>FINANCIAL & TRANSACTION INTEGRITY</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight">
            PAYMENT POLICY
          </h1>
          <p className="text-xs font-mono text-slate-500">
            Secure transactions, accepted currencies, and invoicing policies
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#080b12] p-6 sm:p-10 rounded-2xl border border-white/10">
          <section className="space-y-2">
            <h2 className="font-display text-lg font-bold text-white">1. Accepted Payment Channels</h2>
            <p>
              SONICVAULT STUDIOS processes all electronic payments through Paystack. We accept Nigerian Naira (NGN / ₦) debit/credit cards (Mastercard, Visa, Verve), direct bank transfers via Nigerian commercial banks, and authorized USSD codes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-bold text-white">2. International Clients & Wire Transfers</h2>
            <p>
              For international label bookings, diaspora lockouts, or corporate commercial productions requiring foreign currency settlement (USD, GBP, EUR), please coordinate directly with our finance team for official corporate domiciliary invoice instructions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-lg font-bold text-white">3. Receipts and VAT Invoices</h2>
            <p>
              Automated electronic receipts with unique transaction references (`SV_PSTK_...`) are issued immediately upon Paystack verification. Formal corporate VAT tax invoices are generated upon request for registered record labels and corporate production houses.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
