import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LoadingScreen from './components/loader/LoadingScreen';
import Navbar from './components/layout/Navbar';
import StudioFooter from './components/layout/StudioFooter';
import BookingModal from './components/booking/BookingModal';
import FloatingChatbot from './components/chat/FloatingChatbot';
import FloatingWhatsApp from './components/chat/FloatingWhatsApp';
import ScrollToTop from './components/common/ScrollToTop';
import { AudioPlayerProvider } from './context/AudioPlayerContext';
import GlobalAudioPlayer from './components/audio/GlobalAudioPlayer';

// Dedicated Route Pages
import HomePage from './pages/HomePage';
import StudioTourPage from './pages/StudioTourPage';
import ServicesPage from './pages/ServicesPage';
import EquipmentPage from './pages/EquipmentPage';
import PortfolioPage from './pages/PortfolioPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BookingPage from './pages/BookingPage';
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage';
import TermsPage from './pages/legal/TermsPage';
import BookingPolicyPage from './pages/legal/BookingPolicyPage';
import PaymentPolicyPage from './pages/legal/PaymentPolicyPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

function AppLayout() {
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      return !window.location.href.includes('noload');
    }
    return true;
  });
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);
  const location = useLocation();

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

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#040609] text-slate-100 flex flex-col font-sans selection:bg-[#4E85BF] selection:text-white">
      <ScrollToTop />

      {/* 1. Initial Cinematic Loading Screen on initial entry */}
      {isLoading && !isAdminRoute && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}

      {/* 2. Global Navbar (hidden on private admin area) */}
      {!isAdminRoute && <Navbar onOpenBooking={handleOpenBooking} />}

      {/* 3. Multi-page Routes */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage onOpenBooking={handleOpenBooking} />} />
          <Route path="/studio" element={<StudioTourPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/our-work" element={<PortfolioPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/book-session" element={<BookingPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/booking-policy" element={<BookingPolicyPage />} />
          <Route path="/payment-policy" element={<PaymentPolicyPage />} />
          
          {/* Admin Routes - Strictly separate & private */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {/* 4. Global Floating Tools (Customer Concierge) */}
      {!isAdminRoute && (
        <>
          <FloatingChatbot />
          <FloatingWhatsApp />
          <GlobalAudioPlayer />
        </>
      )}

      {/* 5. Global Studio Footer */}
      {!isAdminRoute && <StudioFooter onOpenBooking={handleOpenBooking} />}

      {/* 6. Quick Interactive Booking Modal Trigger */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        initialRoomId={selectedService}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AudioPlayerProvider>
        <AppLayout />
      </AudioPlayerProvider>
    </BrowserRouter>
  );
}
