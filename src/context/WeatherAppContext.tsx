import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { WeatherEvent, DataSource, VerificationSummary, ActiveView } from '../types';
import { INITIAL_WEATHER_EVENTS, DATA_SOURCES, INITIAL_VERIFICATION_SUMMARY } from '../data/mockData';
import { supabase } from '../lib/supabase';

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'info' | 'alert';
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  department: string;
  initials: string;
  region?: string;
  isAdmin?: boolean;
}

export const DEMO_USERS: UserProfile[] = [
  {
    name: 'Dr. K. Swaminathan',
    email: 'swaminathan@vayu.gov.in',
    role: 'Lead Meteorologist',
    department: 'IMD National Cyclone Centre',
    initials: 'KS',
  },
  {
    name: 'Ananya Deshmukh',
    email: 'deshmukh@sdma.gov.in',
    role: 'State Disaster Liaison',
    department: 'State Emergency Operations (EOC)',
    initials: 'AD',
  },
  {
    name: 'Devraj Singh',
    email: 'devraj.observer@vayu.in',
    role: 'Citizen Field Observer',
    department: 'National Volunteer Mesh',
    initials: 'DS',
  },
];

interface WeatherAppContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  events: WeatherEvent[];
  dataSources: DataSource[];
  verificationSummary: VerificationSummary;
  selectedEvent: WeatherEvent | null;
  setSelectedEvent: (event: WeatherEvent | null) => void;
  verifyEvent: (eventId: string, notes?: string) => void;
  rejectEvent: (eventId: string, reason?: string) => void;
  flagEvent: (eventId: string, reason?: string) => void;
  submitCitizenReport: (report: Partial<WeatherEvent>) => Promise<string>;
  resetDemoData: () => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isEmergencyModalOpen: boolean;
  setIsEmergencyModalOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  currentUser: UserProfile;
  login: (user: UserProfile) => void;
  logout: () => void;
  theme: 'dark' | 'light' | 'system';
  effectiveTheme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  toggleTheme: () => void;
  liveTime: string;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  pendingView: ActiveView | null;
  setPendingView: (view: ActiveView | null) => void;
  isAuthenticated: boolean;
}

const WeatherAppContext = createContext<WeatherAppContextType | undefined>(undefined);

