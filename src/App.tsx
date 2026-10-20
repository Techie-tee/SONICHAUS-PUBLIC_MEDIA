import { useState } from 'react';
import CinematicHero from './components/hero/CinematicHero';
import StudioSpaces from './components/studio/StudioSpaces';
import GearLocker from './components/studio/GearLocker';
import AcousticalEngineering from './components/studio/AcousticalEngineering';
import RatesSection from './components/studio/RatesSection';
import StudioFooter from './components/layout/StudioFooter';
import BookingModal from './components/booking/BookingModal';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedBookingRoomId, setSelectedBookingRoomId] = useState<string | undefined>(undefined);

  const handleOpenBooking = (roomId?: string) => {
    setSelectedBookingRoomId(roomId);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  const handleExploreSpaces = () => {
    const spacesElem = document.getElementById('spaces');
    if (spacesElem) {
      spacesElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#05070c] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-black">
      {/* 1. Fullscreen Continuous 3D Cinematic Scroll Tour */}
      <CinematicHero
        onOpenBooking={handleOpenBooking}
        onExploreSpaces={handleExploreSpaces}
      />

      {/* 2. Interactive Studio Spaces & Schematics */}
      <StudioSpaces onSelectRoom={(roomId) => handleOpenBooking(roomId)} />

      {/* 3. Verified Gear Locker */}
      <GearLocker />

      {/* 4. Acoustical Architecture & Scientific Specs */}
      <AcousticalEngineering />

      {/* 5. Transparent Session Rates & Artist Residency */}
      <RatesSection onOpenBooking={handleOpenBooking} />

      {/* 6. Studio Footer */}
      <StudioFooter />

      {/* 7. Interactive Session Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        initialRoomId={selectedBookingRoomId}
      />
    </div>
  );
}
