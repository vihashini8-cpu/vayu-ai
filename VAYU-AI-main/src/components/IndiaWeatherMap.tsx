import React, { useState, useMemo } from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import { WeatherEvent, EventSeverity, WeatherCategory } from '../types';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  MapPin,
  Wind,
  Droplets,
  CloudLightning,
  Sun,
  CloudFog,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Compass,
  Activity,
  Maximize2,
} from 'lucide-react';

interface IndiaWeatherMapProps {
  compact?: boolean;
  onSelectEvent?: (event: WeatherEvent) => void;
}

// Major IMD Doppler Weather Radar (DWR) Stations across India
const DOPPLER_RADAR_STATIONS = [
  { id: 'DWR-DEL', name: 'New Delhi Mausam Bhawan', lat: 28.61, lng: 77.21, rangeKm: 250 },
  { id: 'DWR-MUM', name: 'Mumbai Colaba Radar', lat: 18.90, lng: 72.81, rangeKm: 250 },
  { id: 'DWR-CHN', name: 'Chennai Port Radar', lat: 13.08, lng: 80.29, rangeKm: 250 },
  { id: 'DWR-KOL', name: 'Kolkata Alipore Radar', lat: 22.53, lng: 88.33, rangeKm: 250 },
  { id: 'DWR-PRD', name: 'Paradip Coastal DWR', lat: 20.31, lng: 86.61, rangeKm: 250 },
  { id: 'DWR-NAG', name: 'Nagpur Central Radar', lat: 21.14, lng: 79.05, rangeKm: 250 },
  { id: 'DWR-GHY', name: 'Guwahati Northeast DWR', lat: 26.11, lng: 91.58, rangeKm: 250 },
  { id: 'DWR-COK', name: 'Kochi Naval DWR', lat: 9.94, lng: 76.26, rangeKm: 250 },
  { id: 'DWR-BHJ', name: 'Bhuj Kutch DWR', lat: 23.25, lng: 69.67, rangeKm: 250 },
  { id: 'DWR-SXR', name: 'Srinagar Himalayan DWR', lat: 34.08, lng: 74.80, rangeKm: 250 },
];

