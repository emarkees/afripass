import React from 'react';
import { ShieldCheck, Lock, AlertTriangle } from 'lucide-react';

export interface PrivacyBadgeProps {
  variant?: 'success' | 'warning' | 'info';
  label: string;
  sublabel?: string;
  className?: string;
}

export const PrivacyBadge: React.FC<PrivacyBadgeProps> = ({
  variant = 'success',
  label,
  sublabel,
  className = '',
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'success':
        return {
          container: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />,
        };
      case 'warning':
        return {
          container: 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300',
          icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
        };
      case 'info':
      default:
        return {
          container: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700 dark:text-indigo-300',
          icon: <Lock className="w-5 h-5 text-indigo-500 shrink-0" />,
        };
    }
  };

  const { container, icon } = getStyles();

  return (
    <div
      className={`p-3.5 sm:p-4 rounded-xl border flex items-center gap-3 text-xs sm:text-sm font-medium ${container} ${className}`}
      role="status"
    >
      {icon}
      <div>
        <div className="font-semibold">{label}</div>
        {sublabel && <div className="text-xs opacity-80 mt-0.5">{sublabel}</div>}
      </div>
    </div>
  );
};

export default PrivacyBadge;
