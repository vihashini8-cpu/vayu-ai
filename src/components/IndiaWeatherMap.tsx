import React, { useState, useMemo } from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import indiaGeoData from '../assets/geo/india-simplified.json';
import * as d3Geo from 'd3-geo';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  const [activePin, setActivePin] = useState<WeatherEvent | null>(events[0] || null);

  // Precise Cartographic Projection for Indian Subcontinent
  // Geodetic Bounds: Lat 6.0°N to 37.5°N, Lng 67.0°E to 98.0°E
  // SVG Canvas: 1000 x 1020 coordinate plane
  
  

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

  
  
  // Custom Icon factory
  const createCustomIcon = (color: string, category: WeatherCategory, event?: WeatherEvent) => {
    let labelHtml = '';
    if (event) {
      labelHtml = `
        <div style="position: absolute; left: 30px; top: -8px; background-color: rgba(11, 25, 41, 0.9); backdrop-filter: blur(4px); padding: 4px 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.15); white-space: nowrap; color: #F8FAFC; box-shadow: 0 4px 12px rgba(0,0,0,0.5); pointer-events: none;">
          <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.5px;">${event.location.city ? event.location.city + ', ' : ''}${event.location.state}</div>
          <div style="font-size: 9px; font-weight: 600; color: ${color}; text-transform: uppercase; margin-top: 2px;">${category.replace('_', ' ')} &bull; ${event.severity}</div>
        </div>
      `;
    }
    const iconHtml = `
      <div style="position: relative;">
        <div style="background-color: ${color}; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 0 10px ${color};">
          <div style="width: 12px; height: 12px; background-color: white; border-radius: 50%;"></div>
        </div>
        ${labelHtml}
      </div>
    `;
    return L.divIcon({
      html: iconHtml,
      className: 'custom-leaflet-icon',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  const getMarkerColor = (severity: EventSeverity, status: string) => {
    if (severity === 'severe') return '#E56B6F';
    if (severity === 'warning') return '#E9A23B';
    if (status === 'verified') return '#18B8A6';
    return '#43D9E6';
  };


  
  return (
    <div ref={containerRef} className={`flex flex-col gap-4 ${compact ? 'h-[520px]' : 'h-[720px] lg:h-[800px]'} ${isFullscreen ? 'bg-[#0f172a] p-4 !h-screen !w-screen !fixed inset-0 z-[9999]' : ''}`}>
      {/* Top Map Status & Layer Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface border border-line shadow-sm">
        {/* Left Status & Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
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
          <div className="flex items-center gap-1 p-1 bg-[#0B1929]/95 backdrop-blur-md rounded-xl border border-line shadow-lg">
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
                ? 'bg-primary/20 border-primary text-primary'
                : 'bg-surface-2 border-line text-fg-muted'
            }`}
            title="Toggle National Doppler Radar Network"
          >
            <Radio className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-xl border backdrop-blur-md transition-colors ${
              isFullscreen
                ? 'bg-primary/20 border-primary text-primary'
                : 'bg-surface-2 border-line text-fg-muted hover:text-fg'
            }`}
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

            <div className={`relative w-full flex-1 rounded-2xl overflow-hidden border transition-all ${
        theme === 'light'
          ? 'bg-app border-line shadow-inner'
          : 'bg-app border-line shadow-inner'
      }`}>
        <MapContainer
          center={[22.5, 80.0]}
          zoom={5}
          zoomControl={true}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
        >
          {theme === 'light' ? (
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
            />
          ) : (
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
            />
          )}

          {/* GeoJSON overlay for India */}
          <GeoJSON
            data={indiaGeoData as any}
            style={() => ({
              color: theme === 'light' ? '#0284C7' : '#22D3EE',
              weight: 1.5,
              fillColor: theme === 'light' ? '#E9E7FA' : '#101B35',
              fillOpacity: 0.3,
            })}
          />

          {/* DWR Stations (Radars) */}
          {showDwrStations && DOPPLER_RADAR_STATIONS.map((station, i) => (
            <Circle
              key={i}
              center={[station.lat, station.lng]}
              radius={station.rangeKm * 1000}
              pathOptions={{
                color: theme === 'light' ? '#0284C7' : '#22D3EE',
                fillColor: theme === 'light' ? '#0284C7' : '#22D3EE',
                fillOpacity: 0.1,
                weight: 1,
                dashArray: '4 4'
              }}
            />
          ))}

          {/* State Labels */}
          {(indiaGeoData as any).features.map((feature: any, i: number) => {
            const centroid = d3Geo.geoCentroid(feature);
            if (!centroid || isNaN(centroid[0])) return null;
            const [lng, lat] = centroid;
            const stateName = feature.properties.st_nm || feature.properties.NAME_1;
            if (!stateName) return null;
            
            return (
              <Marker 
                key={`state-${i}`} 
                position={[lat, lng]} 
                icon={L.divIcon({ 
                  className: 'state-label-icon', 
                  html: `<div style="color: ${theme === 'light' ? 'rgba(51, 65, 85, 0.8)' : 'rgba(148, 163, 184, 0.6)'}; font-size: 10px; font-weight: 700; text-shadow: 0 0 4px ${theme === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(7, 17, 31, 0.9)'}; text-align: center; width: 120px; transform: translateX(-50%); letter-spacing: 0.5px; pointer-events: none; text-transform: uppercase;">${stateName}</div>`,
                  iconSize: [0, 0]
                })} 
                interactive={false} 
              />
            );
          })}

          {/* Weather Events */}
          {filteredEvents.map((event, i) => (
            <Marker
              key={i}
              position={[event.location.lat, event.location.lng]}
              icon={createCustomIcon(getMarkerColor(event.severity, event.status), event.category, event)}
              eventHandlers={{
                click: () => {
                  handleMarkerClick(event);
                },
              }}
            >
              <Popup>
                <div className="p-1 min-w-[220px]">
                  <h3 className="font-bold text-sm mb-1 text-slate-800 leading-tight">{event.title}</h3>
                  <div className="text-xs font-semibold text-slate-700 mb-2">
                    📍 {event.location.city ? `${event.location.city}, ` : ''}{event.location.state}
                  </div>
                  <p className="text-xs text-slate-600 mb-3">{event.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-[10px] mb-2">
                     <div>
                       <div className="text-slate-400 font-semibold">COORDINATES</div>
                       <div className="font-mono text-slate-700">{event.location.lat.toFixed(2)}°N, {event.location.lng.toFixed(2)}°E</div>
                     </div>
                     <div>
                       <div className="text-slate-400 font-semibold">VERIFICATION</div>
                       <div className="text-teal-600 font-bold">{event.status.toUpperCase()}</div>
                     </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold border-t pt-2 border-slate-100">
                    <span className={`px-1.5 py-0.5 rounded-sm ${event.severity === 'severe' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                      {event.severity.toUpperCase()}
                    </span>
                    <span className="text-slate-400">{event.timestamp}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
