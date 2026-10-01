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
        return 'text-status-severe bg-status-severe/10 border-status-severe/20';
      case 'warning':
        return 'text-status-warning bg-status-warning/10 border-status-warning/20';
      case 'advisory':
        return 'text-primary bg-primary-soft border-primary/20';
      default:
        return 'text-status-normal bg-status-normal/10 border-status-normal/20';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-status-normal bg-status-normal/10 border-status-normal/20';
      case 'pending':
        return 'text-status-warning bg-status-warning/10 border-status-warning/20';
      case 'flagged':
        return 'text-status-severe bg-status-severe/10 border-status-severe/20';
      case 'rejected':
        return 'text-fg-muted bg-fg-muted/10 border-line';
      default:
        return 'text-fg-muted bg-app border-line';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-fg/60 backdrop-blur-sm flex justify-end transition-opacity">
      <div
        className="w-full max-w-2xl bg-surface border-l border-line shadow-2xl flex flex-col h-full overflow-y-auto animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-surface backdrop-blur-md px-6 py-4 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-primary tracking-wider font-bold">
              {selectedEvent.id}
            </span>
            <span className="text-fg-muted">·</span>
            <span
              className={`text-[10px] px-2.5 py-1 rounded border font-bold uppercase tracking-wider ${getSeverityStyle(
                selectedEvent.severity
              )}`}
            >
              {selectedEvent.severity}
            </span>
            <span
              className={`text-[10px] px-2.5 py-1 rounded border font-bold uppercase tracking-wider ${getStatusStyle(
                selectedEvent.status
              )}`}
            >
              {selectedEvent.status}
            </span>
          </div>

          <button
            onClick={() => setSelectedEvent(null)}
            className="p-1.5 text-fg-muted hover:text-status-severe rounded-lg hover:bg-status-severe/10 transition-colors"
            aria-label="Close detail panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1">
          {/* Title & Location */}
          <div>
            <h2 id="drawer-title" className="text-xl font-black text-fg tracking-tight leading-snug">
              {selectedEvent.title}
            </h2>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-xs text-fg-muted">
              <div className="flex items-center gap-1.5 text-fg">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span className="font-bold">{selectedEvent.location.city}</span>, <span className="font-medium">{selectedEvent.location.state} ({selectedEvent.location.region})</span>
              </div>
              <span className="text-fg-muted hidden sm:inline">·</span>
              <div className="flex items-center gap-1.5 text-fg-muted">
                <Clock className="w-4 h-4 shrink-0 text-fg-muted" />
                <span className="font-medium">{selectedEvent.timestamp}</span>
                <span className="text-fg-muted font-mono font-medium">({selectedEvent.reportedAgo})</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-5 rounded-2xl bg-app border border-line">
            <h3 className="text-[10px] font-bold text-fg-muted uppercase tracking-wider mb-2">
              Incident Situation Report
            </h3>
            <p className="text-sm text-fg leading-relaxed font-medium">
              {selectedEvent.description}
            </p>
          </div>

          {/* Telemetry Matrix */}
          <div>
            <h3 className="text-[10px] font-bold text-fg-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" />
              Observed Atmospheric Telemetry
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {selectedEvent.telemetry.rainfallMm !== undefined && (
                <div className="p-4 rounded-xl bg-surface border border-line shadow-sm hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-2 text-xs font-semibold text-fg-muted">
                    <Droplets className="w-4 h-4 text-primary" />
                    <span>Precipitation</span>
                  </div>
                  <div className="mt-1.5 text-lg font-bold font-mono text-fg">
                    {selectedEvent.telemetry.rainfallMm} <span className="text-[10px] font-bold text-fg-muted tracking-wider uppercase ml-0.5">mm</span>
                  </div>
                </div>
              )}

              {selectedEvent.telemetry.windSpeedKmh !== undefined && (
                <div className="p-4 rounded-xl bg-surface border border-line shadow-sm hover:border-accent/20 transition-colors">
                  <div className="flex items-center gap-2 text-xs font-semibold text-fg-muted">
                    <Wind className="w-4 h-4 text-accent" />
                    <span>Wind Speed</span>
                  </div>
                  <div className="mt-1.5 text-lg font-bold font-mono text-fg">
                    {selectedEvent.telemetry.windSpeedKmh} <span className="text-[10px] font-bold text-fg-muted tracking-wider uppercase ml-0.5">km/h</span>
                  </div>
                </div>
              )}

              {selectedEvent.telemetry.temperatureC !== undefined && (
                <div className="p-4 rounded-xl bg-surface border border-line shadow-sm hover:border-status-warning/20 transition-colors">
                  <div className="flex items-center gap-2 text-xs font-semibold text-fg-muted">
                    <Thermometer className="w-4 h-4 text-status-warning" />
                    <span>Ambient Temp</span>
                  </div>
                  <div className="mt-1.5 text-lg font-bold font-mono text-fg">
                    {selectedEvent.telemetry.temperatureC} <span className="text-[10px] font-bold text-fg-muted tracking-wider uppercase ml-0.5">°C</span>
                  </div>
                </div>
              )}

              {selectedEvent.telemetry.pressureHpa !== undefined && (
                <div className="p-4 rounded-xl bg-surface border border-line shadow-sm hover:border-line transition-colors">
                  <div className="flex items-center gap-2 text-xs font-semibold text-fg-muted">
                    <Gauge className="w-4 h-4 text-fg-muted" />
                    <span>Pressure</span>
                  </div>
                  <div className="mt-1.5 text-lg font-bold font-mono text-fg">
                    {selectedEvent.telemetry.pressureHpa} <span className="text-[10px] font-bold text-fg-muted tracking-wider uppercase ml-0.5">hPa</span>
                  </div>
                </div>
              )}

              {selectedEvent.telemetry.humidityPct !== undefined && (
                <div className="p-4 rounded-xl bg-surface border border-line shadow-sm hover:border-status-normal/20 transition-colors">
                  <div className="flex items-center gap-2 text-xs font-semibold text-fg-muted">
                    <Droplets className="w-4 h-4 text-status-normal" />
                    <span>Humidity</span>
                  </div>
                  <div className="mt-1.5 text-lg font-bold font-mono text-fg">
                    {selectedEvent.telemetry.humidityPct} <span className="text-[10px] font-bold text-fg-muted tracking-wider uppercase ml-0.5">%</span>
                  </div>
                </div>
              )}

              {selectedEvent.telemetry.visibilityKm !== undefined && (
                <div className="p-4 rounded-xl bg-surface border border-line shadow-sm hover:border-line transition-colors">
                  <div className="flex items-center gap-2 text-xs font-semibold text-fg-muted">
                    <Eye className="w-4 h-4 text-fg-muted" />
                    <span>Surface Visibility</span>
                  </div>
                  <div className="mt-1.5 text-lg font-bold font-mono text-fg">
                    {selectedEvent.telemetry.visibilityKm} <span className="text-[10px] font-bold text-fg-muted tracking-wider uppercase ml-0.5">km</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Evidence-Based Assessment Box */}
          {selectedEvent.evidenceAssessment && (
            <div className={`p-5 rounded-2xl border ${
              selectedEvent.evidenceAssessment.evidenceStatus === 'supporting'
                ? 'bg-status-normal/10 border-status-normal/20'
                : selectedEvent.evidenceAssessment.evidenceStatus === 'conflicting'
                ? 'bg-status-severe/10 border-status-severe/20'
                : 'bg-status-warning/10 border-status-warning/20'
            }`}>
              <div className="flex flex-wrap items-center justify-between mb-3 gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`w-4 h-4 ${
                    selectedEvent.evidenceAssessment.evidenceStatus === 'supporting' ? 'text-status-normal' :
                    selectedEvent.evidenceAssessment.evidenceStatus === 'conflicting' ? 'text-status-severe' : 'text-status-warning'
                  }`} />
                  <h3 className={`text-[10px] font-bold uppercase tracking-wider ${
                    selectedEvent.evidenceAssessment.evidenceStatus === 'supporting' ? 'text-status-normal' :
                    selectedEvent.evidenceAssessment.evidenceStatus === 'conflicting' ? 'text-status-severe' : 'text-status-warning'
                  }`}>
                    Rule-Based Evidence Check: {selectedEvent.evidenceAssessment.evidenceStatus.toUpperCase()}
                  </h3>
                </div>
                {selectedEvent.evidenceAssessment.preliminaryScore !== undefined && (
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded border font-bold uppercase tracking-wider border-line text-fg bg-surface shadow-sm">
                    Score: {selectedEvent.evidenceAssessment.preliminaryScore}/100
                  </span>
                )}
              </div>

              <p className="text-sm font-medium text-fg leading-relaxed mb-4">
                {selectedEvent.evidenceAssessment.explanation}
              </p>

              <div className="border-t border-line/50 pt-3 text-xs space-y-2">
                <div className="text-fg-muted font-medium flex items-center justify-between">
                  <div><span className="font-semibold text-fg">Source: </span> {selectedEvent.evidenceAssessment.source}</div>
                  <div><span className="font-semibold text-fg">Time: </span> {new Date(selectedEvent.evidenceAssessment.observationTime).toLocaleString()}</div>
                </div>
                <div className="text-fg-muted font-medium">
                  <span className="font-semibold text-fg">Retrieved Measurements: </span>
                  {Object.entries(selectedEvent.evidenceAssessment.retrievedMeasurements).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                </div>
              </div>
            </div>
          )}

          {/* AI Preliminary Verification Box */}
          {!selectedEvent.evidenceAssessment && selectedEvent.aiAnalysis && (
            <div className="p-5 rounded-2xl bg-accent/10 border border-accent/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" />
                  <h3 className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    AI-Assisted Classification
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded border font-bold uppercase tracking-wider border-accent/20 text-primary bg-surface shadow-sm">
                  Confidence: {selectedEvent.aiAnalysis.confidenceScore}%
                </span>
              </div>

              <p className="text-sm font-medium text-fg leading-relaxed mb-4">
                {selectedEvent.aiAnalysis.summary}
              </p>

              <div className="border-t border-accent/20 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="text-fg-muted font-medium">
                  <span className="font-semibold text-fg">Cross-Referenced: </span>
                  {selectedEvent.aiAnalysis.crossCheckedWith.join(' · ')}
                </div>
                <div className="text-fg-muted font-medium">
                  <span className="font-semibold text-fg">Duplicate Risk: </span>
                  <span
                    className={`font-bold uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded ${
                      selectedEvent.aiAnalysis.duplicateRisk === 'low'
                        ? 'text-status-normal bg-status-normal/10'
                        : selectedEvent.aiAnalysis.duplicateRisk === 'moderate'
                        ? 'text-status-warning bg-status-warning/10'
                        : 'text-status-severe bg-status-severe/10'
                    }`}
                  >
                    {selectedEvent.aiAnalysis.duplicateRisk}
                  </span>
                </div>
              </div>
              <div className="mt-3 text-[10px] font-semibold text-fg-muted italic">
                * Note: AI analysis serves as preliminary decision support for official duty meteorologists.
              </div>
            </div>
          )}

          {/* Source & Provenance */}
          <div className="p-5 rounded-2xl bg-app border border-line">
            <h3 className="text-[10px] font-bold text-fg-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <Radio className="w-4 h-4 text-primary" />
              Source & Ingestion Provenance
            </h3>
            <div className="flex items-center justify-between text-xs">
              <div>
                <div className="text-fg font-bold text-sm">{selectedEvent.source.name}</div>
                <div className="text-fg-muted font-semibold mt-1 uppercase tracking-wider text-[10px]">Ingestion Channel: {selectedEvent.source.type}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-status-normal font-bold bg-surface px-2 py-1 rounded shadow-sm border border-status-normal/20 inline-block mb-1">
                  Trust Score: {selectedEvent.source.trustScore}/100
                </div>
                <div className="text-[10px] font-semibold text-fg-muted uppercase tracking-wider">Cryptographically Signed</div>
              </div>
            </div>

            {selectedEvent.reporter && (
              <div className="mt-4 pt-4 border-t border-line text-xs font-medium text-fg-muted flex items-center justify-between">
                <span><span className="font-semibold text-fg">Reporter:</span> {selectedEvent.reporter.name}</span>
                <span className="text-fg-muted font-mono font-semibold">
                  {selectedEvent.reporter.reportsCount} historical submissions
                </span>
              </div>
            )}
          </div>

          {/* Operational Review / Action Panel */}
          <div className="p-5 rounded-2xl bg-surface border border-line shadow-sm space-y-4">
            <h3 className="text-[10px] font-bold text-fg uppercase tracking-wider flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-status-normal" />
              Meteorological Desk Review
            </h3>

            {selectedEvent.reviewNotes && (
              <div className="p-3 rounded-xl bg-vayu-lavender/30 border border-vayu-lavender/20 text-xs font-medium text-fg">
                <span className="font-bold text-primary">Log Note: </span>
                {selectedEvent.reviewNotes}
              </div>
            )}

            <div>
              <label htmlFor="desk-notes" className="block text-[10px] font-bold text-fg-muted uppercase tracking-wider mb-2">
                Operator Annotations (Optional)
              </label>
              <textarea
                id="desk-notes"
                value={operatorNotes}
                onChange={(e) => setOperatorNotes(e.target.value)}
                placeholder="Enter corroboration rationale, radar cell coordinates, or dispatch instructions..."
                rows={2}
                className="w-full bg-app border border-line rounded-xl px-4 py-3 text-sm text-fg font-medium placeholder:text-fg-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-shadow"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <button
                onClick={handleVerify}
                disabled={isSubmitting || selectedEvent.status === 'verified'}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-status-normal hover:bg-status-normal/10 disabled:opacity-50 text-white font-bold text-xs transition-colors shadow-[0_0_10px_rgba(24,184,166,0.2)] hover:shadow-[0_0_15px_rgba(24,184,166,0.4)]"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Verify Event</span>
              </button>

              <button
                onClick={handleFlag}
                disabled={isSubmitting || selectedEvent.status === 'flagged'}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-status-warning hover:bg-status-warning/10 disabled:opacity-50 text-white font-bold text-xs transition-colors shadow-sm"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Flag Review</span>
              </button>

              <button
                onClick={handleReject}
                disabled={isSubmitting || selectedEvent.status === 'rejected'}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-surface hover:bg-status-severe/10 border border-line hover:border-status-severe/20 disabled:opacity-50 text-fg font-bold text-xs transition-colors"
              >
                <XCircle className="w-4 h-4 shrink-0" />
                <span>Reject</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-surface backdrop-blur-md px-6 py-4 border-t border-line flex items-center justify-between text-xs text-fg-muted">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>VAYU AI National Audit Ledger #2026</span>
          </div>
          <button
            onClick={() => setSelectedEvent(null)}
            className="text-xs font-bold text-fg-muted hover:text-fg underline underline-offset-4 transition-colors"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
