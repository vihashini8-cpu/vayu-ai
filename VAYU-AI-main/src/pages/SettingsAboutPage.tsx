import React, { useState } from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import {
  Settings,
  Info,
  Radio,
  ShieldCheck,
  CheckCircle2,
  Bell,
  Sliders,
  Sparkles,
  Users,
  Compass,
  Cpu,
  Layers,
  ArrowRight,
  Database,
  CloudLightning,
} from 'lucide-react';

interface SettingsAboutProps {
  initialTab?: 'settings' | 'about';
}

export const SettingsAboutPage: React.FC<SettingsAboutProps> = ({ initialTab = 'settings' }) => {
  const { demoMode, setDemoMode, addToast, setActiveView, theme: globalTheme, toggleTheme } = useWeatherApp();
  const [activeTab, setActiveTab] = useState<'settings' | 'about'>(initialTab);

  // Settings states
  const [refreshInterval, setRefreshInterval] = useState('30s');
  const [audioAlerts, setAudioAlerts] = useState(true);
  const [severeOnlyAlerts, setSevereOnlyAlerts] = useState(true);
  const [units, setUnits] = useState('metric');

  const handleSaveSettings = () => {
    addToast({
      title: 'Preferences Saved',
      description: 'Command center configuration updated successfully.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header and Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight">
            {activeTab === 'settings' ? 'System Settings & Display Controls' : 'About VAYU AI · National Architecture'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {activeTab === 'settings'
              ? 'Configure telemetry units, ingestion sync frequencies, and audio notification triggers'
              : 'National-level meteorological intelligence architecture providing unified situational awareness across India'}
          </p>
        </div>

        <div className="flex items-center p-1 rounded-xl bg-[#0B1929] border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'about'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>About Architecture</span>
          </button>
        </div>
      </div>

      {activeTab === 'settings' ? (
        /* Settings Tab */
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0B1929] border border-slate-800 shadow-xl space-y-6">
            {/* Visual Appearance Theme */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Display Theme & Interface Mode
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (globalTheme !== 'dark') toggleTheme();
                  }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    globalTheme === 'dark'
                      ? 'bg-cyan-500/10 border-cyan-400 shadow-md ring-1 ring-cyan-400'
                      : 'bg-[#102238] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-xs">Deep Midnight Dark Theme</span>
                    {globalTheme === 'dark' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    High contrast dark palette optimized for 24/7 command center and radar monitoring.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (globalTheme !== 'light') toggleTheme();
                  }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    globalTheme === 'light'
                      ? 'bg-cyan-500/10 border-cyan-400 shadow-md ring-1 ring-cyan-400'
                      : 'bg-[#102238] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-xs">Daylight Crisp Light Theme</span>
                    {globalTheme === 'light' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Clean, high-legibility light theme for daytime operations, briefings, and documentation.
                  </p>
                </button>
              </div>
            </div>

            {/* Ingestion & Refresh Settings */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Radio className="w-4 h-4 text-teal-400" />
                Data Ingestion Cadence & Telemetry Units
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Polling Interval (Agency Telemetry)
                  </label>
                  <select
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(e.target.value)}
                    className="w-full bg-[#102238] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="15s">Every 15 Seconds (Rapid Radar Stream)</option>
                    <option value="30s">Every 30 Seconds (Recommended Standard)</option>
                    <option value="60s">Every 60 Seconds</option>
                    <option value="manual">Manual Refresh Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Measurement Units Standard
                  </label>
                  <select
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    className="w-full bg-[#102238] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="metric">Metric (Celsius °C, mm, km/h, hPa)</option>
                    <option value="imperial">Imperial (Fahrenheit °F, inches, mph, inHg)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification & Audio Triggers */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                Operational Notifications & Audio Warnings
              </h3>

              <div className="space-y-3 text-xs">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={severeOnlyAlerts}
                    onChange={(e) => setSevereOnlyAlerts(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 bg-[#102238] border-slate-700 focus:ring-0"
                  />
                  <div>
                    <span className="font-semibold text-white block">Auto-popup on Red Alert / Severe Threats</span>
                    <span className="text-[11px] text-slate-400">Trigger immediate operational drawer when Cyclone or Flooding Red Alert is ingested.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={audioAlerts}
                    onChange={(e) => setAudioAlerts(e.target.checked)}
                    className="w-4 h-4 rounded text-cyan-500 bg-[#102238] border-slate-700 focus:ring-0"
                  />
                  <div>
                    <span className="font-semibold text-white block">Acoustic Radar Ping</span>
                    <span className="text-[11px] text-slate-400">Play subtle sub-bass chime upon verified incident ingestion.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Demo Simulation Mode Toggle */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Demo Dataset Runtime Mode</span>
                <span className="text-[11px] text-slate-400">Keeps realistic sample weather incidents active for interactive evaluation testing.</span>
              </div>
              <button
                type="button"
                onClick={() => setDemoMode(!demoMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                  demoMode ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {demoMode ? 'DEMO ACTIVE' : 'LIVE API MODE'}
              </button>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={handleSaveSettings}
                className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors shadow-md"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* About Project Tab */
        <div className="space-y-6">
          {/* Project Vision Hero Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0B1929] to-[#0d1f35] border border-cyan-500/30 shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xs">
                VAYU
              </div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-300">
                National Weather Intelligence Architecture · Mission Directive
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold font-display text-white">
                VAYU AI — India&apos;s Unified Weather Intelligence Platform
              </h3>
              <p className="text-sm font-semibold text-cyan-400">
                One Nation. One Sky. One Intelligence.
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              India faces diverse microclimates, from Himalayan cloudbursts and Thar Desert dust squalls to tropical Bay of Bengal cyclones and urban Mumbai waterlogging. Historically, meteorological radar data, state disaster consoles, and citizen reports existed in segregated silos.
            </p>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              VAYU AI synthesizes these data layers into a unified command surface with automated AI verification and rapid CAP (Common Alerting Protocol) emergency advisory dispatch.
            </p>
          </div>

          {/* 4-Step Architecture Pipeline Infographic */}
          <div className="p-6 rounded-2xl bg-[#0B1929] border border-slate-800 shadow-xl space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-mono font-semibold uppercase text-cyan-400 tracking-wider">
                End-to-End Pipeline
              </span>
              <h4 className="text-lg font-bold text-white mt-1">
                From Raw Sensor Pulse to National Advisory Dispatch
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {/* Step 1 */}
              <div className="p-4 rounded-xl bg-[#102238] border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xs mb-3">
                    01
                  </div>
                  <h5 className="font-bold text-white text-xs mb-1">Multi-Modal Ingestion</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    IMD AWS mesonet, ISRO INSAT-3DR satellite scans, 37 Doppler radar sites, and geotagged citizen submissions.
                  </p>
                </div>
                <div className="mt-3 text-[10px] font-mono text-cyan-400">
                  MQTT / REST / BUFR
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl bg-[#102238] border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold text-xs mb-3">
                    02
                  </div>
                  <h5 className="font-bold text-white text-xs mb-1">AI Pre-Classification</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Automated anomaly detection, duplicate elimination, computer vision verification of photos, and confidence scoring.
                  </p>
                </div>
                <div className="mt-3 text-[10px] font-mono text-teal-400">
                  Vision & NLP Classifier
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl bg-[#102238] border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold text-xs mb-3">
                    03
                  </div>
                  <h5 className="font-bold text-white text-xs mb-1">Desk Corroboration</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Authorized duty meteorologist inspects cross-referenced radar cells, signs the report, or flags for SDMA field check.
                  </p>
                </div>
                <div className="mt-3 text-[10px] font-mono text-purple-400">
                  Human-in-the-Loop
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-xl bg-[#102238] border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center font-bold text-xs mb-3">
                    04
                  </div>
                  <h5 className="font-bold text-white text-xs mb-1">National Response Dispatch</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Common Alerting Protocol (CAP) broadcasts directly to State EOCs, mobile cell towers, and citizen notification apps.
                  </p>
                </div>
                <div className="mt-3 text-[10px] font-mono text-rose-400">
                  SACHET / NDMA Gateway
                </div>
              </div>
            </div>
          </div>

          {/* Intended Benefits Matrix */}
          <div className="p-6 rounded-2xl bg-[#0B1929] border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-base font-bold text-white">
              Target Beneficiaries & Impact
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#102238] border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-300 text-sm">Disaster Authorities (NDMA & SDMA)</div>
                <p className="text-slate-300 leading-relaxed">
                  Real-time geographic situational map provides actionable minutes to mobilize NDRF teams, evacuate low-lying coastal blocks, and coordinate inter-district relief.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#102238] border border-slate-800 space-y-2">
                <div className="font-bold text-teal-300 text-sm">Municipalities & Transit Systems</div>
                <p className="text-slate-300 leading-relaxed">
                  Hyper-local urban inundation telemetry triggers automated dewatering pumps, alerts metro/railway operations, and prevents traffic gridlock.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#102238] border border-slate-800 space-y-2">
                <div className="font-bold text-amber-300 text-sm">Citizens & Coastal Communities</div>
                <p className="text-slate-300 leading-relaxed">
                  Direct participatory reporting empowers fishermen, farmers, and commuters to report micro-events and receive verified alerts in native regional languages.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
