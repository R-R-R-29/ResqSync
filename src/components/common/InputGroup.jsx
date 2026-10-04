import React from 'react';

/**
 * InputGroup
 * UX4G Standard: Form labels placed strictly ABOVE input fields.
 * Clear touch targets (min 48px) and accessible labels.
 */
export function InputGroup({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  helperText,
  error,
  icon: Icon,
  rows,
  className = '',
  emergencyMode = false,
  ...props
}) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  const baseInputClasses =
    'w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-aid-primary focus:ring-2 focus:ring-aid-primary/20 transition-all duration-150';

  const sizeClasses = emergencyMode
    ? 'min-h-[56px] text-base py-3'
    : 'min-h-[48px] text-sm py-2.5';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label strictly above */}
      <label
        htmlFor={inputId}
        className={`block font-bold text-slate-700 dark:text-slate-200 tracking-wide ${
          emergencyMode ? 'text-sm' : 'text-xs'
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>

      {/* Input or Textarea container */}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" aria-hidden="true" />
          </div>
        )}

        {rows ? (
          <textarea
            id={inputId}
            rows={rows}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`${baseInputClasses} ${Icon ? 'pl-10' : ''} py-3 resize-none`}
            {...props}
          />
        ) : (
          <input
            id={inputId}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`${baseInputClasses} ${sizeClasses} ${Icon ? 'pl-10' : ''}`}
            {...props}
          />
        )}
      </div>

      {/* Helper text or Error */}
      {error ? (
        <p className="text-xs text-red-600 dark:text-red-400 font-semibold">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
}

export default InputGroup;
