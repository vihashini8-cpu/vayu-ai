import React, { useState } from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import {
  Settings,
  Info,
  Radio,
  CheckCircle2,
  Bell,
  Sliders,
} from 'lucide-react';

interface SettingsAboutProps {
  initialTab?: 'settings' | 'about';
}

export const SettingsAboutPage: React.FC<SettingsAboutProps> = ({ initialTab = 'settings' }) => {
  const { demoMode, setDemoMode, addToast, theme: globalTheme, toggleTheme } = useWeatherApp();
  const [activeTab, setActiveTab] = useState<'settings' | 'about'>(initialTab);

  const [refreshInterval, setRefreshInterval] = useState('30s');
  const [audioAlerts, setAudioAlerts] = useState(true);
  const [severeOnlyAlerts, setSevereOnlyAlerts] = useState(true);
  const [units, setUnits] = useState('metric');

  const handleSaveSettings = () => {
    addToast({
      title: 'Preferences Saved',
      description: 'Configuration updated successfully.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-2xl font-bold text-fg tracking-tight">
            {activeTab === 'settings' ? 'System Settings' : 'About VAYU AI'}
          </h2>
          <p className="text-sm text-fg-muted">
            {activeTab === 'settings'
              ? 'Configure telemetry units, ingestion frequencies, and notifications.'
              : 'National-level meteorological intelligence architecture.'}
          </p>
        </div>

        <div className="flex items-center p-1 rounded-xl bg-vayu-lavender/30 text-sm font-semibold border border-vayu-lavender/20">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-fg text-white shadow-sm'
                : 'text-fg-muted hover:bg-vayu-lavender/20'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'about'
                ? 'bg-fg text-white shadow-sm'
                : 'text-fg-muted hover:bg-vayu-lavender/20'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>About</span>
          </button>
        </div>
      </div>

      {activeTab === 'settings' ? (
        <div className="p-6 rounded-2xl bg-surface border border-line shadow-sm space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-fg uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              Theme & Display
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => { if (globalTheme !== 'dark') toggleTheme(); }}
                className={`p-5 rounded-xl border text-left transition-all ${
                  globalTheme === 'dark'
                    ? 'bg-accent/10 border-accent/20 ring-1 ring-accent/50 shadow-sm'
                    : 'bg-app border-line hover:border-line hover:bg-app'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-fg text-sm">Dark Theme</span>
                  {globalTheme === 'dark' && <CheckCircle2 className="w-5 h-5 text-accent" />}
                </div>
                <p className="text-xs font-medium text-fg-muted">
                  High contrast dark palette for radar monitoring.
                </p>
              </button>

              <button
                type="button"
                onClick={() => { if (globalTheme !== 'light') toggleTheme(); }}
                className={`p-5 rounded-xl border text-left transition-all ${
                  globalTheme === 'light'
                    ? 'bg-accent/10 border-accent/20 ring-1 ring-accent/50 shadow-sm'
                    : 'bg-app border-line hover:border-line hover:bg-app'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-fg text-sm">Light Theme</span>
                  {globalTheme === 'light' && <CheckCircle2 className="w-5 h-5 text-accent" />}
                </div>
                <p className="text-xs font-medium text-fg-muted">
                  Clean, high-legibility light theme for daytime operations.
                </p>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-line space-y-4">
            <h3 className="text-sm font-bold text-fg uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-status-normal" />
              Ingestion & Units
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div>
                <label className="block text-fg mb-2 font-bold">
                  Polling Interval
                </label>
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(e.target.value)}
                  className="w-full bg-app border border-line rounded-xl px-4 py-2.5 text-fg font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/20 transition-shadow"
                >
                  <option value="15s">Every 15 Seconds (Rapid)</option>
                  <option value="30s">Every 30 Seconds (Standard)</option>
                  <option value="60s">Every 60 Seconds</option>
                  <option value="manual">Manual Refresh Only</option>
                </select>
              </div>

              <div>
                <label className="block text-fg mb-2 font-bold">
                  Measurement Units
                </label>
                <select
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  className="w-full bg-app border border-line rounded-xl px-4 py-2.5 text-fg font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/20 transition-shadow"
                >
                  <option value="metric">Metric (°C, mm, km/h)</option>
                  <option value="imperial">Imperial (°F, in, mph)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-line space-y-4">
            <h3 className="text-sm font-bold text-fg uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-status-warning" />
              Notifications & Alerts
            </h3>

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center border transition-colors ${severeOnlyAlerts ? 'bg-accent border-accent text-fg' : 'bg-surface border-line text-transparent group-hover:border-accent/20'}`}>
                   <CheckCircle2 className="w-3.5 h-3.5" />
                   <input
                    type="checkbox"
                    checked={severeOnlyAlerts}
                    onChange={(e) => setSevereOnlyAlerts(e.target.checked)}
                    className="sr-only"
                  />
                </div>
                <div>
                  <span className="font-bold text-fg block text-sm">Auto-popup on Red Alert</span>
                  <span className="text-xs font-medium text-fg-muted">Trigger immediate drawer when severe threats are ingested.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <div className={`w-5 h-5 mt-0.5 rounded flex items-center justify-center border transition-colors ${audioAlerts ? 'bg-accent border-accent text-fg' : 'bg-surface border-line text-transparent group-hover:border-accent/20'}`}>
                   <CheckCircle2 className="w-3.5 h-3.5" />
                   <input
                    type="checkbox"
                    checked={audioAlerts}
                    onChange={(e) => setAudioAlerts(e.target.checked)}
                    className="sr-only"
                  />
                </div>
                <div>
                  <span className="font-bold text-fg block text-sm">Acoustic Radar Ping</span>
                  <span className="text-xs font-medium text-fg-muted">Play subtle chime upon verified incident ingestion.</span>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-line flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-fg block">Demo Runtime Mode</span>
              <span className="text-xs font-medium text-fg-muted">Keeps realistic sample incidents active for testing.</span>
            </div>
            <button
              type="button"
              onClick={() => setDemoMode(!demoMode)}
              className={`px-4 py-2 rounded-lg text-[11px] font-mono font-bold tracking-wider transition-colors ${
                demoMode ? 'bg-status-normal/10 text-status-normal border border-status-normal/20' : 'bg-fg-muted/10 text-fg-muted border border-line'
              }`}
            >
              {demoMode ? 'DEMO ACTIVE' : 'LIVE API'}
            </button>
          </div>

          <div className="pt-6 border-t border-line flex justify-end">
            <button
              type="button"
              onClick={handleSaveSettings}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-soft text-white font-bold text-sm transition-colors shadow-sm"
            >
              Save Preferences
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-8 rounded-2xl bg-surface border border-line shadow-sm space-y-5 relative overflow-hidden">
             {/* Decorative Background Element */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center text-primary font-black tracking-tighter text-lg border border-primary/20">
                VA
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-fg-muted">
                Mission Directive
              </span>
            </div>

            <div className="space-y-2 relative z-10">
              <h3 className="text-2xl font-black text-fg tracking-tight">
                VAYU AI — India's Unified Weather Intelligence
              </h3>
              <p className="text-base font-bold text-accent uppercase tracking-wide">
                One Nation. One Sky. One Intelligence.
              </p>
            </div>

            <p className="text-sm text-fg-muted leading-relaxed max-w-3xl font-medium relative z-10">
              India faces diverse microclimates, from Himalayan cloudbursts to tropical cyclones and urban waterlogging. Historically, meteorological radar data, state disaster consoles, and citizen reports existed in segregated silos. VAYU AI synthesizes these data layers into a unified command surface with automated AI verification and rapid emergency advisory dispatch.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-surface border border-line shadow-sm space-y-8">
            <div className="text-center max-w-xl mx-auto">
              <h4 className="text-lg font-bold text-fg">
                From Raw Sensor Pulse to National Advisory Dispatch
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {/* Connector line for large screens */}
              <div className="hidden md:block absolute top-6 left-12 right-12 h-[2px] bg-fg-muted/10 z-0" />

              <div className="relative z-10 p-5 rounded-xl bg-app border border-line hover:border-primary/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-surface text-primary shadow-sm border border-line flex items-center justify-center font-black text-lg mb-4 mx-auto md:mx-0">1</div>
                <h5 className="font-bold text-fg text-sm mb-2 text-center md:text-left">Multi-Modal Ingestion</h5>
                <p className="text-xs font-medium text-fg-muted leading-relaxed text-center md:text-left">
                  IMD AWS mesonet, ISRO satellite scans, Doppler radar, and geotagged citizen submissions.
                </p>
              </div>

              <div className="relative z-10 p-5 rounded-xl bg-app border border-line hover:border-status-normal/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-surface text-status-normal shadow-sm border border-line flex items-center justify-center font-black text-lg mb-4 mx-auto md:mx-0">2</div>
                <h5 className="font-bold text-fg text-sm mb-2 text-center md:text-left">AI Pre-Classification</h5>
                <p className="text-xs font-medium text-fg-muted leading-relaxed text-center md:text-left">
                  Automated anomaly detection, duplicate elimination, and confidence scoring.
                </p>
              </div>

              <div className="relative z-10 p-5 rounded-xl bg-app border border-line hover:border-accent/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-surface text-accent shadow-sm border border-line flex items-center justify-center font-black text-lg mb-4 mx-auto md:mx-0">3</div>
                <h5 className="font-bold text-fg text-sm mb-2 text-center md:text-left">Desk Corroboration</h5>
                <p className="text-xs font-medium text-fg-muted leading-relaxed text-center md:text-left">
                  Authorized meteorologist inspects cross-referenced radar cells, signs the report, or flags for field check.
                </p>
              </div>

              <div className="relative z-10 p-5 rounded-xl bg-app border border-line hover:border-status-severe/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-surface text-status-severe shadow-sm border border-line flex items-center justify-center font-black text-lg mb-4 mx-auto md:mx-0">4</div>
                <h5 className="font-bold text-fg text-sm mb-2 text-center md:text-left">National Dispatch</h5>
                <p className="text-xs font-medium text-fg-muted leading-relaxed text-center md:text-left">
                  Common Alerting Protocol (CAP) broadcasts directly to State EOCs and citizen apps.
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-surface border border-line shadow-sm space-y-6">
            <h4 className="text-lg font-bold text-fg">
              Target Beneficiaries
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl bg-vayu-lavender/10 border border-vayu-lavender/30">
                <div className="font-bold text-primary text-sm mb-2">Disaster Authorities</div>
                <p className="text-sm font-medium text-fg-muted leading-relaxed">
                  Real-time geographic situational map provides actionable minutes to mobilize NDRF teams.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-vayu-lavender/10 border border-vayu-lavender/30">
                <div className="font-bold text-primary text-sm mb-2">Municipalities</div>
                <p className="text-sm font-medium text-fg-muted leading-relaxed">
                  Hyper-local urban telemetry triggers automated dewatering pumps and prevents traffic gridlock.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-vayu-lavender/10 border border-vayu-lavender/30">
                <div className="font-bold text-primary text-sm mb-2">Citizens</div>
                <p className="text-sm font-medium text-fg-muted leading-relaxed">
                  Direct participatory reporting empowers communities to report micro-events and receive verified alerts.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
