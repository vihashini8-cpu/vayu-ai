import React from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useWeatherApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderColor = 'border-accent/20';
        let bgGradient = 'bg-surface';
        let icon = <Info className="w-5 h-5 text-accent shrink-0" />;

        if (toast.type === 'success') {
          borderColor = 'border-status-normal/20';
          icon = <CheckCircle2 className="w-5 h-5 text-status-normal shrink-0" />;
        } else if (toast.type === 'warning') {
          borderColor = 'border-status-warning/20';
          icon = <AlertTriangle className="w-5 h-5 text-status-warning shrink-0" />;
        } else if (toast.type === 'alert') {
          borderColor = 'border-status-severe/20';
          icon = <AlertCircle className="w-5 h-5 text-status-severe shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl shadow-fg/5 transition-all transform duration-200 animate-in fade-in slide-in-from-bottom-3 ${borderColor} ${bgGradient}`}
          >
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-fg tracking-tight leading-snug">
                {toast.title}
              </h4>
              <p className="text-xs font-medium text-fg-muted mt-1 leading-relaxed">
                {toast.description}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-fg-muted hover:text-fg transition-colors p-1.5 rounded-lg hover:bg-fg-muted/5"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
