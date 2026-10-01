import React, { useState } from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import { AlertCircle, X, ShieldAlert, Send, Radio, Check } from 'lucide-react';

export const EmergencyAdvisoryModal: React.FC = () => {
  const { isEmergencyModalOpen, setIsEmergencyModalOpen, addToast } = useWeatherApp();
  const [targetRegion, setTargetRegion] = useState('Odisha & Coastal Andhra Pradesh');
  const [threatType, setThreatType] = useState('Cyclonic Storm & High Storm Surge');
  const [severityLevel, setSeverityLevel] = useState('Red Alert (Extreme Urgency)');
  const [bulletinText, setBulletinText] = useState(
    'IMD Tropical Cyclone Advisory: Severe Cyclonic Storm "Veer" positioned 180km SE of Puri. Widespread rainfall >150mm with gale winds up to 115 km/h expected within 12 hours. District authorities ordered to execute low-lying evacuation plans.'
  );
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastDone, setBroadcastDone] = useState(false);

  if (!isEmergencyModalOpen) return null;

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastDone(true);
      addToast({
        title: 'National Weather Advisory Broadcasted',
        description: `Common Alerting Protocol (CAP) dispatched to ${targetRegion} via SDMA gateway.`,
        type: 'alert',
      });
      setTimeout(() => {
        setBroadcastDone(false);
        setIsEmergencyModalOpen(false);
      }, 1500);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-fg/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-surface border border-status-severe/20 rounded-2xl shadow-[0_10px_40px_-10px_rgba(229,107,111,0.2)] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Banner */}
        <div className="bg-status-severe/10 border-b border-status-severe/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-status-severe/10 border border-status-severe/20 flex items-center justify-center text-status-severe shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-status-severe tracking-wide uppercase">
                National Weather Emergency Dispatcher
              </h3>
              <p className="text-xs font-bold text-status-severe/70 uppercase tracking-wider">
                Authorized NDMA / SDMA Multi-Channel Alert Gateway
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEmergencyModalOpen(false)}
            className="text-fg-muted hover:text-status-severe hover:bg-status-severe/10 p-1.5 rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {broadcastDone ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-status-normal/10 border border-status-normal/20 text-status-normal flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(24,184,166,0.15)]">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-fg">Advisory Broadcast Synchronized</h4>
            <p className="text-sm font-medium text-fg-muted max-w-md mx-auto leading-relaxed">
              Dispatched across 85 coastal telecom towers, State EOC consoles, and public sirens under Common Alerting Protocol v1.2.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBroadcast} className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-fg-muted uppercase tracking-wider mb-1.5">
                  Target State / Coastal Belt
                </label>
                <select
                  value={targetRegion}
                  onChange={(e) => setTargetRegion(e.target.value)}
                  className="w-full bg-app border border-line rounded-xl px-3 py-2.5 text-sm font-bold text-fg focus:outline-none focus:ring-1 focus:ring-status-severe focus:border-status-severe transition-colors"
                >
                  <option value="Odisha & Coastal Andhra Pradesh">Odisha & Coastal Andhra Pradesh</option>
                  <option value="Maharashtra & Konkan Coast">Maharashtra & Konkan Coast</option>
                  <option value="Assam & Brahmaputra Catchment">Assam & Brahmaputra Catchment</option>
                  <option value="Rajasthan Desert Belt">Rajasthan Desert Belt</option>
                  <option value="Himachal Pradesh & Uttarakhand">Himachal Pradesh & Uttarakhand</option>
                  <option value="All India National Broadcast">All India National Broadcast</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-fg-muted uppercase tracking-wider mb-1.5">
                  Warning Severity Tier
                </label>
                <select
                  value={severityLevel}
                  onChange={(e) => setSeverityLevel(e.target.value)}
                  className="w-full bg-status-severe/10 border border-status-severe/20 rounded-xl px-3 py-2.5 text-sm font-bold text-status-severe focus:outline-none focus:ring-1 focus:ring-status-severe focus:border-status-severe transition-colors"
                >
                  <option value="Red Alert (Extreme Urgency)">Red Alert (Extreme Urgency)</option>
                  <option value="Orange Alert (High Preparedness)">Orange Alert (High Preparedness)</option>
                  <option value="Yellow Advisory (Be Aware)">Yellow Advisory (Be Aware)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-fg-muted uppercase tracking-wider mb-1.5">
                Meteorological Phenomenon
              </label>
              <input
                type="text"
                value={threatType}
                onChange={(e) => setThreatType(e.target.value)}
                className="w-full bg-app border border-line rounded-xl px-4 py-2.5 text-sm font-bold text-fg focus:outline-none focus:ring-1 focus:ring-status-severe focus:border-status-severe transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-fg-muted uppercase tracking-wider mb-1.5">
                Public Advisory Bulletin (CAP Plaintext)
              </label>
              <textarea
                value={bulletinText}
                onChange={(e) => setBulletinText(e.target.value)}
                rows={4}
                className="w-full bg-app border border-line rounded-xl px-4 py-3 text-sm font-medium text-fg focus:outline-none focus:ring-1 focus:ring-status-severe focus:border-status-severe leading-relaxed transition-colors"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-fg-muted/5 border border-line text-xs font-bold text-fg-muted flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-status-severe animate-pulse" />
                Integration: SACHET (NDMA) & IMD National Siren Network
              </span>
              <span className="text-fg-muted uppercase tracking-wider text-[10px]">Latency &lt; 800ms</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEmergencyModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-fg-muted hover:text-fg hover:bg-fg-muted/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isBroadcasting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-status-severe hover:bg-status-severe/10 text-white text-sm font-bold transition-all shadow-md shadow-status-severe/20 hover:shadow-lg hover:shadow-status-severe/30 disabled:opacity-50"
              >
                {isBroadcasting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Broadcasting CAP Packet...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Transmit Advisory Alert</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
