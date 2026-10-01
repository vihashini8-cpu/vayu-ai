const fs = require('fs');
const code = fs.readFileSync('src/components/IndiaWeatherMap.tsx', 'utf8');

const toolbarEndIndex = code.indexOf('<div className={`relative w-full flex-1 rounded-2xl overflow-hidden border transition-all');
if (toolbarEndIndex === -1) throw new Error('Could not find toolbar end');

const topPart = code.substring(0, toolbarEndIndex);

// We need to add the leaflet imports at the top
let newTopPart = topPart.replace(
  /import \* as d3Geo from 'd3-geo';\nimport indiaGeoData from '\.\.\/assets\/geo\/india-simplified\.json';/,
  `import indiaGeoData from '../assets/geo/india-simplified.json';\nimport { MapContainer, TileLayer, GeoJSON, Marker, Popup, Circle } from 'react-leaflet';\nimport L from 'leaflet';\nimport 'leaflet/dist/leaflet.css';`
);

// Define custom icons
const iconLogic = `
  // Custom Icon factory
  const createCustomIcon = (color: string, category: WeatherCategory) => {
    const iconHtml = \`
      <div style="background-color: \${color}; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 0 10px \${color};">
        <div style="width: 12px; height: 12px; background-color: white; border-radius: 50%;"></div>
      </div>
    \`;
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
`;

newTopPart = newTopPart.replace(
  /const getMarkerColor = [\s\S]*?return <MapPin className="w-3\.5 h-3\.5" \/>;\n    }\n  };/m,
  iconLogic
);

newTopPart = newTopPart.replace(
  /const handleZoom = [\s\S]*?setCategoryFilter\('all'\);\n  };\n/m,
  ``
);

newTopPart = newTopPart.replace(
  /const projection = useMemo\(\(\) => \{[\s\S]*?return \{ x, y \};\n  \};\n/m,
  ``
);


const bottomPart = `      <div className={\`relative w-full flex-1 rounded-2xl overflow-hidden border transition-all \${
        theme === 'light'
          ? 'bg-app border-line shadow-inner'
          : 'bg-app border-line shadow-inner'
      }\`}>
        <MapContainer
          center={[22.5, 80.0]}
          zoom={5}
          zoomControl={true}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
        >
          {theme === 'light' ? (
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">Carto</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
          ) : (
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">Carto</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
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

          {/* Weather Events */}
          {filteredEvents.map((event, i) => (
            <Marker
              key={i}
              position={[event.location.lat, event.location.lng]}
              icon={createCustomIcon(getMarkerColor(event.severity, event.status), event.category)}
              eventHandlers={{
                click: () => {
                  handleMarkerClick(event);
                },
              }}
            >
              <Popup>
                <div className="p-1 min-w-[200px]">
                  <h3 className="font-bold text-sm mb-1 text-slate-800">{event.title}</h3>
                  <p className="text-xs text-slate-600 mb-2">{event.description}</p>
                  <div className="flex items-center justify-between text-[10px] font-semibold">
                    <span className={\`px-1.5 py-0.5 rounded-sm \${event.severity === 'severe' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}\`}>
                      {event.severity.toUpperCase()}
                    </span>
                    <span className="text-slate-400">{new Date(event.timestamp).toLocaleTimeString()}</span>
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
`;

fs.writeFileSync('src/components/IndiaWeatherMap.tsx', newTopPart + bottomPart, 'utf8');
console.log('Leaflet Map replaced');
