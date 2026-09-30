import React from 'react';
import { WeatherAppProvider, useWeatherApp } from './context/WeatherAppContext';
import { LandingPage } from './pages/LandingPage';
import { CommandCenterDashboard } from './pages/CommandCenterDashboard';
import { LiveWeatherMapPage } from './pages/LiveWeatherMapPage';
import { WeatherEventsPage } from './pages/WeatherEventsPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { VerificationCenterPage } from './pages/VerificationCenterPage';
import { CitizenReportPage } from './pages/CitizenReportPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AdminPanelPage } from './pages/AdminPanelPage';
import { SettingsAboutPage } from './pages/SettingsAboutPage';
import { Sidebar } from './components/Sidebar';
import { CommandHeader } from './components/CommandHeader';
import { EventDetailDrawer } from './components/EventDetailDrawer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { EmergencyAdvisoryModal } from './components/EmergencyAdvisoryModal';
import { DemoLoginModal } from './components/DemoLoginModal';
import { ToastContainer } from './components/ToastContainer';

const AppContent: React.FC = () => {
  const { activeView, theme } = useWeatherApp();

  return (
    <div
      className={`min-h-screen font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200 transition-colors duration-200 ${
        theme === 'light' ? 'bg-[#F8FAFC] text-[#0F172A] light' : 'bg-[#07111F] text-[#F1F5F9] dark'
      }`}
    >
      {activeView === 'landing' ? (
        <LandingPage />
      ) : (
        <div className="flex h-screen overflow-hidden bg-[#07111F]">
          {/* Collapsible Command Center Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
            <CommandHeader />

            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#07111F] via-[#07111F] to-[#050D18]">
              <div className="max-w-7xl mx-auto pb-12">
                {activeView === 'command_center' && <CommandCenterDashboard />}
                {activeView === 'live_map' && <LiveWeatherMapPage />}
                {activeView === 'events' && <WeatherEventsPage />}
                {activeView === 'sources' && <DataSourcesPage />}
                {activeView === 'verification' && <VerificationCenterPage />}
                {activeView === 'citizen_report' && <CitizenReportPage />}
                {activeView === 'analytics' && <AnalyticsPage />}
                {activeView === 'admin' && <AdminPanelPage />}
                {activeView === 'settings' && <SettingsAboutPage initialTab="settings" />}
                {activeView === 'about' && <SettingsAboutPage initialTab="about" />}
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Global Modals & Overlays */}
      <DemoLoginModal />
      <EventDetailDrawer />
      <GlobalSearchModal />
      <EmergencyAdvisoryModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <WeatherAppProvider>
      <AppContent />
    </WeatherAppProvider>
  );
}
