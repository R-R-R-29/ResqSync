import React from 'react';

/**
 * UX4GButton
 * 
 * Styled according to reference mobile-app design:
 * - Rounded / pill-shaped buttons
 * - Coral primary CTA (#E85B4A) with crisp white text
 * - Secondary white with coral border and text
 * - Min 48px touch target (56px in emergency mode)
 * - Accessible focus indicators
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
    'relative inline-flex items-center justify-center font-bold tracking-wide rounded-full transition-all duration-150 active:scale-[0.98] select-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2';

  const sizeClasses = emergencyMode
    ? 'min-h-[56px] px-7 text-base gap-3'
    : size === 'sm'
    ? 'min-h-[42px] px-4 py-1.5 text-xs gap-1.5'
    : size === 'lg'
    ? 'min-h-[52px] px-7 py-3 text-base gap-2.5'
    : 'min-h-[48px] px-6 py-2.5 text-sm gap-2';

  const variantClasses = {
    // Reference Coral Primary CTA
    primary:
      'bg-coral text-white hover:bg-coral-dark shadow-sm hover:shadow active:bg-coral-dark disabled:bg-[#E6E1DD] disabled:text-[#8A8580] disabled:cursor-not-allowed',
    secondary:
      'bg-white text-coral hover:bg-coral-light border-2 border-coral shadow-sm active:bg-coral-light disabled:opacity-50',
    outline:
      'bg-white text-ink border border-outline hover:border-coral hover:text-coral shadow-sm disabled:opacity-50',
    danger:
      'bg-[#D94343] text-white hover:bg-[#C94336] shadow-sm active:bg-[#B91C1C] disabled:opacity-50',
    ghost:
      'bg-transparent text-ink-secondary hover:bg-surface-secondary hover:text-ink',
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
