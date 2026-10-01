import React, { useState } from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import { WeatherCategory, EventSeverity } from '../types';
import {
  Droplets,
  CloudLightning,
  Sun,
  Wind,
  CloudFog,
  Upload,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  X,
} from 'lucide-react';

export const CitizenReportPage: React.FC = () => {
  const { submitCitizenReport, setActiveView } = useWeatherApp();

  const [category, setCategory] = useState<WeatherCategory>('rainfall');
  const [severity, setSeverity] = useState<EventSeverity>('warning');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [reporterName, setReporterName] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const categoryOptions: {
    id: WeatherCategory;
    title: string;
    icon: React.ReactNode;
  }[] = [
    { id: 'rainfall', title: 'Rainfall', icon: <Droplets className="w-5 h-5 text-accent" /> },
    { id: 'flooding', title: 'Flooding', icon: <Droplets className="w-5 h-5 text-status-normal" /> },
    { id: 'thunderstorm', title: 'Thunderstorm', icon: <CloudLightning className="w-5 h-5 text-primary" /> },
    { id: 'cyclone', title: 'Cyclone', icon: <Wind className="w-5 h-5 text-fg-muted" /> },
    { id: 'heatwave', title: 'Heatwave', icon: <Sun className="w-5 h-5 text-status-warning" /> },
    { id: 'dense_fog', title: 'Dense Fog', icon: <CloudFog className="w-5 h-5 text-fg-muted" /> },
  ];

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi NCR', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  ];

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file.name);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!description.trim() || description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    
    try {
      const newId = await submitCitizenReport({
        title,
        description,
        category,
        severity,
        location: {
          city,
          state,
          region: 'Field Submission Sector',
          lat: 19.0760, // Ideally we would geocode this or use browser Geolocation, but hardcoding for demo
          lng: 72.8777,
        },
        reporter: {
          name: reporterName || 'Community Weather Scout',
          isVerifiedUser: false,
          reportsCount: 1,
        },
      });

      setSubmittedId(newId);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setCity('');
    setReporterName('');
    setSelectedFile(null);
    setSubmittedId(null);
    setErrors({});
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-fg tracking-tight">Report Incident</h2>
        <p className="text-fg-muted max-w-lg mx-auto">
          Submit local weather observations to assist emergency response teams.
        </p>
      </div>

      {submittedId ? (
        <div className="p-8 rounded-2xl bg-surface border border-line shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-status-normal/10 text-status-normal flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-fg">Report Registered</h3>
            <p className="text-sm text-fg-muted max-w-md mx-auto">
              Thank you for your report. It is now pending review by our verification team.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-app border border-line max-w-sm mx-auto text-left space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-fg-muted">Reference ID:</span>
              <span className="font-mono font-medium text-fg">{submittedId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-fg-muted">Location:</span>
              <span className="font-medium text-fg">{city}, {state}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-fg-muted">Status:</span>
              <span className="text-status-warning font-bold inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-status-warning/10">
                <Clock className="w-3.5 h-3.5" /> Pending
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setActiveView('verification')}
              className="px-6 py-2.5 rounded-xl bg-accent text-fg font-bold text-sm transition-all hover:bg-accent/10 hover:shadow-[0_0_15px_rgba(67,217,230,0.4)]"
            >
              Go to Verification
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-surface border border-line hover:bg-app text-fg font-bold text-sm transition-colors"
            >
              Submit Another
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-surface border border-line shadow-sm space-y-8">
          
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-fg uppercase tracking-wider">1. Category</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categoryOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setCategory(opt.id)}
                  className={`p-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-3 ${
                    category === opt.id
                      ? 'bg-primary text-white border-primary shadow-sm ring-1 ring-primary'
                      : 'bg-surface border-line text-fg-muted hover:border-primary/20'
                  }`}
                >
                  <div className={category === opt.id ? 'text-white' : ''}>
                    {React.cloneElement(opt.icon as React.ReactElement<{className?: string}>, {
                      className: `w-5 h-5 ${category === opt.id ? 'text-accent' : ''}`
                    })}
                  </div>
                  <span className="text-sm font-semibold">{opt.title}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-fg uppercase tracking-wider">2. Location</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-fg-muted mb-1.5">State / UT</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-app border border-line rounded-xl px-4 py-2.5 text-sm text-fg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  {indianStates.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-fg-muted mb-1.5">City / Area</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bandra West"
                  className={`w-full bg-app border rounded-xl px-4 py-2.5 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${
                    errors.city ? 'border-status-severe focus:ring-status-severe' : 'border-line'
                  }`}
                />
                {errors.city && <p className="text-xs text-status-severe font-medium mt-1">{errors.city}</p>}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-fg uppercase tracking-wider">3. Details</h3>
            
            <div>
              <label className="block text-sm font-semibold text-fg-muted mb-1.5">Headline</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief summary of the incident"
                className={`w-full bg-app border rounded-xl px-4 py-2.5 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${
                  errors.title ? 'border-status-severe focus:ring-status-severe' : 'border-line'
                }`}
              />
              {errors.title && <p className="text-xs text-status-severe font-medium mt-1">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-fg-muted mb-1.5">Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as EventSeverity)}
                  className="w-full bg-app border border-line rounded-xl px-4 py-2.5 text-sm text-fg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="severe">Severe (Immediate Danger)</option>
                  <option value="warning">Warning (Significant Disruption)</option>
                  <option value="advisory">Advisory (Mild Impact)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-fg-muted mb-1.5">Your Name (Optional)</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Leave blank to remain anonymous"
                  className="w-full bg-app border border-line rounded-xl px-4 py-2.5 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-fg-muted mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Provide detailed observations..."
                className={`w-full bg-app border rounded-xl px-4 py-3 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${
                  errors.description ? 'border-status-severe focus:ring-status-severe' : 'border-line'
                }`}
              />
              {errors.description && <p className="text-xs text-status-severe font-medium mt-1">{errors.description}</p>}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-fg uppercase tracking-wider">4. Media (Optional)</h3>
            
            {selectedFile ? (
              <div className="p-3 rounded-xl bg-app border border-line flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-fg">
                  <CheckCircle2 className="w-4 h-4 text-status-normal shrink-0" />
                  <span className="font-semibold">{selectedFile}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="p-1 text-fg-muted hover:text-status-severe transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-line hover:border-accent rounded-2xl bg-app hover:bg-accent/10 transition-colors cursor-pointer group">
                <Upload className="w-6 h-6 text-fg-muted group-hover:text-accent mb-3 transition-colors" />
                <span className="text-sm font-semibold text-fg">Click to upload or drag and drop</span>
                <span className="text-xs text-fg-muted mt-1">JPEG, PNG, MP4 up to 10MB</span>
                <input type="file" accept="image/*,video/*" onChange={handleSimulateUpload} className="hidden" />
              </label>
            )}
          </section>

          <div className="pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-fg-muted">
              <ShieldCheck className="w-4 h-4 text-status-normal" />
              <span>Data is verified by VAYU AI network</span>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-accent text-fg font-bold text-sm transition-all hover:bg-accent/90 shadow-[0_0_15px_rgba(67,217,230,0.3)] hover:shadow-[0_0_20px_rgba(67,217,230,0.5)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Verifying & Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

