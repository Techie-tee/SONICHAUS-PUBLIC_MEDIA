import { useCallback } from 'react';
import CinematicHero from '../components/hero/CinematicHero';
import SonicPhilosophy from '../components/sections/SonicPhilosophy';
import ServicesSection from '../components/sections/ServicesSection';
import StudioGallery from '../components/sections/StudioGallery';
import GearLocker from '../components/studio/GearLocker';
import SelectedWork from '../components/sections/SelectedWork';
import JournalSection from '../components/sections/JournalSection';
import VisualExplorations from '../components/sections/VisualExplorations';
import StudioApproach from '../components/sections/StudioApproach';
import BookingSection from '../components/sections/BookingSection';
import FinalCinematicCTA from '../components/sections/FinalCinematicCTA';

interface HomePageProps {
  onOpenBooking: (serviceOrRoom?: string) => void;
}

export default function HomePage({ onOpenBooking }: HomePageProps) {
  const handleExploreSpaces = useCallback(() => {
    const spacesElem = document.getElementById('spaces');
    if (spacesElem) {
      spacesElem.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <main className="w-full">
      {/* 1. Cinematic Hero & 8-Scene Studio Scroll Tour */}
      <CinematicHero
        onOpenBooking={onOpenBooking}
        onExploreSpaces={handleExploreSpaces}
      />

      {/* 2. The Sonic Philosophy (Beyond The Sound · Great music needs more than a room) */}
      <SonicPhilosophy />

      {/* 3. Services Overview (9 Production Services) */}
      <ServicesSection onSelectService={onOpenBooking} />

      {/* 4. Studio Spaces & Architectural Environments */}
      <StudioGallery onOpenBooking={() => onOpenBooking()} />

      {/* 5. Tools of The Craft (Verified Gear Locker) */}
      <GearLocker />

      {/* 6. Selected Work (12-Column Desktop Bento Grid & Audio Showcase) */}
      <SelectedWork onOpenBooking={onOpenBooking} />

      {/* 7. Journal From The Control Room */}
      <JournalSection />

      {/* 8. Visual Explorations & Geometric Atmosphere */}
      <VisualExplorations />

      {/* 9. The SonicVault Approach (4 Pillars) */}
      <StudioApproach />

      {/* 10. Book A Session (Connected Booking Section & WhatsApp Concierge) */}
      <BookingSection />

      {/* 11. Final Cinematic CTA (Continuous Marquee & Resolution) */}
      <FinalCinematicCTA onOpenBooking={() => onOpenBooking()} />
    </main>
  );
}
