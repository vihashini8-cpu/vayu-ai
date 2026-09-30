import React from 'react';
import { useWeatherApp, DEMO_USERS, UserProfile } from '../context/WeatherAppContext';
import { Navbar } from '../components/Navbar';
import { IndiaWeatherMap } from '../components/IndiaWeatherMap';
import {
  ShieldAlert,
  ArrowRight,
  Radio,
  Cpu,
  Layers,
  CheckCircle2,
  Users,
  Compass,
  LogIn,
  KeyRound,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const {
    setActiveView,
    setSelectedEvent,
    setIsLoginModalOpen,
    login,
    events,
    theme,
  } = useWeatherApp();

  const severeAlert = events.find((e) => e.severity === 'severe') || events[0];

  const handleQuickDemoLogin = (user: UserProfile) => {
    login(user);
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F1F5F9] flex flex-col transition-colors">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-800/80">
        {/* Background Satellite Storm Image with Deep Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_satellite_storm_1790753662145.jpg"
            alt="Satellite Storm Imagery over Indian Subcontinent"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover object-center scale-105 filter blur-[0.5px] ${
              theme === 'light'
                ? 'opacity-15 mix-blend-multiply'
                : 'opacity-30 mix-blend-screen'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#07111F]/70 via-[#07111F]/90 to-[#07111F]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Status Capsule */}
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              VAYU AI · India&apos;s Unified Weather Intelligence Platform · National Synoptic Grid
            </span>
          </div>

          {/* Split Hero Composition */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Heading, CTAs & Quick Demo Login */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span className="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider block">
                  One Nation. One Sky. One Intelligence.
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white leading-[1.08] text-balance">
                  STORM INTELLIGENCE, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400">
                    COAST TO COAST
                  </span>
                </h1>
              </div>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                VAYU AI provides unified weather reporting, AI-assisted verification, and real-time situational awareness across India. Synthesizing IMD radar grids, ISRO INSAT geostationary scans, and verified citizen telemetry.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 shadow-lg shadow-cyan-950/60 transition-all hover:scale-[1.02]"
                >
                  <LogIn className="w-4 h-4 text-slate-950" />
                  <span>Demo Login</span>
                </button>

                <button
                  onClick={() => setActiveView('live_map')}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-[#102238] hover:bg-slate-800 border border-slate-700/80 transition-colors"
                >
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>Explore Live Map</span>
                </button>

                <button
                  onClick={() => setActiveView('events')}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-slate-300 hover:text-white bg-[#0B1929] hover:bg-[#102238] border border-slate-800 transition-colors"
                >
                  <span>Event Feed</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              {/* Interactive Quick Demo Login Card */}
              <div className="mt-4 p-4 rounded-2xl bg-[#0B1929]/95 border border-cyan-500/30 shadow-xl backdrop-blur-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Quick Demo Access · Instant Role Login
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-teal-400 px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">
                    1-CLICK SIGN IN
                  </span>
                </div>

                <p className="text-[11px] text-slate-400">
                  Select an authorized profile below to instantly authenticate and evaluate the Command Center:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {DEMO_USERS.map((user) => (
                    <button
                      key={user.email}
                      onClick={() => handleQuickDemoLogin(user)}
                      className="p-2.5 rounded-xl bg-[#102238] hover:bg-cyan-500/15 border border-slate-800 hover:border-cyan-400/60 text-left transition-all group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="w-6 h-6 rounded-md bg-cyan-600/30 text-cyan-300 flex items-center justify-center font-bold text-[10px]">
                          {user.initials}
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white group-hover:text-cyan-300 truncate">
                          {user.name}
                        </div>
                        <div className="text-[10px] text-cyan-400 truncate mt-0.5">
                          {user.role}
                        </div>
                        <div className="text-[9px] text-slate-400 truncate mt-0.5">
                          {user.department}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-teal-400" />
                    Pre-authenticated roles with full verification authority
                  </span>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2"
                  >
                    Custom SSO
                  </button>
                </div>
              </div>

              {/* Real-time National Telemetry Metrics */}
              <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-white">14,829</div>
                  <div className="text-xs text-slate-400 mt-0.5">Total Ingested Reports</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-teal-400">96.8%</div>
                  <div className="text-xs text-slate-400 mt-0.5">Verification Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-cyan-400">850+</div>
                  <div className="text-xs text-slate-400 mt-0.5">Active Radar & AWS Nodes</div>
                </div>
              </div>
            </div>

            {/* Right Column: Stylized Live Preview Card */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl bg-[#0B1929]/90 border border-slate-700/80 p-2 shadow-2xl backdrop-blur-md">
                <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-mono text-cyan-400">
                    <Radio className="w-4 h-4 animate-pulse text-rose-400" />
                    <span>SYNOPTIC RADAR FEED · ACTIVE MONITOR</span>
                  </div>
                  <button
                    onClick={() => setActiveView('command_center')}
                    className="text-xs text-slate-300 hover:text-white underline underline-offset-4"
                  >
                    Open Full View →
                  </button>
                </div>

                <div className="p-1">
                  <IndiaWeatherMap compact={true} onSelectEvent={(e) => setSelectedEvent(e)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* High-Priority Active Alert Bulletin */}
      {severeAlert && (
        <section className="bg-gradient-to-r from-rose-950/40 via-[#0B1929] to-rose-950/40 border-b border-rose-500/30 py-3.5 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold uppercase tracking-wider text-[11px]">
                <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
                Active Severe Threat
              </span>
              <span className="font-semibold text-white">
                {severeAlert.title}
              </span>
              <span className="text-slate-400 hidden md:inline">
                ({severeAlert.location.city}, {severeAlert.location.state})
              </span>
            </div>

            <button
              onClick={() => {
                setSelectedEvent(severeAlert);
              }}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>Examine Bulletin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* Four Core Pillars of VAYU AI */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-cyan-400">
            System Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-white mt-2">
            The Four Pillars of VAYU AI
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
            Eliminating information silos between national meteorological bodies, state emergency authorities, and citizens on the ground.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-[#0B1929] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-105 transition-transform">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Unified Multi-Source Aggregation
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Seamless ingestion from IMD Doppler Radars, ISRO INSAT-3DR Geostationary Satellites, CPCB Sensors, and State Disaster EOCs.
              </p>
            </div>
            <button
              onClick={() => setActiveView('sources')}
              className="mt-6 flex items-center gap-1.5 text-xs text-cyan-400 group-hover:text-cyan-300 font-semibold"
            >
              <span>View Data Feeds</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-[#0B1929] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-5 group-hover:scale-105 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                AI-Assisted Verification Engine
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Computer vision & sensor anomaly algorithms detect recycled media, score credibility, and flag duplicates to accelerate desk review.
              </p>
            </div>
            <button
              onClick={() => setActiveView('verification')}
              className="mt-6 flex items-center gap-1.5 text-xs text-teal-400 group-hover:text-teal-300 font-semibold"
            >
              <span>Inspection Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-[#0B1929] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300 mb-5 group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                National Command Center
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Real-time situational dashboard with dynamic isobar overlays, regional risk clusters, and CAP emergency advisory dispatching.
              </p>
            </div>
            <button
              onClick={() => setActiveView('command_center')}
              className="mt-6 flex items-center gap-1.5 text-xs text-cyan-400 group-hover:text-cyan-300 font-semibold"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-2xl bg-[#0B1929] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Crowdsourced Ground Truth
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mobile-first incident submission allows verified citizens and observers to report micro-bursts, hail, and waterlogging in seconds.
              </p>
            </div>
            <button
              onClick={() => setActiveView('citizen_report')}
              className="mt-6 flex items-center gap-1.5 text-xs text-purple-400 group-hover:text-purple-300 font-semibold"
            >
              <span>Submit Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Control Room Showcase Banner */}
      <section className="relative overflow-hidden py-16 bg-[#0B1929] border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-mono font-semibold uppercase text-cyan-400 tracking-wider">
              National Meteorological Initiative
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
              Built for National Disaster Preparedness & Civil Protection
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Designed as a unified operational bridge for the National Disaster Management Authority (NDMA), State EOCs, municipal commissioners, and vulnerable coastal communities during extreme weather events.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Zero vendor lock-in</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>WMO & CAP Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Sub-second alert broadcast</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl relative">
            <img
              src="/src/assets/images/radar_control_room_1790753676639.jpg"
              alt="VAYU AI Meteorological Command Center"
              referrerPolicy="no-referrer"
              className="w-full h-64 sm:h-80 object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-[#07111F]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono text-cyan-300">
              National Operations Control Room Preview
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#07111F] border-t border-slate-800/80 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="font-display font-black text-white text-base">
              VAYU<span className="text-cyan-400 font-mono ml-0.5">AI</span>
            </div>
            <span className="text-slate-600">|</span>
            <span>India&apos;s Unified Weather Intelligence Platform</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button onClick={() => setActiveView('about')} className="hover:text-white transition-colors">
              About Platform
            </button>
            <button onClick={() => setActiveView('sources')} className="hover:text-white transition-colors">
              Data Sources
            </button>
            <button onClick={() => setActiveView('verification')} className="hover:text-white transition-colors">
              Verification Engine
            </button>
            <button onClick={() => setActiveView('settings')} className="hover:text-white transition-colors">
              Settings
            </button>
          </div>

          <div className="text-slate-500 font-mono text-[11px]">
            National Weather Intelligence Grid · Ministry of Earth Sciences & SDMA Architecture
          </div>
        </div>
      </footer>
    </div>
  );
};
