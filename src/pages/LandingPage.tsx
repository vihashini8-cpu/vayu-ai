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
    setPendingView,
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
    <div className="min-h-screen bg-app text-fg flex flex-col transition-colors selection:bg-accent/10 selection:text-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-20 lg:pb-32 border-b border-line bg-surface">
        {/* Background Satellite Storm Image with Light Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_satellite_storm_1790753662145.jpg"
            alt="Satellite Storm Imagery over Indian Subcontinent"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-105 filter blur-sm opacity-10 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-app/95 via-app/80 to-app dark:from-transparent dark:via-app/50 dark:to-app" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-accent/5 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Status Capsule */}
          <div className="flex items-center gap-2 mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-accent/10 border border-accent/20 text-primary shadow-sm shadow-accent/20">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(67,217,230,0.8)]" />
              VAYU AI · India&apos;s Unified Weather Intelligence Platform · National Synoptic Grid
            </span>
          </div>

          {/* Split Hero Composition */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Heading, CTAs & Quick Demo Login */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-4">
                <span className="text-primary font-mono text-xs font-bold uppercase tracking-wider block">
                  One Nation. One Sky. One Intelligence.
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-fg leading-[1.1] text-balance">
                  STORM INTELLIGENCE, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-status-normal to-accent">
                    COAST TO COAST
                  </span>
                </h1>
              </div>

              <p className="text-base sm:text-lg text-fg-muted font-medium max-w-xl leading-relaxed">
                VAYU AI provides unified weather reporting, AI-assisted verification, and real-time situational awareness across India. Synthesizing IMD radar grids, ISRO INSAT geostationary scans, and verified citizen telemetry.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-2 px-7 py-4 rounded-xl font-bold text-sm text-white bg-primary hover:bg-primary-soft shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:scale-[1.02]"
                >
                  <LogIn className="w-4 h-4 text-white" />
                  <span>Authenticate to Access</span>
                </button>

                <button
                  onClick={() => {
                    setPendingView('live_map');
                    setIsLoginModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-7 py-4 rounded-xl font-bold text-sm text-fg bg-surface-2 hover:bg-surface border-2 border-primary/20 shadow-sm transition-colors"
                >
                  <Compass className="w-4 h-4 text-accent" />
                  <span>Explore Live Map</span>
                </button>

                <button
                  onClick={() => {
                    setPendingView('events');
                    setIsLoginModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-5 py-4 rounded-xl font-bold text-sm text-fg-muted hover:text-primary bg-transparent hover:bg-fg-muted/5 transition-colors"
                >
                  <span>Event Feed</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Real-time National Telemetry Metrics */}
              <div className="pt-6 border-t border-line grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-black font-display tracking-tight text-fg">14,829</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-fg-muted mt-1">Total Ingested Reports</div>
                </div>
                <div>
                  <div className="text-3xl font-black font-display tracking-tight text-status-normal">96.8%</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-fg-muted mt-1">Verification Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-black font-display tracking-tight text-accent">850+</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-fg-muted mt-1">Active Radar & AWS Nodes</div>
                </div>
              </div>
            </div>

            {/* Right Column: Stylized Live Preview Card */}
            <div className="lg:col-span-6 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-primary/5 rounded-[2rem] transform translate-x-3 translate-y-3 -z-10 blur-xl"></div>
              <div className="relative rounded-2xl bg-surface border border-line p-2 shadow-2xl shadow-fg/5 overflow-hidden">
                <div className="p-4 border-b border-line flex items-center justify-between text-[11px] font-bold text-fg-muted uppercase tracking-wider">
                  <div className="flex items-center gap-2 text-primary">
                    <div className="w-2 h-2 rounded-full bg-status-severe animate-pulse" />
                    <span>SYNOPTIC RADAR FEED · ACTIVE MONITOR</span>
                  </div>
                  <button
                    onClick={() => setActiveView('command_center')}
                    className="text-primary hover:text-primary/80 underline underline-offset-4"
                  >
                    Open Full View →
                  </button>
                </div>

                <div className="p-2 h-[450px] w-full rounded-xl overflow-hidden bg-app">
                  <IndiaWeatherMap compact={true} onSelectEvent={(e) => setSelectedEvent(e)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* High-Priority Active Alert Bulletin */}
      {severeAlert && (
        <section className="bg-gradient-to-r from-status-severe/10 via-white to-status-severe/5 border-b border-status-severe/20 py-4 px-4 sm:px-6 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-fg">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-status-severe/10 text-status-severe border border-status-severe/20 uppercase tracking-wider text-[10px]">
                <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
                Active Severe Threat
              </span>
              <span className="text-sm">
                {severeAlert.title}
              </span>
              <span className="text-fg-muted hidden md:inline">
                ({severeAlert.location.city}, {severeAlert.location.state})
              </span>
            </div>

            <button
              onClick={() => {
                setSelectedEvent(severeAlert);
              }}
              className="text-status-severe hover:text-status-severe/80 uppercase tracking-wider text-[10px] flex items-center gap-1.5 bg-surface px-3 py-1.5 rounded-lg border border-status-severe/20 shadow-sm transition-all hover:shadow"
            >
              <span>Examine Bulletin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* Four Core Pillars of VAYU AI */}
      <section className="py-20 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary px-3 py-1.5 rounded-full bg-primary-soft border border-primary/20">
            System Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-fg mt-6 tracking-tight">
            The Four Pillars of VAYU AI
          </h2>
          <p className="text-sm sm:text-base text-fg-muted mt-4 font-medium leading-relaxed">
            Eliminating information silos between national meteorological bodies, state emergency authorities, and citizens on the ground.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Pillar 1 */}
          <div className="p-8 rounded-2xl bg-surface border border-line hover:border-primary/20 shadow-lg shadow-fg/5 transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-primary-soft border border-primary/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <Radio className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-fg mb-3 leading-tight tracking-tight">
                Unified Multi-Source Aggregation
              </h3>
              <p className="text-sm text-fg-muted font-medium leading-relaxed">
                Seamless ingestion from IMD Doppler Radars, ISRO INSAT-3DR Geostationary Satellites, CPCB Sensors, and State Disaster EOCs.
              </p>
            </div>
            <button
              onClick={() => {
                setPendingView('sources');
                setIsLoginModalOpen(true);
              }}
              className="mt-8 flex items-center gap-2 text-xs text-primary font-bold uppercase tracking-wider"
            >
              <span>View Data Feeds</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Pillar 2 */}
          <div className="p-8 rounded-2xl bg-surface border border-line hover:border-status-normal/20 shadow-lg shadow-fg/5 transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-status-normal/10 border border-status-normal/20 flex items-center justify-center text-status-normal mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-fg mb-3 leading-tight tracking-tight">
                AI-Assisted Verification Engine
              </h3>
              <p className="text-sm text-fg-muted font-medium leading-relaxed">
                Computer vision & sensor anomaly algorithms detect recycled media, score credibility, and flag duplicates to accelerate desk review.
              </p>
            </div>
            <button
              onClick={() => {
                setPendingView('verification');
                setIsLoginModalOpen(true);
              }}
              className="mt-8 flex items-center gap-2 text-xs text-status-normal font-bold uppercase tracking-wider"
            >
              <span>Inspection Queue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Pillar 3 */}
          <div className="p-8 rounded-2xl bg-surface border border-line hover:border-accent/20 shadow-lg shadow-fg/5 transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-fg mb-3 leading-tight tracking-tight">
                National Command Center
              </h3>
              <p className="text-sm text-fg-muted font-medium leading-relaxed">
                Real-time situational dashboard with dynamic isobar overlays, regional risk clusters, and CAP emergency advisory dispatching.
              </p>
            </div>
            <button
              onClick={() => {
                setPendingView('command_center');
                setIsLoginModalOpen(true);
              }}
              className="mt-8 flex items-center gap-2 text-xs text-accent font-bold uppercase tracking-wider"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Pillar 4 */}
          <div className="p-8 rounded-2xl bg-surface border border-line hover:border-status-warning/20 shadow-lg shadow-fg/5 transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-status-warning/10 border border-status-warning/20 flex items-center justify-center text-status-warning mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-fg mb-3 leading-tight tracking-tight">
                Crowdsourced Ground Truth
              </h3>
              <p className="text-sm text-fg-muted font-medium leading-relaxed">
                Mobile-first incident submission allows verified citizens and observers to report micro-bursts, hail, and waterlogging in seconds.
              </p>
            </div>
            <button
              onClick={() => {
                setPendingView('citizen_report');
                setIsLoginModalOpen(true);
              }}
              className="mt-8 flex items-center gap-2 text-xs text-status-warning font-bold uppercase tracking-wider"
            >
              <span>Submit Report</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Control Room Showcase Banner */}
      <section className="relative overflow-hidden py-24 bg-hero border-y border-transparent">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-accent px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
              National Meteorological Initiative
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white tracking-tight leading-[1.1]">
              Built for National Disaster Preparedness & Civil Protection
            </h2>
            <p className="text-base text-white/70 font-medium leading-relaxed">
              Designed as a unified operational bridge for the National Disaster Management Authority (NDMA), State EOCs, municipal commissioners, and vulnerable coastal communities during extreme weather events.
            </p>
            <div className="pt-4 flex flex-wrap gap-6 text-[11px] font-bold text-white uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-normal" />
                <span>Zero vendor lock-in</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-normal" />
                <span>WMO & CAP Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-normal" />
                <span>Sub-second alert broadcast</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 relative transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
            <img
              src="/src/assets/images/radar_control_room_1790753676639.jpg"
              alt="VAYU AI Meteorological Command Center"
              referrerPolicy="no-referrer"
              className="w-full h-72 sm:h-96 object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-surface backdrop-blur-md px-4 py-2 rounded-xl border border-white text-[10px] font-bold uppercase tracking-wider text-fg shadow-lg">
              National Operations Control Room Preview
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-surface border-t border-line py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-fg-muted font-bold">
          <div className="flex items-center gap-3">
            <div className="font-display font-black text-fg text-base">
              VAYU<span className="text-accent font-mono ml-0.5">AI</span>
            </div>
            <span className="text-fg-muted">|</span>
            <span className="uppercase tracking-wider text-[10px]">India&apos;s Unified Weather Intelligence Platform</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 uppercase tracking-wider text-[10px]">
            <button onClick={() => setActiveView('about')} className="hover:text-primary transition-colors">
              About Platform
            </button>
            <button onClick={() => setActiveView('sources')} className="hover:text-primary transition-colors">
              Data Sources
            </button>
            <button onClick={() => setActiveView('verification')} className="hover:text-primary transition-colors">
              Verification Engine
            </button>
            <button onClick={() => setActiveView('settings')} className="hover:text-primary transition-colors">
              Settings
            </button>
          </div>

          <div className="text-fg-muted font-mono text-[9px] uppercase tracking-widest text-center md:text-right">
            National Weather Intelligence Grid <br className="hidden md:block" /> Ministry of Earth Sciences & SDMA Architecture
          </div>
        </div>
      </footer>
    </div>
  );
};
