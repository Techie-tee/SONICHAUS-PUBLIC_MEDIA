import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight, Sparkles, Award, ShieldCheck, Heart, Radio, Music } from 'lucide-react';
import { TeamMember } from '../types';
import BrandLogo, { SonicVaultVectorMark } from '../components/common/BrandLogo';
import StudioApproach from '../components/sections/StudioApproach';
import JournalSection from '../components/sections/JournalSection';

export default function AboutPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/team')
      .then((res) => res.json())
      .then((data) => {
        setTeam(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load team:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#040609] text-slate-100 pt-28 pb-24 px-4 sm:px-6 lg:px-12 font-sans selection:bg-[#4E85BF] selection:text-white">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Hero Banner */}
        <div className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#89AACC]">
            <Sparkles className="w-3.5 h-3.5 text-[#4E85BF]" />
            <span>ORIGIN & MISSION · 38 OLANREWAJU NINALOWO, LEKKI PHASE 1</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase leading-[1.05]">
            WHERE SOUND / BECOMES ART.
          </h1>
          <p className="about-hero-quote text-slate-300 text-base sm:text-lg font-editorial italic leading-relaxed">
            "We did not build SONICVAULT STUDIOS to be another commercial rental room in Lagos. We built an uncompromising architectural sanctuary where the most ambitious ideas in contemporary African and global music are given infinite space to flourish."
          </p>
        </div>

        {/* Studio Origin & Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6 text-sm sm:text-base leading-relaxed">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
              THE LEKKI PHASE 1 SANCTUARY
            </h2>
            <p className="about-genesis-text text-slate-300 leading-relaxed font-normal">
              Situated at 38 Olanrewaju Ninalowo Crescent in the heart of Lekki Phase 1, SONICVAULT STUDIOS was conceived from a fundamental realization: great music requires more than expensive microphones. It requires an environment of complete acoustic honesty, emotional security, and unhurried creative focus.
            </p>
            <p className="about-genesis-text text-slate-300 leading-relaxed font-normal">
              In a city that never stops vibrating, the Vault offers complete decoupling. Floating concrete slabs, 80dB isolation airspaces, and custom bass traps create a whisper-quiet baseline (NC-15) where the breath of a vocalist, the resonance of a nylon string, or the weight of an 808 transient can be heard with forensic clarity.
            </p>
            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-2xl font-display font-bold text-[#89AACC]">NC-15</span>
                <span className="text-xs font-mono text-slate-400 block">Noise Criteria Rating</span>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-2xl font-display font-bold text-[#4E85BF]">24/7</span>
                <span className="text-xs font-mono text-slate-400 block">Private Lockout Sessions</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 aspect-[4/3] shadow-2xl">
              <img
                src="/assets/images/studio_01_entrance_1792446831639.jpg"
                alt="SonicVault Entrance"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-xs font-mono text-white/80">
                THE VAULT ENTRANCE · LEKKI PHASE 1, LAGOS
              </div>
            </div>
          </div>
        </div>

        {/* The 4 Core Pillars */}
        <div className="space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#89AACC] tracking-widest uppercase block">
              OUR CREATIVE COMMITMENT
            </span>
            <h2 className="font-display text-3xl font-extrabold text-white uppercase">
              THE FOUR SONIC PILLARS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#080b12] border border-white/10 space-y-3">
              <ShieldCheck className="w-6 h-6 text-[#4E85BF]" />
              <h3 className="font-display text-lg font-bold text-white">Acoustic Honesty</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No room hype, no artificial flutter. What you hear through our Genelec point-source monitors is identical to what the world hears.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#080b12] border border-white/10 space-y-3">
              <Radio className="w-6 h-6 text-[#89AACC]" />
              <h3 className="font-display text-lg font-bold text-white">Analog Warmth</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Discrete transformers, vacuum tube compression, and SSL summing that breathe palpable weight, depth, and character into every stem.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#080b12] border border-white/10 space-y-3">
              <Heart className="w-6 h-6 text-[#4E85BF]" />
              <h3 className="font-display text-lg font-bold text-white">Artist Sanctuary</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Strict appointment-only policies guarantee zero uninvited foot traffic. Your session is private, protected, and fully dedicated to the art.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#080b12] border border-white/10 space-y-3">
              <Award className="w-6 h-6 text-[#89AACC]" />
              <h3 className="font-display text-lg font-bold text-white">Global Translation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calibrated to Apple Digital Masters and Spotify true-peak standards so your records translate powerfully on earbuds or stadium rigs.
              </p>
            </div>
          </div>
        </div>

        {/* Master Brand Identity & Architectural Emblem Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="brand-emblem-showcase relative rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#070D1A] via-[#040710] to-[#020307] border border-cyan-500/40 shadow-[0_0_50px_rgba(0,240,255,0.18)] overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-black/70 border border-white/10 text-center shadow-2xl">
              <SonicVaultVectorMark size={140} className="drop-shadow-[0_0_30px_rgba(0,240,255,0.6)]" />
              <div className="mt-6">
                <BrandLogo variant="horizontal" size="md" showTagline={true} />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono tracking-widest uppercase font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>THE BRAND EMBLEM & ACOUSTIC IDENTITY</span>
              </div>
              <h3 className="brand-emblem-title font-display text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-[0_2px_20px_rgba(0,240,255,0.6)]">
                ANATOMY OF THE SONICVAULT MARK
              </h3>
              <p className="text-slate-200 text-sm leading-relaxed font-normal">
                Our emblem represents the fusion of an uncompromising bank vault portal and an analog waveform. The outer polished titanium bezel houses precision locking lugs representing sound isolation, while the glowing electric cyan resonance ring and acoustic frequencies converge on the interlocking champagne gold <span className="text-[#FDE68A] font-bold">SV</span> monogram.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 text-xs">
                  <span className="font-display font-bold text-white block text-sm">Acoustic Vault</span>
                  <span className="text-slate-300 text-[11px]">80dB Decoupled Sanctuary</span>
                </div>
                <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs">
                  <span className="font-display font-bold text-cyan-300 block text-sm">Cyan Resonance</span>
                  <span className="text-slate-300 text-[11px]">Sub-bass Frequency Flow</span>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs">
                  <span className="font-display font-bold text-[#FDE68A] block text-sm">Gold Monogram</span>
                  <span className="text-slate-300 text-[11px]">Precision Sound Craft</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Team Section (Founder Presented First) */}
        <div className="space-y-10">
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#89AACC] tracking-widest uppercase block">
              THE PEOPLE BEHIND THE SOUND
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white uppercase">
              STUDIO ARCHITECTS & ENGINEERS
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              Meet the executive leadership and sound engineers dedicated to shaping each frequency.
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs font-mono">
              Loading team directory...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <div
                  key={member.id}
                  className={`team-member-card rounded-2xl p-5 border flex flex-col justify-between space-y-4 transition-all duration-300 ${
                    member.isFounder
                      ? 'is-founder bg-gradient-to-b from-[#0c1322] to-[#080b12] border-[#4E85BF]/60 shadow-[0_10px_30px_rgba(78,133,191,0.2)]'
                      : 'bg-[#080b12] border-white/10'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/10 shadow-inner">
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-full h-full object-cover object-center"
                        referrerPolicy="no-referrer"
                      />
                      {member.isFounder && (
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#4E85BF] text-white text-[9px] font-mono font-bold tracking-wider uppercase shadow-md">
                          FOUNDER
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-display text-lg font-bold text-white">
                        {member.name}
                      </h3>
                      <span className="text-xs font-mono text-[#89AACC] block">
                        {member.role}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 block">
                        {member.title}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>

                  {member.credits && member.credits.length > 0 && (
                    <div className="pt-3 border-t border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block">CREDITS & FOCUS</span>
                      <ul className="text-[11px] text-slate-400 space-y-1">
                        {member.credits.map((c, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-[#4E85BF] font-bold">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* The SonicVault Approach & Production Philosophy */}
        <div className="pt-8 border-t border-white/10">
          <StudioApproach />
        </div>

        {/* Journal from the Control Room */}
        <div className="pt-8 border-t border-white/10">
          <JournalSection />
        </div>

        {/* Closing CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 pt-16 border-t border-white/10 text-center space-y-4"
        >
          <span className="text-xs font-mono text-[#89AACC] tracking-widest uppercase block font-semibold">
            CREATE YOUR LEGACY
          </span>
          <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            YOUR NEXT GREAT RECORD STARTS HERE.
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
            Experience the difference of recording in a world-class environment in Lekki Phase 1, Lagos.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/book-session"
              className="py-3.5 px-7 rounded-full accent-gradient text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              BOOK A SESSION
            </Link>
            <Link
              to="/contact"
              className="about-contact-btn py-3.5 px-7 rounded-full bg-[#090D16] text-white border border-white/20 font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-[#111827] hover:border-[#4E85BF] hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center"
            >
              CONTACT THE TEAM
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
