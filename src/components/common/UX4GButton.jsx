import React from 'react';

/**
 * UX4GButton
 * 
 * Complies with UX4G touch target standards:
 * - Default: min 48px x 48px
 * - Emergency mode: min 56px x 56px
 * - Visible focus ring (WCAG AAA)
 */
export function UX4GButton({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  disabled = false,
  className = '',
  emergencyMode = false,
  onClick,
  type = 'button',
  ariaLabel,
  ...props
}) {
  const baseClasses =
    'relative inline-flex items-center justify-center font-bold tracking-wide rounded-xl transition-all duration-150 active:scale-[0.98] select-none focus-visible:ring-2 focus-visible:ring-aid-primary focus-visible:ring-offset-2';

  const sizeClasses = emergencyMode
    ? 'min-h-[56px] px-6 text-base gap-3'
    : size === 'sm'
    ? 'min-h-[40px] px-3.5 py-1.5 text-xs gap-1.5'
    : size === 'lg'
    ? 'min-h-[52px] px-6 py-3 text-base gap-2.5'
    : 'min-h-[48px] px-5 py-2.5 text-sm gap-2';

  const variantClasses = {
    // AidConnect Terracotta Primary
    primary:
      'bg-aid-primary text-white hover:bg-aid-hover shadow-sm hover:shadow active:bg-red-800 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed',
    secondary:
      'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700 disabled:opacity-50',
    outline:
      'bg-white text-slate-800 border-2 border-slate-300 hover:border-aid-primary hover:text-aid-primary dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:border-aid-primary disabled:opacity-50',
    danger:
      'bg-red-600 text-white hover:bg-red-700 shadow-sm active:bg-red-800 disabled:opacity-50',
    ghost:
      'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`${baseClasses} ${sizeClasses} ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...props}
    >
      {Icon && <Icon className={emergencyMode ? 'w-5 h-5' : size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
}

export default UX4GButton;