export const IndiaWeatherMap: React.FC<IndiaWeatherMapProps> = ({
  compact = false,
  onSelectEvent,
}) => {
  const { events, setSelectedEvent, theme } = useWeatherApp();

  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [selectedLayer, setSelectedLayer] = useState<'radar' | 'wind' | 'thermal' | 'isobars'>('radar');
  const [statusFilter, setStatusFilter] = useState<'all' | 'severe' | 'verified' | 'pending'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [showDwrStations, setShowDwrStations] = useState<boolean>(true);
  const [activePin, setActivePin] = useState<WeatherEvent | null>(events[0] || null);

  // Precise Cartographic Projection for Indian Subcontinent
  // Geodetic Bounds: Lat 6.0°N to 37.5°N, Lng 67.0°E to 98.0°E
  // SVG Canvas: 1000 x 1020 coordinate plane
  const projectGeoToSvg = (lat: number, lng: number) => {
    const minLng = 67.0;
    const maxLng = 98.0;
    const minLat = 6.0;
    const maxLat = 37.5;

    const x = 50 + ((lng - minLng) / (maxLng - minLng)) * 890;
    const y = 35 + ((maxLat - lat) / (maxLat - minLat)) * 925;

    return { x, y };
  };

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (statusFilter === 'severe' && e.severity !== 'severe') return false;
      if (statusFilter === 'verified' && e.status !== 'verified') return false;
      if (statusFilter === 'pending' && e.status !== 'pending') return false;
      if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
      return true;
    });
  }, [events, statusFilter, categoryFilter]);

  const handleMarkerClick = (event: WeatherEvent) => {
    setActivePin(event);
    if (onSelectEvent) {
      onSelectEvent(event);
    } else {
      setSelectedEvent(event);
    }
  };

  const getMarkerColor = (severity: EventSeverity, status: string) => {
    if (severity === 'severe') return '#F43F5E'; // Red / Coral
    if (severity === 'warning') return '#F59E0B'; // Amber
    if (status === 'verified') return '#2DD4BF'; // Teal
    return '#3B82F6'; // Electric Blue
  };

  const getCategoryIcon = (category: WeatherCategory) => {
    switch (category) {
      case 'cyclone':
      case 'strong_winds':
        return <Wind className="w-3.5 h-3.5" />;
      case 'flooding':
      case 'rainfall':
        return <Droplets className="w-3.5 h-3.5" />;
      case 'thunderstorm':
        return <CloudLightning className="w-3.5 h-3.5" />;
      case 'heatwave':
        return <Sun className="w-3.5 h-3.5" />;
      case 'dense_fog':
      case 'dust_storm':
        return <CloudFog className="w-3.5 h-3.5" />;
      default:
        return <MapPin className="w-3.5 h-3.5" />;
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (direction === 'in' && zoomLevel < 2.5) {
      setZoomLevel((prev) => Math.min(2.5, +(prev + 0.3).toFixed(1)));
    } else if (direction === 'out' && zoomLevel > 0.8) {
      setZoomLevel((prev) => Math.max(0.8, +(prev - 0.3).toFixed(1)));
    }
  };

  const handleReset = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setStatusFilter('all');
    setCategoryFilter('all');
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border transition-all ${
        theme === 'light'
          ? 'bg-[#F8FAFC] border-slate-200 shadow-xl'
          : 'bg-[#07111F] border-slate-800 shadow-2xl'
      } flex flex-col ${compact ? 'h-[520px]' : 'h-[720px] lg:h-[800px]'}`}
    >
      {/* Top Map Status & Layer Switcher Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left Status & Filters */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 bg-[#0B1929]/95 backdrop-blur-md rounded-xl border border-slate-700/80 shadow-lg">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Incidents ({events.length})
          </button>
          <button
            onClick={() => setStatusFilter('severe')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === 'severe'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Severe Threat ({events.filter((e) => e.severity === 'severe').length})
          </button>
          <button
            onClick={() => setStatusFilter('verified')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              statusFilter === 'verified'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Verified ({events.filter((e) => e.status === 'verified').length})
          </button>
        </div>

        {/* Right Meteorological Layer Mode Toggles */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Layer Selector */}
          <div className="flex items-center gap-1 p-1 bg-[#0B1929]/95 backdrop-blur-md rounded-xl border border-slate-700/80 shadow-lg">
            <button
              onClick={() => setSelectedLayer('radar')}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                selectedLayer === 'radar'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Doppler Weather Radar Reflectivity"
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Doppler Radar</span>
            </button>

            <button
              onClick={() => setSelectedLayer('wind')}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                selectedLayer === 'wind'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Surface Wind Streamlines & Monsoon Flow"
            >
              <Wind className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Wind Streamlines</span>
            </button>

            <button
              onClick={() => setSelectedLayer('thermal')}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                selectedLayer === 'thermal'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="INSAT-3DR Geostationary Thermal Infrared"
            >
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">INSAT Thermal</span>
            </button>

            <button
              onClick={() => setSelectedLayer('isobars')}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                selectedLayer === 'isobars'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Synoptic Atmospheric Pressure Isobars"
            >
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Isobars</span>
            </button>
          </div>

          {/* DWR Toggle */}
          <button
            onClick={() => setShowDwrStations(!showDwrStations)}
            className={`p-2 rounded-xl border backdrop-blur-md transition-colors ${
              showDwrStations
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                : 'bg-[#0B1929]/90 border-slate-700 text-slate-400'
            }`}
            title="Toggle National Doppler Radar Network"
          >
            <Radio className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Zoom & Compass Controls */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={() => handleZoom('in')}
          className="p-2.5 rounded-xl bg-[#0B1929]/90 hover:bg-[#102238] border border-slate-700/80 text-white shadow-xl hover:scale-105 transition-all"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4 text-cyan-400" />
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="p-2.5 rounded-xl bg-[#0B1929]/90 hover:bg-[#102238] border border-slate-700/80 text-white shadow-xl hover:scale-105 transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4 text-cyan-400" />
        </button>
        <button
          onClick={handleReset}
          className="p-2.5 rounded-xl bg-[#0B1929]/90 hover:bg-[#102238] border border-slate-700/80 text-white shadow-xl hover:scale-105 transition-all"
          title="Reset Map View"
        >
          <RotateCcw className="w-4 h-4 text-teal-400" />
        </button>
      </div>

      {/* Bottom Left Legend & Coordinate Badge */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-none hidden sm:flex flex-col gap-2">
        <div className="p-3 bg-[#0B1929]/90 backdrop-blur-md rounded-xl border border-slate-700/80 shadow-xl pointer-events-auto text-[11px] space-y-2 max-w-xs">
          <div className="flex items-center justify-between font-mono text-[10px] text-cyan-400 border-b border-slate-800 pb-1">
            <span className="font-bold">INDIA SYNOPTIC GRID</span>
            <span>WGS-84 / 28 Doppler Cells</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-slate-300">Severe Cyclone / Flood</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-slate-300">Warning Alert</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
              <span className="text-slate-300">Verified Advisory</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-slate-300">Pending Review</span>
            </div>
          </div>

          {selectedLayer === 'radar' && (
            <div className="pt-1.5 border-t border-slate-800">
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                <span>Precipitation Reflectivity (dBZ)</span>
                <span className="font-mono text-cyan-300">20 → 65+</span>
              </div>
              <div className="h-2 rounded-full w-full bg-gradient-to-r from-blue-500 via-cyan-400 via-teal-300 via-amber-400 to-rose-600 shadow-inner" />
            </div>
          )}
        </div>
      </div>

      {/* Hovered State Tooltip Overlay */}
      {hoveredState && (
        <div className="absolute top-16 left-6 z-20 pointer-events-none p-2.5 rounded-xl bg-[#0B1929]/95 border border-cyan-400/60 shadow-2xl backdrop-blur-md text-xs animate-in fade-in zoom-in-95 duration-100">
          <div className="font-bold text-white flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>{hoveredState}</span>
          </div>
          <div className="text-[10px] text-cyan-300 font-mono mt-0.5">
            Real-time Doppler radar surveillance active
          </div>
        </div>
      )}

      {/* Main Interactive SVG India Map */}
      <div className="w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none">
        <svg
          viewBox="0 0 1000 1020"
          className="w-full h-full object-contain transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          }}
        >
          <defs>
            {/* Ocean Depth Gradient */}
            <radialGradient id="oceanGrad" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor={theme === 'light' ? '#E0F2FE' : '#040d18'} />
              <stop offset="50%" stopColor={theme === 'light' ? '#BAE6FD' : '#061324'} />
              <stop offset="100%" stopColor={theme === 'light' ? '#F0F9FF' : '#07111F'} />
            </radialGradient>

            {/* Land Subcontinent Gradient */}
            <linearGradient id="indiaLandGrad" x1="200" y1="50" x2="600" y2="900" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={theme === 'light' ? '#E2E8F0' : '#0D1F35'} />
              <stop offset="40%" stopColor={theme === 'light' ? '#CBD5E1' : '#0B1B30'} />
              <stop offset="80%" stopColor={theme === 'light' ? '#E2E8F0' : '#0E223D'} />
              <stop offset="100%" stopColor={theme === 'light' ? '#F1F5F9' : '#091628'} />
            </linearGradient>

            {/* Cyclone "Veer" Spiral Rainband Gradient */}
            <radialGradient id="cycloneVeerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="15%" stopColor="#F43F5E" stopOpacity="0.8" />
              <stop offset="45%" stopColor="#FB7185" stopOpacity="0.5" />
              <stop offset="75%" stopColor="#38BDF8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
            </radialGradient>

            {/* Convective Monsoon Rain Band Gradient */}
            <radialGradient id="monsoonBandGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0284C7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0B1929" stopOpacity="0" />
            </radialGradient>

            {/* Doppler Sweeping Beam Gradient */}
            <radialGradient id="dwrSweepGrad" cx="0%" cy="0%" r="100%">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#0284C7" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#07111F" stopOpacity="0" />
            </radialGradient>

            {/* Cartographic Coordinate Grid */}
            <pattern id="cartoGrid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke={theme === 'light' ? '#E2E8F0' : '#0E1F33'}
                strokeWidth="0.8"
              />
            </pattern>

            {/* Drop Shadow Filter */}
            <filter id="indiaShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Oceanic Basins Background */}
          <rect width="1000" height="1020" fill="url(#oceanGrad)" />
          <rect width="1000" height="1020" fill="url(#cartoGrid)" opacity="0.8" />

          {/* Geographic Sea Labels */}
          <g fontFamily="sans-serif" fontWeight="700" letterSpacing="6" opacity="0.45">
            <text
              x="130"
              y="680"
              fill={theme === 'light' ? '#0369A1' : '#38BDF8'}
              fontSize="14"
            >
              ARABIAN SEA
            </text>
            <text
              x="690"
              y="680"
              fill={theme === 'light' ? '#0369A1' : '#38BDF8'}
              fontSize="14"
            >
              BAY OF BENGAL
            </text>
            <text
              x="360"
              y="980"
              fill={theme === 'light' ? '#0369A1' : '#38BDF8'}
              fontSize="13"
              letterSpacing="8"
            >
              INDIAN OCEAN
            </text>

            <text
              x="450"
              y="170"
              fill={theme === 'light' ? '#64748B' : '#475569'}
              fontSize="11"
              letterSpacing="4"
            >
              HIMALAYAN ARC
            </text>
          </g>

          {/* Radar Circles centered over Central India (Nagpur 0-Mile Datum) */}
          <g stroke={theme === 'light' ? '#CBD5E1' : '#14273E'} strokeWidth="1" fill="none" opacity="0.6">
            <circle cx="450" cy="520" r="160" strokeDasharray="4 4" />
            <circle cx="450" cy="520" r="300" strokeDasharray="4 4" />
            <circle cx="450" cy="520" r="440" strokeDasharray="4 4" />
          </g>

          {/* Neighboring Country Outlines (Faint Cartographic Context) */}
          {/* Sri Lanka */}
          <path
            d="
              M 428 895
              C 445 885, 465 905, 462 935
              C 458 962, 442 978, 430 968
              C 418 955, 415 920, 428 895
              Z
            "
            fill={theme === 'light' ? '#E2E8F0' : '#0B1A2C'}
            stroke={theme === 'light' ? '#94A3B8' : '#1e3a5f'}
            strokeWidth="1.2"
            opacity="0.7"
          />
          <text
            x="430"
            y="935"
            fill={theme === 'light' ? '#64748B' : '#475569'}
            fontSize="9"
            fontWeight="600"
            letterSpacing="1"
            opacity="0.8"
          >
            SRI LANKA
          </text>

          {/* Nepal Contour */}
          <path
            d="M 440 270 L 675 330 L 670 365 L 438 298 Z"
            fill="none"
            stroke={theme === 'light' ? '#CBD5E1' : '#162b44'}
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <text x="530" y="315" fill={theme === 'light' ? '#94A3B8' : '#334155'} fontSize="9" fontWeight="600" letterSpacing="2">
            NEPAL
          </text>

          {/* Bhutan Contour */}
          <path
            d="M 718 318 L 770 300 L 765 325 L 720 335 Z"
            fill="none"
            stroke={theme === 'light' ? '#CBD5E1' : '#162b44'}
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <text x="730" y="315" fill={theme === 'light' ? '#94A3B8' : '#334155'} fontSize="8" fontWeight="600">
            BHUTAN
          </text>

          {/* REALISTIC HIGH-FIDELITY MAINLAND INDIA BOUNDARY */}
          <path
            id="india-mainland"
            d="
              M 350 48
              C 365 46, 385 55, 405 68
              C 425 80, 442 95, 452 115
              C 458 135, 450 160, 438 185
              C 430 200, 436 215, 448 232
              C 455 245, 452 260, 440 270
              C 432 278, 438 290, 448 298
              C 480 306, 530 318, 580 326
              C 620 330, 650 332, 672 334
              C 678 335, 682 328, 685 315
              C 688 298, 690 275, 700 270
              C 708 274, 715 295, 718 318
              C 730 324, 755 320, 770 300
              C 785 285, 810 265, 840 248
              C 865 238, 890 234, 908 245
              C 915 260, 900 290, 890 320
              C 882 345, 875 375, 868 410
              C 860 435, 850 468, 840 488
              C 830 495, 822 478, 818 455
              C 810 435, 795 430, 785 410
              C 778 395, 782 380, 792 375
              C 775 372, 745 370, 725 372
              C 712 375, 705 385, 702 400
              C 692 418, 686 442, 690 465
              C 695 478, 705 488, 688 495
              C 670 492, 655 496, 642 510
              C 630 522, 618 538, 608 552
              C 598 565, 582 580, 568 598
              C 552 615, 528 642, 498 668
              C 475 692, 458 720, 444 748
              C 436 765, 428 792, 422 818
              C 418 838, 425 858, 412 868
              C 395 870, 385 885, 375 898
              C 365 910, 355 922, 348 918
              C 342 910, 335 895, 328 878
              C 318 855, 308 828, 298 798
              C 288 770, 278 742, 268 715
              C 258 692, 248 668, 240 645
              C 234 625, 226 602, 220 578
              C 215 565, 205 550, 195 552
              C 180 568, 150 582, 130 575
              C 112 560, 102 535, 115 515
              C 128 505, 152 498, 168 495
              C 152 485, 128 480, 105 475
              C 88 470, 72 458, 85 442
              C 105 435, 130 432, 155 425
              C 168 402, 178 368, 195 338
              C 212 312, 235 288, 255 265
              C 268 248, 278 228, 282 205
              C 280 185, 275 160, 280 135
              C 288 112, 302 92, 320 75
              C 332 62, 342 52, 350 48
              Z
            "
            fill="url(#indiaLandGrad)"
            stroke={theme === 'light' ? '#0284C7' : '#22D3EE'}
            strokeWidth="2.2"
            filter="url(#indiaShadow)"
            className="transition-colors duration-300"
          />

          {/* ISLAND ARCHIPELAGOS */}
          {/* Andaman & Nicobar Islands */}
          <g
            fill={theme === 'light' ? '#CBD5E1' : '#0F2642'}
            stroke={theme === 'light' ? '#0284C7' : '#22D3EE'}
            strokeWidth="1.6"
          >
            {/* North & Middle Andaman */}
            <path d="M 788 745 C 792 740, 796 750, 795 765 C 794 775, 788 775, 788 745 Z" />
            {/* South Andaman (Port Blair) */}
            <path d="M 790 782 C 794 778, 798 788, 796 805 C 793 812, 789 808, 790 782 Z" />
            {/* Little Andaman */}
            <path d="M 793 825 C 798 822, 802 830, 800 838 C 796 842, 792 838, 793 825 Z" />
            {/* Car Nicobar */}
            <path d="M 798 858 C 803 856, 806 864, 802 870 C 798 872, 795 866, 798 858 Z" />
            {/* Great Nicobar */}
            <path d="M 805 895 C 812 890, 818 905, 815 922 C 810 930, 804 924, 805 895 Z" />
          </g>
          <text
            x="818"
            y="785"
            fill={theme === 'light' ? '#0369A1' : '#38BDF8'}
            fontSize="9"
            fontWeight="700"
            letterSpacing="1"
          >
            ANDAMAN & NICOBAR
          </text>

          {/* Lakshadweep Islands */}
          <g
            fill={theme === 'light' ? '#CBD5E1' : '#0F2642'}
            stroke={theme === 'light' ? '#0284C7' : '#22D3EE'}
            strokeWidth="1.6"
          >
            <path d="M 210 818 C 214 815, 216 822, 214 828 C 210 830, 208 824, 210 818 Z" />
            <path d="M 198 836 C 202 833, 204 840, 201 846 C 197 848, 195 842, 198 836 Z" />
            <path d="M 225 885 C 229 882, 232 890, 228 896 C 224 898, 222 892, 225 885 Z" />
          </g>
          <text
            x="135"
            y="835"
            fill={theme === 'light' ? '#0369A1' : '#38BDF8'}
            fontSize="9"
            fontWeight="700"
            letterSpacing="1"
          >
            LAKSHADWEEP
          </text>

          {/* INTERNAL STATE & REGIONAL BOUNDARIES */}
          <g
            stroke={theme === 'light' ? '#94A3B8' : '#1C3757'}
            strokeWidth="1.1"
            strokeDasharray="4 3"
            fill="none"
            opacity="0.8"
          >
            {/* Ladakh / Kashmir Divide */}
            <path
              d="M 350 48 C 360 100, 340 140, 365 185"
              onMouseEnter={() => setHoveredState('Ladakh & Jammu-Kashmir')}
              onMouseLeave={() => setHoveredState(null)}
              className="hover:stroke-cyan-400 hover:stroke-[2] transition-colors"
            />
            {/* Punjab & Haryana / Rajasthan border */}
            <path
              d="M 255 265 C 290 280, 340 270, 370 285"
              onMouseEnter={() => setHoveredState('Northern Plains (Punjab/Haryana)')}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Rajasthan / Gujarat border */}
            <path
              d="M 155 425 C 220 440, 260 410, 300 420"
              onMouseEnter={() => setHoveredState('Thar / Aravalli (Rajasthan)')}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Gujarat / Maharashtra border */}
            <path
              d="M 195 552 C 240 540, 280 545, 330 550"
              onMouseEnter={() => setHoveredState('Gujarat Peninsula')}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Maharashtra / Western Ghats / Karnataka border */}
            <path
              d="M 240 645 C 310 635, 380 620, 440 630"
              onMouseEnter={() => setHoveredState('Maharashtra & Konkan Ghats')}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Karnataka / Kerala / Tamil Nadu divide */}
            <path
              d="M 268 715 C 330 730, 370 760, 436 765"
              onMouseEnter={() => setHoveredState('Southern Peninsula (Karnataka/TN/Kerala)')}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Odisha / Andhra Coastal divide */}
            <path
              d="M 568 598 C 500 580, 450 560, 420 540"
              onMouseEnter={() => setHoveredState('Eastern Ghats / Odisha')}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Central Gangetic / MP divide */}
            <path
              d="M 330 550 C 430 480, 520 460, 608 552"
              onMouseEnter={() => setHoveredState('Central India (Madhya Pradesh/Vidarbha)')}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Gangetic Plains (UP / Bihar) */}
            <path
              d="M 370 285 C 450 350, 540 370, 642 510"
              onMouseEnter={() => setHoveredState('Gangetic Basin (UP/Bihar)')}
              onMouseLeave={() => setHoveredState(null)}
            />
            {/* Assam / Northeast Seven Sisters arc */}
            <path
              d="M 685 315 C 730 380, 780 370, 840 488"
              onMouseEnter={() => setHoveredState('Northeast States (Assam/Meghalaya/Arunachal)')}
              onMouseLeave={() => setHoveredState(null)}
            />
          </g>

          {/* MAJOR RIVER BASINS (Subtle Hydrographic Network) */}
          <g
            stroke={theme === 'light' ? '#38BDF8' : '#0284C7'}
            strokeWidth="1.2"
            fill="none"
            opacity="0.5"
            strokeLinecap="round"
          >
            {/* Ganga River */}
            <path d="M 445 250 Q 480 320, 540 360 T 630 420 T 688 495" />
            {/* Yamuna River */}
            <path d="M 425 240 Q 360 290, 430 370 T 540 360" />
            {/* Brahmaputra River */}
            <path d="M 870 240 Q 820 280, 780 310 T 710 380" />
            {/* Narmada River */}
            <path d="M 490 530 Q 380 520, 220 560" />
            {/* Godavari River */}
            <path d="M 280 610 Q 390 590, 510 655" />
            {/* Krishna River */}
            <path d="M 290 690 Q 380 660, 480 705" />
          </g>

          {/* METEOROLOGICAL OVERLAY 1: DOPPLER RADAR REFLECTIVITY */}
          {selectedLayer === 'radar' && (
            <g className="transition-opacity duration-300">
              {/* Cyclone "Veer" Storm Spiral in Bay of Bengal (centered off Odisha/Puri Coast) */}
              <g transform="translate(610, 570)">
                <circle cx="0" cy="0" r="130" fill="url(#cycloneVeerGlow)" />
                {/* Spiral Rain Bands */}
                <path
                  d="M 0 0 C 40 -20, 80 10, 100 60 C 110 85, 90 120, 50 125 C 10 130, -40 100, -70 50 C -90 10, -80 -40, -40 -70 C 0 -90, 50 -80, 80 -40"
                  fill="none"
                  stroke="#F43F5E"
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.85"
                  className="animate-spin"
                  style={{ animationDuration: '18s' }}
                />
                <path
                  d="M 0 0 C -20 30, -60 30, -90 0 C -110 -30, -90 -80, -40 -100 C 10 -110, 70 -90, 100 -40"
                  fill="none"
                  stroke="#FB7185"
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.75"
                />
                {/* Cyclone Eye */}
                <circle cx="0" cy="0" r="8" fill="#FFFFFF" />
                <circle cx="0" cy="0" r="14" fill="none" stroke="#F43F5E" strokeWidth="2.5" className="animate-ping" />
              </g>

              {/* Severe Monsoon Downpour over Mumbai & Western Ghats */}
              <g transform="translate(230, 595)">
                <ellipse cx="0" cy="0" rx="65" ry="45" fill="url(#monsoonBandGlow)" />
                <ellipse cx="5" cy="-5" rx="35" ry="25" fill="#38BDF8" opacity="0.6" className="animate-pulse" />
                <circle cx="0" cy="0" r="16" fill="#F43F5E" opacity="0.75" />
              </g>

              {/* Convective Thunderstorm Cell over Assam (Guwahati) */}
              <g transform="translate(760, 365)">
                <ellipse cx="0" cy="0" rx="55" ry="30" fill="#8B5CF6" opacity="0.45" />
                <ellipse cx="-5" cy="0" rx="30" ry="18" fill="#C084FC" opacity="0.6" className="animate-pulse" />
              </g>

              {/* Pre-Monsoon Showers over Southern Peninsula (Chennai / Bangalore) */}
              <g transform="translate(420, 760)">
                <ellipse cx="0" cy="0" rx="45" ry="30" fill="#0284C7" opacity="0.35" />
              </g>
            </g>
          )}

          {/* METEOROLOGICAL OVERLAY 2: SURFACE WIND STREAMLINES */}
          {selectedLayer === 'wind' && (
            <g
              stroke="#2DD4BF"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray="10 8"
              fill="none"
              opacity="0.75"
              className="transition-opacity duration-300"
            >
              {/* Southwest Monsoon Flow from Arabian Sea hitting Konkan & Kerala */}
              <path d="M 120 780 C 180 740, 240 700, 270 650" className="animate-pulse" />
              <path d="M 100 840 C 160 800, 230 760, 310 740" />
              <path d="M 130 900 C 190 880, 260 840, 335 830" />

              {/* Recurving Monsoonal Winds into Bay of Bengal Cyclone */}
              <path d="M 380 820 C 450 780, 520 720, 560 660" />
              <path d="M 480 880 C 560 830, 640 760, 670 670" className="animate-pulse" />
              <path d="M 720 780 C 690 700, 660 630, 620 590" />
              <path d="M 780 620 C 720 580, 680 560, 630 570" />

              {/* Westerly Jetstream over Northern Plains */}
              <path d="M 240 280 C 340 310, 450 330, 580 340" />
              <path d="M 280 230 C 370 250, 480 270, 590 290" />
            </g>
          )}

          {/* METEOROLOGICAL OVERLAY 3: INSAT-3DR THERMAL INFRARED */}
          {selectedLayer === 'thermal' && (
            <g opacity="0.55" className="transition-opacity duration-300">
              {/* Deep Convective Cloud Tops (-65°C to -80°C Brightness Temp) */}
              <circle cx="610" cy="570" r="140" fill="#9333EA" opacity="0.4" />
              <circle cx="610" cy="570" r="85" fill="#C084FC" opacity="0.6" />
              <circle cx="610" cy="570" r="40" fill="#F43F5E" opacity="0.8" />

              <ellipse cx="230" cy="595" rx="75" ry="50" fill="#3B82F6" opacity="0.5" />
              <ellipse cx="760" cy="365" rx="65" ry="35" fill="#8B5CF6" opacity="0.5" />
            </g>
          )}

          {/* METEOROLOGICAL OVERLAY 4: SYNOPTIC ISOBARS */}
          {selectedLayer === 'isobars' && (
            <g
              stroke="#60A5FA"
              strokeWidth="1.2"
              fill="none"
              opacity="0.7"
              className="transition-opacity duration-300"
            >
              <ellipse cx="610" cy="570" rx="160" ry="120" strokeDasharray="6 4" />
              <text x="730" y="500" fill="#60A5FA" fontSize="10" fontFamily="monospace">1004 hPa</text>

              <ellipse cx="610" cy="570" rx="100" ry="80" />
              <text x="680" y="530" fill="#60A5FA" fontSize="10" fontFamily="monospace">996 hPa</text>

              <ellipse cx="610" cy="570" rx="50" ry="40" stroke="#F43F5E" strokeWidth="2" />
              <text x="610" y="565" fill="#F43F5E" fontSize="10" fontWeight="bold" fontFamily="monospace">984 hPa (LOW)</text>

              <path d="M 120 620 Q 320 640, 520 700" strokeDasharray="6 4" />
              <text x="280" y="630" fill="#60A5FA" fontSize="10" fontFamily="monospace">1008 hPa</text>
            </g>
          )}

          {/* IMD DOPPLER WEATHER RADAR NETWORK STATIONS */}
          {showDwrStations && (
            <g className="transition-opacity duration-300">
              {DOPPLER_RADAR_STATIONS.map((st) => {
                const pt = projectGeoToSvg(st.lat, st.lng);
                return (
                  <g key={st.id} transform={`translate(${pt.x}, ${pt.y})`}>
                    {/* Radar Surveillance Range Ring */}
                    <circle
                      cx="0"
                      cy="0"
                      r="50"
                      fill="url(#dwrSweepGrad)"
                      stroke="#22D3EE"
                      strokeWidth="0.8"
                      strokeDasharray="2 3"
                      opacity="0.4"
                    />
                    {/* Rotating Radar Sweep Line */}
                    <line
                      x1="0"
                      y1="0"
                      x2="48"
                      y2="0"
                      stroke="#22D3EE"
                      strokeWidth="1.2"
                      opacity="0.8"
                      className="animate-radar origin-center"
                    />
                    {/* Radar Mast Icon */}
                    <circle cx="0" cy="0" r="3.5" fill="#22D3EE" stroke="#FFFFFF" strokeWidth="1" />
                    <text
                      x="7"
                      y="3"
                      fill={theme === 'light' ? '#0F172A' : '#F1F5F9'}
                      fontSize="9"
                      fontWeight="700"
                      fontFamily="monospace"
                      opacity="0.85"
                    >
                      {st.id}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* INTERACTIVE WEATHER INCIDENT MARKERS */}
          <g>
            {filteredEvents.map((evt) => {
              const pt = projectGeoToSvg(evt.location.lat, evt.location.lng);
              const isSelected = activePin?.id === evt.id;
              const markerColor = getMarkerColor(evt.severity, evt.status);

              return (
                <g
                  key={evt.id}
                  transform={`translate(${pt.x}, ${pt.y})`}
                  onClick={() => handleMarkerClick(evt)}
                  className="cursor-pointer group"
                >
                  {/* Ping Animation for High Severity */}
                  {evt.severity === 'severe' && (
                    <circle
                      cx="0"
                      cy="0"
                      r="22"
                      fill={markerColor}
                      opacity="0.4"
                      className="animate-ping"
                      style={{ animationDuration: '2.2s' }}
                    />
                  )}

                  {/* Outer Outer Highlight Ring */}
                  <circle
                    cx="0"
                    cy="0"
                    r={isSelected ? 18 : 14}
                    fill={theme === 'light' ? '#FFFFFF' : '#0B1929'}
                    stroke={markerColor}
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all duration-200 group-hover:scale-125"
                  />

                  {/* Central Severity Dot */}
                  <circle cx="0" cy="0" r={isSelected ? 8 : 6} fill={markerColor} />

                  {/* Incident City Label Callout */}
                  <g
                    transform="translate(16, -6)"
                    className={`transition-opacity duration-150 ${
                      isSelected ? 'opacity-100' : 'opacity-85 group-hover:opacity-100'
                    }`}
                  >
                    <rect
                      x="0"
                      y="-12"
                      width={evt.location.city.length * 7.5 + 24}
                      height="20"
                      rx="6"
                      fill={theme === 'light' ? '#FFFFFF' : '#0B1929'}
                      stroke={markerColor}
                      strokeWidth="1"
                      className="shadow-lg"
                    />
                    <text
                      x="8"
                      y="2"
                      fill={theme === 'light' ? '#0F172A' : '#FFFFFF'}
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {evt.location.city}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Compact Mode Footer Badge */}
      {compact && (
        <div className="absolute bottom-3 right-3 z-10">
          <button
            onClick={() => setSelectedEvent(events[0])}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1929]/90 hover:bg-[#102238] border border-cyan-500/40 text-xs font-semibold text-cyan-300 shadow-lg backdrop-blur-md transition-all hover:scale-105"
          >
            <span>Open Interactive Command View</span>
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
