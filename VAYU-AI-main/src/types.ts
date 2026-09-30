export type WeatherCategory =
  | 'rainfall'
  | 'flooding'
  | 'thunderstorm'
  | 'heatwave'
  | 'dense_fog'
  | 'dust_storm'
  | 'strong_winds'
  | 'cyclone';

export type EventSeverity = 'severe' | 'warning' | 'advisory' | 'normal';

export type VerificationStatus = 'verified' | 'pending' | 'flagged' | 'rejected';

export type DataSourceType =
  | 'imd'
  | 'isro_insat'
  | 'dwr_radar'
  | 'cpcb_sensor'
  | 'open_meteo'
  | 'citizen'
  | 'sdma'
  | 'news_media';

export interface WeatherEvent {
  id: string;
  title: string;
  category: WeatherCategory;
  severity: EventSeverity;
  status: VerificationStatus;
  location: {
    city: string;
    state: string;
    region: string;
    lat: number;
    lng: number;
  };
  timestamp: string;
  reportedAgo: string;
  source: {
    id: string;
    name: string;
    type: DataSourceType;
    trustScore: number;
  };
  description: string;
  telemetry: {
    temperatureC?: number;
    rainfallMm?: number;
    windSpeedKmh?: number;
    pressureHpa?: number;
    humidityPct?: number;
    visibilityKm?: number;
    aqi?: number;
  };
  aiAnalysis?: {
    confidenceScore: number;
    summary: string;
    duplicateRisk: 'low' | 'moderate' | 'high';
    crossCheckedWith: string[];
    suggestedClassification: WeatherCategory;
    isSimulated?: boolean;
  };
  mediaUrl?: string;
  reporter?: {
    name?: string;
    isVerifiedUser?: boolean;
    reportsCount?: number;
  };
  reviewNotes?: string;
}

export interface DataSource {
  id: string;
  name: string;
  organization: string;
  type: DataSourceType;
  status: 'connected' | 'live_ingestion' | 'demo' | 'calibrating' | 'offline';
  updateFrequency: string;
  lastUpdated: string;
  reportsCount: number;
  latencyMs: number;
  coverage: string;
  description: string;
  protocol: string;
  endpointSample: string;
}

export interface VerificationSummary {
  pendingCount: number;
  verifiedCount: number;
  flaggedCount: number;
  rejectedCount: number;
  averageVerificationTime: string;
  aiAccuracyEstimate: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  targetId: string;
  details: string;
  severity: 'info' | 'warning' | 'alert';
}

export type ActiveView =
  | 'landing'
  | 'command_center'
  | 'live_map'
  | 'events'
  | 'sources'
  | 'verification'
  | 'citizen_report'
  | 'analytics'
  | 'admin'
  | 'about'
  | 'settings';
