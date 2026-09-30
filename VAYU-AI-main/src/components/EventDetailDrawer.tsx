import React, { useState } from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import {
  X,
  MapPin,
  Clock,
  Radio,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Wind,
  Droplets,
  Thermometer,
  Gauge,
  Eye,
  ShieldCheck,
  Cpu,
  Layers,
  FileCheck2,
} from 'lucide-react';

export const EventDetailDrawer: React.FC = () => {
  const { selectedEvent, setSelectedEvent, verifyEvent, rejectEvent, flagEvent } = useWeatherApp();
  const [operatorNotes, setOperatorNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedEvent) return null;

  const handleVerify = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      verifyEvent(selectedEvent.id, operatorNotes || 'Corroborated by Desk Meteorologist with Doppler sweep.');
      setIsSubmitting(false);
      setOperatorNotes('');
    }, 250);
  };

  const handleFlag = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      flagEvent(selectedEvent.id, operatorNotes || 'Discrepancy noted in sensor reading; field check dispatched.');
      setIsSubmitting(false);
      setOperatorNotes('');
    }, 250);
  };

  const handleReject = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      rejectEvent(selectedEvent.id, operatorNotes || 'Disconfirmed following ground truth review.');
      setIsSubmitting(false);
      setOperatorNotes('');
    }, 250);
  };

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'severe':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'warning':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'advisory':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-teal-400 bg-teal-500/10 border-teal-500/30';
      case 'pending':
        return 'text-amber-300 bg-amber-500/10 border-amber-500/30';
      case 'flagged':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'rejected':
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
      default:
        return 'text-slate-300 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end transition-opacity">
      <div
        className="w-full max-w-2xl bg-[#0B1929] border-l border-slate-700/80 shadow-2xl flex flex-col h-full overflow-y-auto animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#07111F]/90 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-cyan-400 tracking-wider font-semibold">
              {selectedEvent.id}
            </span>
            <span className="text-slate-600">·</span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-md border font-medium uppercase tracking-wide ${getSeverityStyle(
                selectedEvent.severity
              )}`}
            >
              {selectedEvent.severity}
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-md border font-medium capitalize tracking-wide ${getStatusStyle(
                selectedEvent.status
              )}`}
            >
              {selectedEvent.status}
            </span>
          </div>

          <button
            onClick={() => setSelectedEvent(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
            aria-label="Close detail panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1">
          {/* Title & Location */}
          <div>
            <h2 id="drawer-title" className="text-xl font-bold text-white tracking-tight leading-snug">
              {selectedEvent.title}
            </h2>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 text-slate-200">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-semibold">{selectedEvent.location.city}</span>, {selectedEvent.location.state} ({selectedEvent.location.region})
              </div>
              <span className="text-slate-600 hidden sm:inline">·</span>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-4 h-4 shrink-0" />
                <span>{selectedEvent.timestamp}</span>
                <span className="text-slate-500 font-mono">({selectedEvent.reportedAgo})</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 rounded-xl bg-[#102238] border border-slate-800/80">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Incident Situation Report
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">
              {selectedEvent.description}
            </p>
          </div>

          {/* Telemetry Matrix */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Observed Atmospheric Telemetry
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {selectedEvent.telemetry.rainfallMm !== undefined && (
                <div className="p-3 rounded-lg bg-[#102238]/80 border border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    <span>Precipitation</span>
                  </div>
                  <div className="mt-1 text-lg font-bold font-mono text-white">
                    {selectedEvent.telemetry.rainfallMm} <span className="text-xs font-normal text-slate-400">mm</span>
                  </div>
                </div>
              )}

              {selectedEvent.telemetry.windSpeedKmh !== undefined && (
                <div className="p-3 rounded-lg bg-[#102238]/80 border border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Wind className="w-4 h-4 text-teal-400" />
                    <span>Wind Speed</span>
                  </div>
                  <div className="mt-1 text-lg font-bold font-mono text-white">
                    {selectedEvent.telemetry.windSpeedKmh} <span className="text-xs font-normal text-slate-400">km/h</span>
                  </div>
                </div>
              )}

              {selectedEvent.telemetry.temperatureC !== undefined && (
                <div className="p-3 rounded-lg bg-[#102238]/80 border border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Thermometer className="w-4 h-4 text-amber-400" />
                    <span>Ambient Temp</span>
                  </div>
                  <div className="mt-1 text-lg font-bold font-mono text-white">
                    {selectedEvent.telemetry.temperatureC} <span className="text-xs font-normal text-slate-400">°C</span>
                  </div>
                </div>
              )}

              {selectedEvent.telemetry.pressureHpa !== undefined && (
                <div className="p-3 rounded-lg bg-[#102238]/80 border border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Gauge className="w-4 h-4 text-purple-400" />
                    <span>Pressure</span>
                  </div>
                  <div className="mt-1 text-lg font-bold font-mono text-white">
                    {selectedEvent.telemetry.pressureHpa} <span className="text-xs font-normal text-slate-400">hPa</span>
                  </div>
                </div>
              )}

              {selectedEvent.telemetry.humidityPct !== undefined && (
                <div className="p-3 rounded-lg bg-[#102238]/80 border border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    <span>Humidity</span>
                  </div>
                  <div className="mt-1 text-lg font-bold font-mono text-white">
                    {selectedEvent.telemetry.humidityPct} <span className="text-xs font-normal text-slate-400">%</span>
                  </div>
                </div>
              )}

              {selectedEvent.telemetry.visibilityKm !== undefined && (
                <div className="p-3 rounded-lg bg-[#102238]/80 border border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Eye className="w-4 h-4 text-slate-400" />
                    <span>Surface Visibility</span>
                  </div>
                  <div className="mt-1 text-lg font-bold font-mono text-white">
                    {selectedEvent.telemetry.visibilityKm} <span className="text-xs font-normal text-slate-400">km</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Preliminary Verification Box */}
          {selectedEvent.aiAnalysis && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#102238] to-[#0d1b2d] border border-cyan-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                    AI-Assisted Classification
                  </h3>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-700/40 text-cyan-300">
                  Confidence: {selectedEvent.aiAnalysis.confidenceScore}%
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {selectedEvent.aiAnalysis.summary}
              </p>

              <div className="border-t border-slate-800/80 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="text-slate-400">
                  <span className="text-slate-500">Cross-Referenced: </span>
                  <span className="text-slate-300 font-medium">
                    {selectedEvent.aiAnalysis.crossCheckedWith.join(' · ')}
                  </span>
                </div>
                <div className="text-slate-400">
                  <span className="text-slate-500">Duplicate Risk: </span>
                  <span
                    className={`font-semibold capitalize ${
                      selectedEvent.aiAnalysis.duplicateRisk === 'low'
                        ? 'text-teal-400'
                        : selectedEvent.aiAnalysis.duplicateRisk === 'moderate'
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {selectedEvent.aiAnalysis.duplicateRisk}
                  </span>
                </div>
              </div>
              <div className="mt-2 text-[11px] text-slate-500 italic">
                * Note: AI analysis serves as preliminary decision support for official duty meteorologists.
              </div>
            </div>
          )}

          {/* Source & Provenance */}
          <div className="p-4 rounded-xl bg-[#102238] border border-slate-800">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Radio className="w-4 h-4 text-blue-400" />
              Source & Ingestion Provenance
            </h3>
            <div className="flex items-center justify-between text-xs">
              <div>
                <div className="text-slate-200 font-medium">{selectedEvent.source.name}</div>
                <div className="text-slate-400 mt-0.5">Ingestion Channel: {selectedEvent.source.type.toUpperCase()}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-teal-400 font-semibold">
                  Trust Score: {selectedEvent.source.trustScore}/100
                </div>
                <div className="text-[11px] text-slate-500">Cryptographically Signed</div>
              </div>
            </div>

            {selectedEvent.reporter && (
              <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                <span>Reporter: {selectedEvent.reporter.name}</span>
                <span className="text-slate-500 font-mono">
                  {selectedEvent.reporter.reportsCount} historical submissions
                </span>
              </div>
            )}
          </div>

          {/* Operational Review / Action Panel */}
          <div className="p-4 rounded-xl bg-[#091524] border border-slate-800 space-y-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-teal-400" />
              Meteorological Desk Review
            </h3>

            {selectedEvent.reviewNotes && (
              <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                <span className="text-slate-500 font-medium">Log Note: </span>
                {selectedEvent.reviewNotes}
              </div>
            )}

            <div>
              <label htmlFor="desk-notes" className="block text-xs text-slate-400 mb-1.5">
                Operator Annotations (Optional)
              </label>
              <textarea
                id="desk-notes"
                value={operatorNotes}
                onChange={(e) => setOperatorNotes(e.target.value)}
                placeholder="Enter corroboration rationale, radar cell coordinates, or dispatch instructions..."
                rows={2}
                className="w-full bg-[#102238] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <button
                onClick={handleVerify}
                disabled={isSubmitting || selectedEvent.status === 'verified'}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-medium text-xs transition-colors shadow-sm shadow-teal-900/40"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Verify Event</span>
              </button>

              <button
                onClick={handleFlag}
                disabled={isSubmitting || selectedEvent.status === 'flagged'}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-amber-600/90 hover:bg-amber-500 disabled:opacity-50 text-white font-medium text-xs transition-colors shadow-sm shadow-amber-900/40"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Flag Review</span>
              </button>

              <button
                onClick={handleReject}
                disabled={isSubmitting || selectedEvent.status === 'rejected'}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 border border-slate-700 hover:border-rose-700/60 disabled:opacity-50 text-slate-300 font-medium text-xs transition-colors"
              >
                <XCircle className="w-4 h-4 shrink-0" />
                <span>Reject</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#07111F] px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>VAYU AI National Audit Ledger #2026</span>
          </div>
          <button
            onClick={() => setSelectedEvent(null)}
            className="text-xs text-slate-400 hover:text-white underline underline-offset-4"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
