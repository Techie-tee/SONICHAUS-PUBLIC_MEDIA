import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, Clock, Sparkles, Layers, Sliders, ChevronDown, ChevronUp, FileCheck } from 'lucide-react';
import { ServiceItem } from '../types';
import RatesSection from '../components/studio/RatesSection';

const JOURNEY_STEPS = [
  { step: '01', title: 'IDEA', desc: 'Concept, harmonic progression, reference listening & creative brief.' },
  { step: '02', title: 'RECORD', desc: 'Tracking through tube mics, Neve preamps & zero-noise acoustic rooms.' },
  { step: '03', title: 'PRODUCE', desc: 'Custom sound design, percussion layering, analog synth tracking.' },
  { step: '04', title: 'MIX', desc: 'Analog summing, SSL bus gluing, dynamic sculpting & spatial depth.' },
  { step: '05', title: 'MASTER', desc: 'True-peak calibration, harmonic excitation & global streaming specs.' },
  { step: '06', title: 'RELEASE', desc: 'ISRC metadata, stems archiving, high-res commercial audio delivery.' },
];

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        if (data.length > 0) setExpandedService(data[0].id);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load services:', err);
        setLoading(false);
      });
  }, []);

  const handleBookService = (serviceId: string, packageId?: string) => {
    navigate(`/book-session?service=${serviceId}${packageId ? `&package=${packageId}` : ''}`);
  };

  return (
    <div className="min-h-screen bg-[#040609] text-slate-100 pt-28 pb-24 px-4 sm:px-6 lg:px-12 font-sans selection:bg-[#4E85BF] selection:text-white">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#89AACC]">
            <Sparkles className="w-3.5 h-3.5 text-[#4E85BF]" />
            <span>FULL PRODUCTION DISCIPLINE · LEKKI PHASE 1</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white uppercase">
            STUDIO DISCIPLINES & SERVICES.
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            From the initial voice memo to the definitive international master. 
            Every service at SONICVAULT is powered by verified analog hardware, precision acoustics, and seasoned creative engineers.
          </p>
        </div>

        {/* Visual Production Journey */}
        <div className="bg-[#0b0f17] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <span className="text-xs font-mono text-[#89AACC] tracking-widest uppercase">
              THE SONICVAULT RECORD CREATION ARCHITECTURE
            </span>
            <span className="text-xs font-mono text-slate-400">
              IDEA → RECORD → PRODUCE → MIX → MASTER → RELEASE
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {JOURNEY_STEPS.map((j) => (
              <div key={j.step} className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-2 group hover:border-[#4E85BF]/40 transition-colors">
                <span className="text-[10px] font-mono text-[#4E85BF] font-bold block">{j.step}</span>
                <h4 className="font-display text-sm font-bold text-white tracking-wider">{j.title}</h4>
                <p className="text-[11px] text-slate-400 leading-snug">{j.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Services List with Expandable Deep Dives */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
              AVAILABLE SERVICES & SESSIONS
            </h2>
            <span className="text-xs font-mono text-slate-400">
              {services.length} VERIFIED OFFERINGS
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs font-mono">
              Loading service catalogue from studio database...
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((srv) => {
                const isExpanded = expandedService === srv.id;
                return (
                  <div
                    key={srv.id}
                    className={`rounded-2xl border transition-all duration-300 ${
                      isExpanded
                        ? 'bg-[#0a0e16] border-[#4E85BF]/50 shadow-[0_10px_30px_rgba(78,133,191,0.15)]'
                        : 'bg-[#080b12] border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Header Bar */}
                    <div
                      onClick={() => setExpandedService(isExpanded ? null : srv.id)}
                      className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#89AACC]">
                            {srv.category.replace('_', ' ')}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            Room: {srv.verifiedRoom}
                          </span>
                          {!srv.isPriceApproved && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                              PROPOSED RATES
                            </span>
                          )}
                        </div>
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-wide">
                          {srv.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                          {srv.tagline}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-slate-500 block">STARTING AT</span>
                          <span className="font-display text-lg sm:text-xl font-bold text-[#89AACC]">
                            ₦{srv.draftPriceNgn.toLocaleString()}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 block">
                            {srv.pricingType === 'hourly' ? '/ hour' : '/ track'}
                          </span>
                        </div>
                        <div className="p-2 rounded-full bg-white/5 text-slate-400">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Technical & Booking Body */}
                    {isExpanded && (
                      <div className="px-5 pb-6 sm:px-6 sm:pb-8 pt-2 border-t border-white/10 space-y-6 animate-in fade-in duration-200">
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                          {srv.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Deliverables */}
                          <div className="bg-[#05080e] p-4 rounded-xl border border-white/5 space-y-2.5">
                            <div className="flex items-center gap-2 text-xs font-mono text-[#89AACC] font-semibold">
                              <FileCheck className="w-4 h-4 text-[#4E85BF]" />
                              <span>INCLUDED DELIVERABLES</span>
                            </div>
                            <ul className="space-y-1.5 text-xs text-slate-300">
                              {srv.deliverables.map((del, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{del}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Process Steps */}
                          <div className="bg-[#05080e] p-4 rounded-xl border border-white/5 space-y-2.5">
                            <div className="flex items-center gap-2 text-xs font-mono text-[#89AACC] font-semibold">
                              <Layers className="w-4 h-4 text-[#4E85BF]" />
                              <span>STUDIO WORKFLOW</span>
                            </div>
                            <ul className="space-y-1.5 text-xs text-slate-300">
                              {srv.processSteps.map((step, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="w-4 h-4 rounded-full bg-white/10 text-[10px] font-mono flex items-center justify-center shrink-0 mt-0.5">
                                    {i + 1}
                                  </span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Preparation Requirements */}
                          <div className="bg-[#05080e] p-4 rounded-xl border border-white/5 space-y-2.5">
                            <div className="flex items-center gap-2 text-xs font-mono text-[#89AACC] font-semibold">
                              <Clock className="w-4 h-4 text-[#4E85BF]" />
                              <span>BEFORE ARRIVAL</span>
                            </div>
                            <ul className="space-y-1.5 text-xs text-slate-300">
                              {srv.preparationReqs.map((req, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#89AACC] shrink-0 mt-1.5" />
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Packages & Rates Cards */}
                        {srv.packages && srv.packages.length > 0 && (
                          <div className="space-y-3 pt-2">
                            <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase block">
                              CHOOSE A SESSION PACKAGE
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                              {srv.packages.map((pkg) => (
                                <div
                                  key={pkg.id}
                                  className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-3 hover:border-[#4E85BF] transition-colors"
                                >
                                  <div>
                                    <h4 className="font-display text-xs font-bold text-white">{pkg.name}</h4>
                                    <span className="text-[10px] font-mono text-slate-400 block mt-1">
                                      Duration: {pkg.durationHours} hours
                                    </span>
                                  </div>
                                  <div>
                                    <div className="text-base font-bold font-mono text-[#89AACC]">
                                      ₦{pkg.priceNgn.toLocaleString()}
                                    </div>
                                    <span className="text-[9px] font-mono text-slate-500 block">
                                      Deposit: ₦{pkg.depositNgn.toLocaleString()}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => handleBookService(srv.id, pkg.id)}
                                    className="w-full py-2 rounded-lg accent-gradient text-white text-[11px] font-semibold tracking-wider uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-1 cursor-pointer"
                                  >
                                    <span>SELECT PACKAGE</span>
                                    <ArrowUpRight className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Bar */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                          <button
                            onClick={() => handleBookService(srv.id)}
                            className="w-full sm:w-auto py-3 px-6 rounded-xl accent-gradient text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg cursor-pointer"
                          >
                            <span>BOOK THIS SERVICE DIRECTLY</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                          <a
                            href={`https://wa.me/2349015104502?text=${encodeURIComponent(`Hello SonicVault Studios, I would like to enquire about your ${srv.title} service.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 text-xs font-medium tracking-wide flex items-center justify-center transition-all cursor-pointer"
                          >
                            <span>WHATSAPP CONSULTATION</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Studio Lockout & Residency Rates */}
        <div className="pt-8 border-t border-white/10">
          <RatesSection onOpenBooking={(room) => navigate(`/book-session${room ? `?room=${room}` : ''}`)} />
        </div>
      </div>
    </div>
  );
}