export const WeatherAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to landing page with demo login, allowing direct entrance to command center
  const [activeView, setActiveView] = useState<ActiveView>('landing');
  const [pendingView, setPendingView] = useState<ActiveView | null>(null);
  const [events, setEvents] = useState<WeatherEvent[]>(INITIAL_WEATHER_EVENTS);
  const [dataSources] = useState<DataSource[]>(DATA_SOURCES);
  const [selectedEvent, setSelectedEvent] = useState<WeatherEvent | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [demoMode, setDemoMode] = useState(true);

  // User state
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS[0]);
  const isAuthenticated = currentUser.email !== DEMO_USERS[0].email;

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data && data.user) {
          const user = data.user;
          setCurrentUser({
            email: user.email || '',
            name: user.name || user.email?.split('@')[0] || 'User',
            role: user.role || 'citizen',
            department: user.department || 'Registered User',
            initials: (user.name || user.email || 'U').substring(0, 2).toUpperCase(),
            region: user.region || 'Unknown',
            isAdmin: user.isAdmin || false
          });
        }
      })
      .catch(() => {});
  }, []);

  // Theme state
  const [theme, setThemeState] = useState<'dark' | 'light' | 'system'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('vayu-theme');
      if (stored === 'light' || stored === 'dark' || stored === 'system') return stored as any;
    }
    return 'system';
  });

  const [effectiveTheme, setEffectiveTheme] = useState<'dark' | 'light'>('dark');

  const setTheme = useCallback((newTheme: 'dark' | 'light' | 'system') => {
    setThemeState(newTheme);
    localStorage.setItem('vayu-theme', newTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const resolvedTheme = isDark ? 'dark' : 'light';
    setEffectiveTheme(resolvedTheme);
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        const root = document.documentElement;
        const isDark = e.matches;
        setEffectiveTheme(isDark ? 'dark' : 'light');
        if (isDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      let nextTheme: 'dark' | 'light' | 'system' = 'system';
      if (prev === 'system') {
        nextTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark';
      } else if (prev === 'dark') {
        nextTheme = 'light';
      } else {
        nextTheme = 'dark'; // maybe cycle to system instead? the requirement just says "toggle"
      }
      localStorage.setItem('vayu-theme', nextTheme);
      return nextTheme;
    });
  }, []);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const login = useCallback((user: UserProfile) => {
    setCurrentUser(user);
    setIsLoginModalOpen(false);
    
    // Role-based redirection, overridden by pendingView
    setPendingView((currentPending) => {
      if (currentPending) {
        setActiveView(currentPending);
        return null;
      }
      if (user.role === 'citizen' || user.role === 'Citizen Field Observer') {
        setActiveView('citizen_report');
      } else if (user.role === 'sdma' || user.role === 'State Disaster Liaison') {
        setActiveView('analytics'); 
      } else {
        setActiveView('command_center');
      }
      return null;
    });

    addToast({
      title: `Authenticated as ${user.name}`,
      description: `Active role: ${user.role} · ${user.department || user.region || 'Registered'}`,
      type: 'success',
    });
  }, [addToast]);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      // ignore
    }
    setCurrentUser(DEMO_USERS[0]); // Reset to default guest
    setActiveView('landing');
    addToast({
      title: 'Signed Out',
      description: 'Returned to VAYU AI Public Portal.',
      type: 'info',
    });
  }, [addToast]);

  // Compute live Indian Standard Time clock
  const [liveTime, setLiveTime] = useState<string>(() => {
    const now = new Date();
    return now.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST';
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const verifyEvent = useCallback((eventId: string, notes?: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? {
              ...e,
              status: 'verified',
              reviewNotes: notes || `Verified by ${currentUser.name} with secondary radar corroboration.`,
            }
          : e
      )
    );
    addToast({
      title: 'Report Verified',
      description: `Event ID ${eventId} verified & updated in National Ledger.`,
      type: 'success',
    });
    if (selectedEvent?.id === eventId) {
      setSelectedEvent((prev) => (prev ? { ...prev, status: 'verified', reviewNotes: notes } : null));
    }
  }, [addToast, selectedEvent, currentUser]);

  const rejectEvent = useCallback((eventId: string, reason?: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? {
              ...e,
              status: 'rejected',
              reviewNotes: reason || `Rejected by ${currentUser.name} following discrepancy check.`,
            }
          : e
      )
    );
    addToast({
      title: 'Report Rejected',
      description: `Event ID ${eventId} marked as rejected.`,
      type: 'warning',
    });
    if (selectedEvent?.id === eventId) {
      setSelectedEvent((prev) => (prev ? { ...prev, status: 'rejected', reviewNotes: reason } : null));
    }
  }, [addToast, selectedEvent, currentUser]);

  const flagEvent = useCallback((eventId: string, reason?: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? {
              ...e,
              status: 'flagged',
              reviewNotes: reason || `Flagged for ground truth inspection by ${currentUser.name}.`,
            }
          : e
      )
    );
    addToast({
      title: 'Flagged for Review',
      description: `Event ID ${eventId} transferred to Field Corroboration Queue.`,
      type: 'alert',
    });
    if (selectedEvent?.id === eventId) {
      setSelectedEvent((prev) => (prev ? { ...prev, status: 'flagged', reviewNotes: reason } : null));
    }
  }, [addToast, selectedEvent, currentUser]);

  const submitCitizenReport = useCallback(async (report: Partial<WeatherEvent>) => {
    const reportId = `VAYU-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const lat = report.location?.lat || 25.3176;
    const lng = report.location?.lng || 82.9739;
    const category = report.category || 'rainfall';

    let evidenceAssessment: WeatherEvent['evidenceAssessment'] = undefined;

    try {
      const res = await fetch('/api/verify-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng, category }),
      });
      if (res.ok) {
        const data = await res.json();
        evidenceAssessment = data.evidenceAssessment;
      }
    } catch (err) {
      console.error('Failed to verify report via API:', err);
    }

    const newEvent: WeatherEvent = {
      id: reportId,
      title: report.title || 'Localized Weather Incident',
      category,
      severity: report.severity || 'warning',
      status: 'pending',
      location: report.location || {
        city: 'Varanasi',
        state: 'Uttar Pradesh',
        region: 'Gangetic Plains',
        lat,
        lng,
      },
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit' }) + ' IST Today',
      reportedAgo: 'Just now',
      source: {
        id: 'src-citizen-hub',
        name: 'VAYU AI Citizen Submissions',
        type: 'citizen',
        trustScore: 85,
      },
      description: report.description || 'Observed localized weather incident submitted by citizen reporter.',
      telemetry: report.telemetry || {
        rainfallMm: 24.5,
        windSpeedKmh: 35,
        temperatureC: 28.0,
      },
      evidenceAssessment, // Replace aiAnalysis fake fields with this
      reporter: {
        name: report.reporter?.name || currentUser.name,
        isVerifiedUser: false,
        reportsCount: 1,
      },
    };

    setEvents((prev) => [newEvent, ...prev]);
    addToast({
      title: 'Report Submitted',
      description: `Report ${reportId} submitted and added to Verification Queue.`,
      type: 'success',
    });
    return reportId;
  }, [addToast, currentUser]);

  const resetDemoData = useCallback(() => {
    setEvents(INITIAL_WEATHER_EVENTS);
    setSelectedEvent(null);
    addToast({
      title: 'Demo Data Reset',
      description: 'Restored all weather events and verification queues to initial state.',
      type: 'info',
    });
  }, [addToast]);

  const verificationSummary = useMemo<VerificationSummary>(() => {
    const pending = events.filter((e) => e.status === 'pending').length;
    const verified = events.filter((e) => e.status === 'verified').length;
    const flagged = events.filter((e) => e.status === 'flagged').length;
    const rejected = events.filter((e) => e.status === 'rejected').length;

    return {
      pendingCount: pending,
      verifiedCount: verified,
      flaggedCount: flagged,
      rejectedCount: rejected,
      averageVerificationTime: '4.2 minutes',
      aiAccuracyEstimate: '96.8%',
    };
  }, [events]);

  return (
    <WeatherAppContext.Provider
      value={{
        activeView,
        setActiveView,
        events,
        dataSources,
        verificationSummary,
        selectedEvent,
        setSelectedEvent,
        verifyEvent,
        rejectEvent,
        flagEvent,
        submitCitizenReport,
        resetDemoData,
        toasts,
        addToast,
        removeToast,
        searchQuery,
        setSearchQuery,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isEmergencyModalOpen,
        setIsEmergencyModalOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        currentUser,
        login,
        logout,
        theme,
        effectiveTheme,
        setTheme,
        toggleTheme,
        liveTime,
        demoMode,
        setDemoMode,
        pendingView,
        setPendingView,
        isAuthenticated,
      }}
    >
      {children}
    </WeatherAppContext.Provider>
  );
};

export const useWeatherApp = () => {
  const context = useContext(WeatherAppContext);
  if (!context) {
    throw new Error('useWeatherApp must be used within a WeatherAppProvider');
  }
  return context;
};
