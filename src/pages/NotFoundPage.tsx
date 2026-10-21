import { Link } from 'react-router-dom';
import { ArrowLeft, Radio } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#040609] text-slate-100 flex items-center justify-center p-6 text-center font-sans selection:bg-[#4E85BF] selection:text-white">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 text-[#89AACC] mx-auto flex items-center justify-center">
          <Radio className="w-8 h-8 animate-pulse text-[#4E85BF]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono text-[#89AACC] uppercase tracking-widest block">
            404 · FREQUENCY NOT FOUND
          </span>
          <h1 className="font-display text-4xl font-extrabold text-white uppercase">
            SILENCE IN THE VAULT
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            The studio page or session link you requested does not exist or has been relocated within the acoustic archive.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            to="/"
            className="py-3 px-6 rounded-full accent-gradient text-white font-bold text-xs tracking-wider uppercase flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO THE VAULT</span>
          </Link>
          <Link
            to="/contact"
            className="py-3 px-5 rounded-full bg-white/5 border border-white/15 text-slate-300 hover:text-white text-xs font-mono transition-colors"
          >
            CONTACT STUDIO
          </Link>
        </div>
      </div>
    </div>
  );
}
