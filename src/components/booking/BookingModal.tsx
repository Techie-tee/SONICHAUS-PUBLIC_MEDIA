import { useState, useId } from 'react';
import { X, Calendar, Clock, User, CheckCircle2, ShieldCheck, Sparkles, Sliders } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoomId?: string;
}

const ROOM_OPTIONS = [
  { id: 'vocal-booth', name: 'The Vault Vocal Booth', baseRatePerHour: 110, minHours: 4 },
  { id: 'recording-room', name: 'Studio A Live Recording Hall', baseRatePerHour: 220, minHours: 5 },
  { id: 'control-room', name: 'Master Control Suite (SSL 4000 G+)', baseRatePerHour: 195, minHours: 4 },
  { id: 'production-lab', name: 'Lab B Electronic Production Suite', baseRatePerHour: 135, minHours: 3 },
  { id: 'lockout', name: 'Full Facility Lockout (All Spaces)', baseRatePerHour: 480, minHours: 8 },
];

export default function BookingModal({ isOpen, onClose, initialRoomId }: BookingModalProps) {
  const roomIdSelectId = useId();
  const sessionTypeSelectId = useId();
  const durationSelectId = useId();
  const engineerSelectId = useId();
  const sessionDateInputId = useId();
  const timeSlotSelectId = useId();
  const clientNameInputId = useId();
  const clientEmailInputId = useId();
  const projectNameInputId = useId();
  const sessionNotesTextareaId = useId();

  const [selectedRoomId, setSelectedRoomId] = useState(initialRoomId || 'recording-room');
  const [sessionType, setSessionType] = useState('Tracking & Recording');
  const [durationHours, setDurationHours] = useState(8);
  const [sessionDate, setSessionDate] = useState('2026-11-05');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 6:00 PM');
  const [engineerTier, setEngineerTier] = useState<'self' | 'staff' | 'senior'>('staff');

  // Add-ons
  const [tapeAddon, setTapeAddon] = useState(false);
  const [hospitalityAddon, setHospitalityAddon] = useState(false);
  const [videoAddon, setVideoAddon] = useState(false);

  // Client Details
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectName, setProjectName] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const currentRoom = ROOM_OPTIONS.find((r) => r.id === selectedRoomId) || ROOM_OPTIONS[1];

  // Price calculations
  const baseRoomTotal = currentRoom.baseRatePerHour * durationHours;
  const engineerCost = engineerTier === 'self' ? 0 : engineerTier === 'staff' ? 350 : 850;
  const tapeCost = tapeAddon ? 250 : 0;
  const hospitalityCost = hospitalityAddon ? 180 : 0;
  const videoCost = videoAddon ? 400 : 0;
  const grandTotal = baseRoomTotal + engineerCost + tapeCost + hospitalityCost + videoCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    audioEngine.playClick();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#090d16] border border-white/15 rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-2xl my-4 sm:my-8 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          /* Submission Confirmation View */
          <div className="text-center py-10 space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                SESSION RESERVATION CONFIRMED
              </span>
              <h3 className="text-3xl font-extrabold font-display">
                Welcome to SONICVAULT STUDIOS
              </h3>
              <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                Thank you <strong className="text-white">{clientName || 'Artist'}</strong>. Your booking request for <span className="text-sky-400 font-semibold">{currentRoom.name}</span> on <strong className="text-white">{sessionDate}</strong> has been logged.
              </p>
            </div>

            <div className="max-w-md mx-auto p-5 rounded-2xl bg-white/5 border border-white/10 text-left space-y-3 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Room:</span>
                <span className="text-white font-semibold">{currentRoom.name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Session Type:</span>
                <span className="text-white">{sessionType}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Scheduled Time:</span>
                <span className="text-white">{timeSlot}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Duration:</span>
                <span className="text-white">{durationHours} Hours</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Engineer:</span>
                <span className="text-white capitalize">{engineerTier} Engineer</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-sky-400">
                <span>Total Investment:</span>
                <span>${grandTotal}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Our studio manager will reach out via <strong className="text-slate-200">{clientEmail || 'email'}</strong> within 2 hours to confirm input list and patch routing.
            </p>

            <button
              onClick={handleReset}
              className="px-8 py-3 rounded-xl bg-white hover:bg-sky-400 text-black font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Return To Studio Tour
            </button>
          </div>
        ) : (
          /* Interactive Booking Form */
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-widest text-sky-400">
                SESSION RESERVATION & CONFIGURATOR
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display">
                Book Your Studio Session
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Customize your studio room, duration, engineering tier, and analog tape options. Transparent pricing with instant availability lock.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Studio Room */}
              <div className="space-y-2">
                <label htmlFor={roomIdSelectId} className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                  Select Studio Space
                </label>
                <select
                  id={roomIdSelectId}
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-sky-400 focus:outline-none cursor-pointer"
                >
                  {ROOM_OPTIONS.map((room) => (
                    <option key={room.id} value={room.id} className="bg-slate-900 text-white">
                      {room.name} (${room.baseRatePerHour}/hr)
                    </option>
                  ))}
                </select>
              </div>

              {/* Session Type */}
              <div className="space-y-2">
                <label htmlFor={sessionTypeSelectId} className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                  Session Type
                </label>
                <select
                  id={sessionTypeSelectId}
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-sky-400 focus:outline-none cursor-pointer"
                >
                  <option value="Tracking & Recording" className="bg-slate-900 text-white">Tracking & Vocal Recording</option>
                  <option value="Analog Mixing" className="bg-slate-900 text-white">Analog Console Mixing (SSL 4000)</option>
                  <option value="Mastering" className="bg-slate-900 text-white">Analog Stereo Tape Mastering</option>
                  <option value="Writing Camp" className="bg-slate-900 text-white">Production & Songwriting Residency</option>
                  <option value="Dolby Atmos" className="bg-slate-900 text-white">Dolby Atmos 9.1.4 Spatial Mix</option>
                </select>
              </div>

              {/* Duration Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <label htmlFor={durationSelectId} className="uppercase tracking-wider text-slate-400">Duration (Hours)</label>
                  <span className="text-sky-400 font-bold">{durationHours} Hours</span>
                </div>
                <input
                  id={durationSelectId}
                  type="range"
                  min="4"
                  max="14"
                  step="1"
                  value={durationHours}
                  onChange={(e) => {
                    setDurationHours(parseInt(e.target.value));
                    audioEngine.playFaderMove();
                  }}
                  className="w-full accent-sky-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>Half Day (4h)</span>
                  <span>Full Day (8h)</span>
                  <span>Extended Lockout (14h)</span>
                </div>
              </div>

              {/* Engineering Tier */}
              <div className="space-y-2">
                <label htmlFor={engineerSelectId} className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                  Engineering Tier
                </label>
                <select
                  id={engineerSelectId}
                  value={engineerTier}
                  onChange={(e) => setEngineerTier(e.target.value as typeof engineerTier)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-sky-400 focus:outline-none cursor-pointer"
                >
                  <option value="staff" className="bg-slate-900 text-white">Resident Staff Engineer (+$350/session)</option>
                  <option value="senior" className="bg-slate-900 text-white">Senior Master / Grammy-Nominated Engineer (+$850)</option>
                  <option value="self" className="bg-slate-900 text-white">Bring Your Own Engineer ($0 / Assistant included)</option>
                </select>
              </div>

              {/* Date & Time Slot */}
              <div className="space-y-2">
                <label htmlFor={sessionDateInputId} className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                  Target Session Date
                </label>
                <input
                  id={sessionDateInputId}
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor={timeSlotSelectId} className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                  Time Block
                </label>
                <select
                  id={timeSlotSelectId}
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-sky-400 focus:outline-none cursor-pointer"
                >
                  <option value="10:00 AM - 6:00 PM" className="bg-slate-900 text-white">Day Session (10:00 AM - 6:00 PM)</option>
                  <option value="6:00 PM - 2:00 AM" className="bg-slate-900 text-white">Night Owl Session (6:00 PM - 2:00 AM)</option>
                  <option value="24-Hour Lockout" className="bg-slate-900 text-white">24-Hour Full Facility Lockout</option>
                </select>
              </div>
            </div>

            {/* Optional Hardware Add-Ons */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <span className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                Optional Analog Hardware Add-Ons
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer text-xs transition-colors ${tapeAddon ? 'border-sky-400 bg-sky-950/40 text-white' : 'border-white/10 bg-white/5 text-slate-300'}`}>
                  <input
                    type="checkbox"
                    checked={tapeAddon}
                    onChange={(e) => setTapeAddon(e.target.checked)}
                    className="accent-sky-400"
                  />
                  <span>Studer 2" Tape Reel (+$250)</span>
                </label>

                <label className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer text-xs transition-colors ${hospitalityAddon ? 'border-sky-400 bg-sky-950/40 text-white' : 'border-white/10 bg-white/5 text-slate-300'}`}>
                  <input
                    type="checkbox"
                    checked={hospitalityAddon}
                    onChange={(e) => setHospitalityAddon(e.target.checked)}
                    className="accent-sky-400"
                  />
                  <span>Private Chef Lounge (+$180)</span>
                </label>

                <label className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer text-xs transition-colors ${videoAddon ? 'border-sky-400 bg-sky-950/40 text-white' : 'border-white/10 bg-white/5 text-slate-300'}`}>
                  <input
                    type="checkbox"
                    checked={videoAddon}
                    onChange={(e) => setVideoAddon(e.target.checked)}
                    className="accent-sky-400"
                  />
                  <span>4K Multi-Cam Capture (+$400)</span>
                </label>
              </div>
            </div>

            {/* Client Contact Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
              <div className="space-y-1">
                <label htmlFor={clientNameInputId} className="block text-[11px] font-mono uppercase text-slate-400">Artist / Contact Name</label>
                <input
                  id={clientNameInputId}
                  type="text"
                  required
                  placeholder="e.g. Jordan Scott"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor={clientEmailInputId} className="block text-[11px] font-mono uppercase text-slate-400">Email Address</label>
                <input
                  id={clientEmailInputId}
                  type="email"
                  required
                  placeholder="artist@label.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor={projectNameInputId} className="block text-[11px] font-mono uppercase text-slate-400">Project / Album Title</label>
                <input
                  id={projectNameInputId}
                  type="text"
                  placeholder="e.g. Midnight Horizon EP"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor={sessionNotesTextareaId} className="block text-[11px] font-mono uppercase text-slate-400">Technical Notes / Gear Requests</label>
              <textarea
                id={sessionNotesTextareaId}
                rows={2}
                placeholder="Mention specific microphone preferences, drum setup requirements, or sample rate (e.g. 96kHz / 24-bit)."
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-sky-400 focus:outline-none"
              />
            </div>

            {/* Total Summary & Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-xs font-mono text-slate-400 block uppercase">Calculated Session Total</span>
                <span className="text-3xl font-extrabold text-white font-mono tracking-tight">${grandTotal}</span>
                <span className="text-[11px] text-slate-400 block">Includes studio assistant & facility amenities</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-black text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(56,189,248,0.35)] cursor-pointer"
              >
                Confirm & Lock Session
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
