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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#0B1929] border border-rose-500/40 rounded-2xl shadow-2xl shadow-rose-950/40 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Banner */}
        <div className="bg-rose-950/60 border-b border-rose-500/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                National Weather Emergency Dispatcher
              </h3>
              <p className="text-xs text-rose-300">
                Authorized NDMA / SDMA Multi-Channel Alert Gateway
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEmergencyModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-md"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {broadcastDone ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Advisory Broadcast Synchronized</h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Dispatched across 85 coastal telecom towers, State EOC consoles, and public sirens under Common Alerting Protocol v1.2.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBroadcast} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Target State / Coastal Belt
                </label>
                <select
                  value={targetRegion}
                  onChange={(e) => setTargetRegion(e.target.value)}
                  className="w-full bg-[#102238] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
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
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Warning Severity Tier
                </label>
                <select
                  value={severityLevel}
                  onChange={(e) => setSeverityLevel(e.target.value)}
                  className="w-full bg-[#102238] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="Red Alert (Extreme Urgency)">Red Alert (Extreme Urgency)</option>
                  <option value="Orange Alert (High Preparedness)">Orange Alert (High Preparedness)</option>
                  <option value="Yellow Advisory (Be Aware)">Yellow Advisory (Be Aware)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Meteorological Phenomenon
              </label>
              <input
                type="text"
                value={threatType}
                onChange={(e) => setThreatType(e.target.value)}
                className="w-full bg-[#102238] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Public Advisory Bulletin (CAP Plaintext)
              </label>
              <textarea
                value={bulletinText}
                onChange={(e) => setBulletinText(e.target.value)}
                rows={4}
                className="w-full bg-[#102238] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500 leading-relaxed font-mono"
              />
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                Integration: SACHET (NDMA) & IMD National Siren Network
              </span>
              <span className="text-slate-500">Latency &lt; 800ms</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEmergencyModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isBroadcasting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-lg shadow-rose-950/60 disabled:opacity-50"
              >
                {isBroadcasting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
