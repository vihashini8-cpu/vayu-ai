import React, { useState } from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import { WeatherCategory, EventSeverity } from '../types';
import {
  Droplets,
  CloudLightning,
  Sun,
  Wind,
  CloudFog,
  MapPin,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  X,
  FileCheck2,
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
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'rainfall',
      title: 'Heavy Rainfall',
      desc: 'Intense cloudburst or sustained rain',
      icon: <Droplets className="w-5 h-5 text-blue-400" />,
    },
    {
      id: 'flooding',
      title: 'Urban Waterlogging',
      desc: 'Submerged roads, underpasses, rivers',
      icon: <Droplets className="w-5 h-5 text-cyan-400" />,
    },
    {
      id: 'thunderstorm',
      title: 'Severe Thunderstorm',
      desc: 'Frequent cloud-to-ground lightning',
      icon: <CloudLightning className="w-5 h-5 text-purple-400" />,
    },
    {
      id: 'cyclone',
      title: 'High Gale / Cyclone',
      desc: 'Squally winds, fallen trees/poles',
      icon: <Wind className="w-5 h-5 text-teal-400" />,
    },
    {
      id: 'heatwave',
      title: 'Extreme Heatwave',
      desc: 'Dangerous scorching temperatures',
      icon: <Sun className="w-5 h-5 text-amber-400" />,
    },
    {
      id: 'dense_fog',
      title: 'Dense Fog / Smog',
      desc: 'Near-zero visibility on highways',
      icon: <CloudFog className="w-5 h-5 text-slate-400" />,
    },
  ];

  const indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Delhi NCR',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
  ];

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Please provide a short descriptive title';
    }
    if (!city.trim()) {
      newErrors.city = 'Please specify the city, town, or taluka';
    }
    if (!description.trim() || description.length < 15) {
      newErrors.description = 'Please write at least 15 characters describing what you observed';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const newId = submitCitizenReport({
      title,
      description,
      category,
      severity,
      location: {
        city,
        state,
        region: 'Field Submission Sector',
        lat: 19.0760,
        lng: 72.8777,
      },
      reporter: {
        name: reporterName || 'Community Weather Scout',
        isVerifiedUser: false,
        reportsCount: 1,
      },
    });

    setSubmittedId(newId);
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-mono font-semibold uppercase tracking-widest text-cyan-400">
          Citizen Ground Observer Network
        </span>
        <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
          Report a Weather Incident
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
          Your field observation directly assists municipal flood control rooms, state disaster coordinators, and local emergency response teams.
        </p>
      </div>

      {submittedId ? (
        /* Submission Success Confirmation Screen */
        <div className="p-8 rounded-2xl bg-[#0B1929] border border-teal-500/40 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center mx-auto shadow-lg shadow-teal-950/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              <Clock className="w-3.5 h-3.5" />
              Pending Desk Corroboration
            </span>
            <h3 className="text-xl font-bold text-white">
              Incident Report Registered
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Thank you for contributing to India&apos;s weather intelligence grid. Our AI engine is currently cross-referencing your report with nearest Doppler radar cells and automated weather stations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#102238] border border-slate-800 max-w-sm mx-auto text-left space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Incident Reference ID:</span>
              <span className="font-mono font-bold text-cyan-300">{submittedId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Target Region:</span>
              <span className="text-white font-medium">{city}, {state}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Preliminary Status:</span>
              <span className="text-teal-400 font-semibold">Ingested · In Queue</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={() => setActiveView('verification')}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md"
            >
              <span>Open in Verification Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveView('events')}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md"
            >
              <span>Track in Events Feed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-[#102238] hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      ) : (
        /* Form Card */
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-[#0B1929] border border-slate-800 shadow-2xl space-y-6">
          {/* Step 1: Category Selection Cards */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              1. Select Incident Category *
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categoryOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setCategory(opt.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between group ${
                    category === opt.id
                      ? 'bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-950/40'
                      : 'bg-[#102238]/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="mb-2 p-2 rounded-lg bg-slate-900/60 w-fit">
                    {opt.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 leading-snug">
                      {opt.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      {opt.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Location Information */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              2. Observation Location *
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">State / Union Territory</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-[#102238] border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {indianStates.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">City / Taluka / Landmark</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Kurla West, Santacruz, Puri Beach..."
                  className={`w-full bg-[#102238] border rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 ${
                    errors.city ? 'border-rose-500' : 'border-slate-700/80'
                  }`}
                />
                {errors.city && <p className="text-[11px] text-rose-400 mt-1">{errors.city}</p>}
              </div>
            </div>
          </div>

          {/* Step 3: Incident Details */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              3. Incident Summary & Severity
            </label>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Headline / Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Flash flooding underpass submerged up to 3 feet"
                className={`w-full bg-[#102238] border rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 ${
                  errors.title ? 'border-rose-500' : 'border-slate-700/80'
                }`}
              />
              {errors.title && <p className="text-[11px] text-rose-400 mt-1">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Estimated Severity Tier</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as EventSeverity)}
                  className="w-full bg-[#102238] border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="severe">Severe (Immediate Danger / Structural Threat)</option>
                  <option value="warning">Warning (Significant Disruption / Roadblocks)</option>
                  <option value="advisory">Advisory (Mild Weather Impact / Be Aware)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Observer Name / Handle (Optional)</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar (or leave blank for anonymous)"
                  className="w-full bg-[#102238] border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Detailed Situation Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe current weather conditions, water levels, wind intensity, blocked arterial routes, or power outages..."
                className={`w-full bg-[#102238] border rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed ${
                  errors.description ? 'border-rose-500' : 'border-slate-700/80'
                }`}
              />
              {errors.description && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Step 4: Visual Verification Media Upload (Simulated) */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              4. Photo / Video Verification (Optional)
            </label>

            {selectedFile ? (
              <div className="p-3.5 rounded-xl bg-[#102238] border border-teal-500/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="font-mono">{selectedFile}</span>
                  <span className="text-slate-500 text-[10px]">(Geotag Metadata Verified)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-2xl bg-[#102238]/40 hover:bg-[#102238] transition-all cursor-pointer">
                <Upload className="w-6 h-6 text-cyan-400 mb-2" />
                <span className="text-xs font-semibold text-slate-200">
                  Drop ground incident photo or click to browse
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  JPEG, PNG, MP4 up to 25MB · EXIF geolocation preserved
                </span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleSimulateUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Signed via VAYU AI Public Gateway</span>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-950/60"
            >
              Submit Weather Incident
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
