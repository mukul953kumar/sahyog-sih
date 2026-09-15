import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FloatingVoiceButton } from './components/FloatingVoiceButton';
import { EmergencyModal } from './components/EmergencyModal';
import { BookingSuccessModal } from './components/BookingSuccessModal';
import { EShramCardModal } from './components/EShramCardModal';
import { DigiLockerModal } from './components/DigiLockerModal';
import { VoiceSearchModal } from './components/VoiceSearchModal';
import { DisputeModal } from './components/DisputeModal';
import { AuditReportModal } from './components/AuditReportModal';
import { SkillAssessmentModal } from './components/SkillAssessmentModal';
import { LocationModal } from './components/LocationModal';
import { LiveTrackingModal } from './components/LiveTrackingModal';
import { InvoiceModal } from './components/InvoiceModal';
import { CancelBookingModal } from './components/CancelBookingModal';
import { ReassignWorkerModal } from './components/ReassignWorkerModal';
import { OtpRefusalModal } from './components/OtpRefusalModal';
import { WardAuditModal } from './components/WardAuditModal';
import { ReviewRatingModal } from './components/ReviewRatingModal';

import { HomePage } from './pages/HomePage';
import { WorkersPage } from './pages/WorkersPage';
import { WorkerProfilePage } from './pages/WorkerProfilePage';
import { BookingCheckoutPage } from './pages/BookingCheckoutPage';
import { BookingsPage } from './pages/BookingsPage';
import { CommunityPage } from './pages/CommunityPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { WorkerDashboardPage } from './pages/WorkerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const AppContent = () => {
  const { currentView, isAuthenticated } = useApp();

  const isAuthScreen = currentView === 'login' || currentView === 'register';

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'workers':
        return <WorkersPage />;
      case 'worker-detail':
        return <WorkerProfilePage />;
      case 'booking':
        return <BookingCheckoutPage />;
      case 'bookings':
        return <BookingsPage />;
      case 'community':
        return <CommunityPage />;
      case 'worker-dashboard':
        return <WorkerDashboardPage />;
      case 'admin-dashboard':
        return <AdminDashboardPage />;
      case 'profile':
        return <ProfilePage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="bg-[#f4f7f5] text-on-surface flex flex-col min-h-screen overflow-x-hidden">
      <Header />
      <main className={`flex-1 flex flex-col relative w-full pt-16 ${isAuthScreen ? 'pb-8' : 'pb-24 sm:pb-28'} bg-[#f4f7f5] overflow-x-hidden`}>
        {renderCurrentView()}
      </main>
      {!isAuthScreen && <BottomNav />}
      {!isAuthScreen && <FloatingVoiceButton />}
      
      {/* Interactive Global Modals */}
      <EmergencyModal />
      <BookingSuccessModal />
      <EShramCardModal />
      <DigiLockerModal />
      <VoiceSearchModal />
      <DisputeModal />
      <AuditReportModal />
      <SkillAssessmentModal />
      <LocationModal />
      <LiveTrackingModal />
      <InvoiceModal />
      <CancelBookingModal />
      <ReassignWorkerModal />
      <OtpRefusalModal />
      <WardAuditModal />
      <ReviewRatingModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
