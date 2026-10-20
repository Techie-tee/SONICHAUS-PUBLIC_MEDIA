import { useState, useCallback } from 'react';
import LoadingScreen from './components/loader/LoadingScreen';
import Navbar from './components/layout/Navbar';
import CinematicHero from './components/hero/CinematicHero';
import SonicPhilosophy from './components/sections/SonicPhilosophy';
import ServicesSection from './components/sections/ServicesSection';
import StudioGallery from './components/sections/StudioGallery';
import GearLocker from './components/studio/GearLocker';
import SelectedWork from './components/sections/SelectedWork';
import JournalSection from './components/sections/JournalSection';
import VisualExplorations from './components/sections/VisualExplorations';
import StudioApproach from './components/sections/StudioApproach';
import BookingSection from './components/sections/BookingSection';
import FinalCinematicCTA from './components/sections/FinalCinematicCTA';
import StudioFooter from './components/layout/StudioFooter';
import BookingModal from './components/booking/BookingModal';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleOpenBooking = useCallback((serviceOrRoom?: string) => {
    setSelectedService(serviceOrRoom);
    setIsBookingOpen(true);
  }, []);

  const handleCloseBooking = useCallback(() => {
    setIsBookingOpen(false);
  }, []);

  const handleExploreSpaces = useCallback(() => {
    const spacesElem = document.getElementById('spaces');
    if (spacesElem) {
      spacesElem.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#040609] text-slate-100 flex flex-col font-sans selection:bg-[#4E85BF] selection:text-white">
      {/* 1. Cinematic Loading Screen (Initial Entry Animation) */}
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* 2. Floating Pill Navbar */}
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* 3. Existing Cinematic Hero & Studio Scroll Tour (Source of Truth) */}
      <CinematicHero
        onOpenBooking={handleOpenBooking}
        onExploreSpaces={handleExploreSpaces}
      />

      {/* 4. Section — The Sonic Philosophy (Beyond The Sound) */}
      <SonicPhilosophy />

      {/* 5. Section — Services (What We Do · 9 Editorial Services) */}
      <ServicesSection onSelectService={handleOpenBooking} />

      {/* 6. Section — Explore The Studio (The Space Behind The Sound · Photographic Gallery) */}
      <StudioGallery onOpenBooking={() => handleOpenBooking()} />

      {/* 7. Section — Equipment (Tools of The Craft · The Verified Gear Locker) */}
      <GearLocker />

      {/* 8. Section — Selected Work (Sound That Stays With You · Audio Bento Grid) */}
      <SelectedWork onOpenBooking={handleOpenBooking} />

      {/* 9. Section — Journal (From The Control Room · Creative Process Notes) */}
      <JournalSection />

      {/* 10. Section — Visual Explorations (Where Sound Becomes Vision · Parallax Gallery) */}
      <VisualExplorations />

      {/* 11. Section — Why SonicVault (The SonicVault Approach · 4 Pillars) */}
      <StudioApproach />

      {/* 12. Section — Book A Session (Let's Make Something Real · Form & WhatsApp) */}
      <BookingSection initialService={selectedService} />

      {/* 13. Section — Final Cinematic CTA (Continuous Marquee & Resolution) */}
      <FinalCinematicCTA onOpenBooking={() => handleOpenBooking()} />

      {/* 14. Studio Footer (Official Lagos Contact Details & Verified Monogram) */}
      <StudioFooter onOpenBooking={() => handleOpenBooking()} />

      {/* 15. Quick Interactive Session Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        initialRoomId={selectedService}
      />
    </div>
  );
}
