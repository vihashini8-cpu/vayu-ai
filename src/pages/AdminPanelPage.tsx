import React, { useState } from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import { AUDIT_LOG } from '../data/mockData';
import {
  ShieldAlert,
  Radio,
  FileCheck2,
  RefreshCw,
  Users,
  Activity,
  Send,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Server,
  Lock,
} from 'lucide-react';

export const AdminPanelPage: React.FC = () => {
  const {
    events,
    dataSources,
    verificationSummary,
    setIsEmergencyModalOpen,
    addToast,
    setSelectedEvent,
  } = useWeatherApp();

  const [activeTab, setActiveTab] = useState<'audit' | 'operators' | 'services' | 'accounts'>('audit');

  const handleAction = (actionName: string) => {
    addToast({
      title: 'Administrative Routine Executed',
      description: `Routine: ${actionName} synchronized across national command cluster.`,
      type: 'info',
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-2xl font-bold text-fg tracking-tight">
            National Meteorological Admin & Operations
          </h2>
          <p className="text-sm text-fg-muted">
            Operational governance, Common Alerting Protocol dispatching, and security audit ledger
          </p>
        </div>

        <button
          onClick={() => setIsEmergencyModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-status-severe hover:bg-status-severe/10 text-white text-sm font-bold transition-all shadow-[0_0_15px_rgba(229,107,111,0.3)] hover:shadow-[0_0_20px_rgba(229,107,111,0.5)]"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Emergency Advisory Dispatch</span>
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-surface border border-line shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-fg uppercase tracking-wider">
          Quick Directives
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => handleAction('Doppler Radar Network Synchronization')}
            className="p-5 rounded-xl bg-app hover:bg-accent/10 border border-line hover:border-accent/20 text-left transition-all group shadow-sm"
          >
            <div className="flex items-center gap-2 text-primary text-sm font-bold mb-2">
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform text-accent" />
              <span>Sync Radar Grids</span>
            </div>
            <p className="text-xs text-fg-muted leading-snug font-medium">
              Poll Paradip, Mumbai, and Kolkata DWR polarimetric sweeps.
            </p>
          </button>

          <button
            onClick={() => handleAction('Calibrate Automated AI Classifier Thresholds')}
            className="p-5 rounded-xl bg-app hover:bg-status-normal/10 border border-line hover:border-status-normal/20 text-left transition-all group shadow-sm"
          >
            <div className="flex items-center gap-2 text-primary text-sm font-bold mb-2">
              <FileCheck2 className="w-4 h-4 text-status-normal" />
              <span>Calibrate Classifiers</span>
            </div>
            <p className="text-xs text-fg-muted leading-snug font-medium">
              Tune confidence threshold to 92% for flash flood detection.
            </p>
          </button>

          <button
            onClick={() => handleAction('Purge Expired Hydromet Transient Telemetry')}
            className="p-5 rounded-xl bg-app hover:bg-status-warning/10 border border-line hover:border-status-warning/20 text-left transition-all group shadow-sm"
          >
            <div className="flex items-center gap-2 text-primary text-sm font-bold mb-2">
              <Zap className="w-4 h-4 text-status-warning" />
              <span>Purge Expired Data</span>
            </div>
            <p className="text-xs text-fg-muted leading-snug font-medium">
              Flush intermediate Doppler buffers older than 72 hours.
            </p>
          </button>

          <button
            onClick={() => handleAction('Run Common Alerting Protocol Gateway Self-Test')}
            className="p-5 rounded-xl bg-app hover:bg-primary-soft border border-line hover:border-primary/20 text-left transition-all group shadow-sm"
          >
            <div className="flex items-center gap-2 text-primary text-sm font-bold mb-2">
              <Server className="w-4 h-4 text-primary" />
              <span>CAP Health Check</span>
            </div>
            <p className="text-xs text-fg-muted leading-snug font-medium">
              Verify handshake with NDMA SACHET alert servers.
            </p>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-line pb-4 text-sm font-medium">
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-lg transition-colors font-semibold ${
            activeTab === 'audit'
              ? 'bg-fg text-white shadow-sm'
              : 'text-fg-muted hover:bg-vayu-lavender/30'
          }`}
        >
          Audit Trail
        </button>
        <button
          onClick={() => setActiveTab('operators')}
          className={`px-4 py-2 rounded-lg transition-colors font-semibold ${
            activeTab === 'operators'
              ? 'bg-fg text-white shadow-sm'
              : 'text-fg-muted hover:bg-vayu-lavender/30'
          }`}
        >
          Active Operators
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-lg transition-colors font-semibold ${
            activeTab === 'services'
              ? 'bg-fg text-white shadow-sm'
              : 'text-fg-muted hover:bg-vayu-lavender/30'
          }`}
        >
          Microservice Status
        </button>
        <button
          onClick={() => setActiveTab('accounts')}
          className={`px-4 py-2 rounded-lg transition-colors font-semibold ${
            activeTab === 'accounts'
              ? 'bg-fg text-white shadow-sm'
              : 'text-fg-muted hover:bg-vayu-lavender/30'
          }`}
        >
          Account Provisioning
        </button>
      </div>

      {activeTab === 'audit' && (
        <div className="p-6 rounded-2xl bg-surface border border-line shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-line">
            <h3 className="text-sm font-bold text-fg flex items-center gap-2">
              <Lock className="w-4 h-4 text-fg-muted" />
              Immutable Audit Ledger
            </h3>
            <span className="text-xs font-mono font-bold tracking-wider text-fg-muted">SHA-256 SIGNED</span>
          </div>

          <div className="space-y-3">
            {AUDIT_LOG.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl bg-app hover:bg-app transition-colors border border-line flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                    <span className="text-fg-muted font-bold">{log.id}</span>
                    <span className="text-fg-muted">·</span>
                    <span className="text-fg-muted font-semibold">{log.timestamp}</span>
                    <span className="text-fg-muted">·</span>
                    <span className="px-2 py-0.5 rounded bg-surface text-fg border border-line font-bold uppercase tracking-wider">
                      {log.action}
                    </span>
                  </div>
                  <p className="text-fg text-sm font-medium">{log.details}</p>
                  <div className="text-xs text-fg-muted font-medium">
                    Operator: <span className="font-bold text-fg">{log.performedBy}</span> · Target: <span className="font-mono text-fg-muted">{log.targetId}</span>
                  </div>
                </div>

                <div className="shrink-0">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded ${
                      log.severity === 'alert'
                        ? 'bg-status-severe/10 text-status-severe border border-status-severe/20'
                        : log.severity === 'warning'
                        ? 'bg-status-warning/10 text-status-warning border border-status-warning/20'
                        : 'bg-status-normal/10 text-status-normal border border-status-normal/20'
                    }`}
                  >
                    {log.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'operators' && (
        <div className="p-6 rounded-2xl bg-surface border border-line shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-fg flex items-center gap-2">
            <Users className="w-4 h-4 text-fg-muted" />
            Duty Operators & Field Liaisons
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-app border border-line space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-fg text-sm">Dr. K. Swaminathan</span>
                <span className="w-2.5 h-2.5 rounded-full bg-status-normal shadow-[0_0_8px_rgba(24,184,166,0.6)]" title="Active on shift" />
              </div>
              <div className="text-fg-muted font-medium text-sm">Lead Cyclone Specialist · Eastern Division</div>
              <div className="text-[11px] font-mono text-fg-muted font-semibold">Station: Paradip / Bhubaneswar</div>
            </div>

            <div className="p-5 rounded-xl bg-app border border-line space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-fg text-sm">Ananya Deshmukh</span>
                <span className="w-2.5 h-2.5 rounded-full bg-status-normal shadow-[0_0_8px_rgba(24,184,166,0.6)]" title="Active on shift" />
              </div>
              <div className="text-fg-muted font-medium text-sm">Urban Hydrology Duty Officer</div>
              <div className="text-[11px] font-mono text-fg-muted font-semibold">Station: Mumbai MCGM EOC</div>
            </div>

            <div className="p-5 rounded-xl bg-app border border-line space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-fg text-sm">Tsering Angchuk</span>
                <span className="w-2.5 h-2.5 rounded-full bg-status-normal shadow-[0_0_8px_rgba(24,184,166,0.6)]" title="Active on shift" />
              </div>
              <div className="text-fg-muted font-medium text-sm">Himalayan Western Disturbance Desk</div>
              <div className="text-[11px] font-mono text-fg-muted font-semibold">Station: Shimla / Leh AWS Hub</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="p-6 rounded-2xl bg-surface border border-line shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-fg flex items-center gap-2">
            <Server className="w-4 h-4 text-fg-muted" />
            Infrastructure Topology & Health
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-surface border border-status-normal/20 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-fg text-sm">Ingestion Daemon</span>
                <span className="text-[10px] font-mono font-bold text-status-normal tracking-wider">HEALTHY</span>
              </div>
              <div className="text-sm text-fg-muted font-medium">Pulls WMO BUFR & MQTT streams</div>
            </div>

            <div className="p-5 rounded-xl bg-surface border border-status-normal/20 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-fg text-sm">AI Vision Classifier</span>
                <span className="text-[10px] font-mono font-bold text-status-normal tracking-wider">HEALTHY</span>
              </div>
              <div className="text-sm text-fg-muted font-medium">TensorFlow / PyTorch worker pool</div>
            </div>

            <div className="p-5 rounded-xl bg-surface border border-status-normal/20 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-fg text-sm">Spatial Corroborator</span>
                <span className="text-[10px] font-mono font-bold text-status-normal tracking-wider">HEALTHY</span>
              </div>
              <div className="text-sm text-fg-muted font-medium">PostGIS / GeoJSON bounding checks</div>
            </div>

            <div className="p-5 rounded-xl bg-surface border border-status-normal/20 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-fg text-sm">CAP Broadcaster</span>
                <span className="text-[10px] font-mono font-bold text-status-normal tracking-wider">HEALTHY</span>
              </div>
              <div className="text-sm text-fg-muted font-medium">SACHET & Cell Broadcast gateway</div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'accounts' && (
        <div className="p-6 rounded-2xl bg-surface border border-line shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-fg flex items-center gap-2">
            <Users className="w-4 h-4 text-fg-muted" />
            Provision Official Accounts
          </h3>
          
          <form className="space-y-4 max-w-md" onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            try {
              const res = await fetch('/api/auth/admin/invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.fromEntries(formData)),
              });
              const data = await res.json();
              if (res.ok) {
                alert(`Account Provisioned successfully! Share this secure setup link with the official:\n\n${window.location.origin}${data.setupLink}`);
                (e.target as HTMLFormElement).reset();
              } else {
                alert('Error provisioning account: ' + data.error);
              }
            } catch (err) {
              alert('Network error. Please try again.');
            }
          }}>
            <div>
              <label className="block text-xs font-bold text-fg-muted mb-1">Official Full Name</label>
              <input type="text" name="name" required className="w-full bg-app border border-line rounded-lg px-3 py-2 text-sm text-fg" placeholder="e.g. Dr. A. Sharma" />
            </div>
            <div>
              <label className="block text-xs font-bold text-fg-muted mb-1">Official Email Address</label>
              <input type="email" name="email" required className="w-full bg-app border border-line rounded-lg px-3 py-2 text-sm text-fg" placeholder="e.g. official@vayu.gov.in" />
            </div>
            <div>
              <label className="block text-xs font-bold text-fg-muted mb-1">Role Designation</label>
              <select name="role" required className="w-full bg-app border border-line rounded-lg px-3 py-2 text-sm text-fg">
                <option value="meteorologist">Meteorologist (National/Command Center)</option>
                <option value="sdma">State Disaster Management (Regional)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-fg-muted mb-1">Assigned Region / State</label>
              <input type="text" name="region" className="w-full bg-app border border-line rounded-lg px-3 py-2 text-sm text-fg" placeholder="e.g. Kerala (Required for SDMA)" />
            </div>
            <button type="submit" className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-sm w-full">
              Generate Secure Invitation
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
