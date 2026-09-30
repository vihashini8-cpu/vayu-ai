import React from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useWeatherApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderColor = 'border-blue-500/40';
        let bgGradient = 'bg-[#102238]/95';
        let icon = <Info className="w-5 h-5 text-blue-400 shrink-0" />;

        if (toast.type === 'success') {
          borderColor = 'border-teal-500/50';
          icon = <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />;
        } else if (toast.type === 'warning') {
          borderColor = 'border-amber-500/50';
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
        } else if (toast.type === 'alert') {
          borderColor = 'border-rose-500/50';
          icon = <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl shadow-black/60 transition-all transform duration-200 animate-in fade-in slide-in-from-bottom-3 ${borderColor} ${bgGradient}`}
          >
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-100 tracking-tight leading-snug">
                {toast.title}
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {toast.description}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800/60"
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
