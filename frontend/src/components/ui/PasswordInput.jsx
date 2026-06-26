import { useState, useMemo } from 'react';
import { Eye, EyeOff, Lock, Check, X } from 'lucide-react';
import { Input } from './Input';
import { cn } from '../../utils/cn';

const PASSWORD_REQUIREMENTS = [
  { key: 'length', label: 'At least 6 characters', test: (v) => v.length >= 6 },
  { key: 'uppercase', label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { key: 'number', label: 'One number', test: (v) => /\d/.test(v) },
  { key: 'special', label: 'One special character', test: (v) => /[!@#$%^&*(),.?":{}|<>]/.test(v) },
];

const STRENGTH_CONFIG = [
  { label: 'Weak', color: '#DC2626', bg: '#FEF2F2' },
  { label: 'Fair', color: '#D97706', bg: '#FFFBEB' },
  { label: 'Good', color: '#2563EB', bg: '#EFF6FF' },
  { label: 'Strong', color: '#059669', bg: '#ECFDF5' },
];

/**
 * PasswordInput — Password field with visibility toggle and optional strength meter.
 *
 * Props:
 * - value: string
 * - onChange: (e) => void
 * - onBlur: () => void
 * - showStrength: boolean (show strength meter + requirements)
 * - error: boolean (show error ring)
 * - disabled: boolean
 * - placeholder: string
 * - id: string
 * - name: string
 * - aria-invalid: boolean
 * - aria-describedby: string
 */
const PasswordInput = ({
  value = '',
  onChange,
  onBlur,
  showStrength = false,
  error = false,
  disabled = false,
  placeholder = '••••••••',
  id,
  className,
  ...props
}) => {
  const [visible, setVisible] = useState(false);

  const strength = useMemo(() => {
    if (!value) return 0;
    return PASSWORD_REQUIREMENTS.filter(r => r.test(value)).length;
  }, [value]);

  const strengthConfig = strength > 0 ? STRENGTH_CONFIG[strength - 1] : null;

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <Lock className="h-[18px] w-[18px]" style={{ color: 'var(--ob-text-muted)' }} />
        </div>
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={cn(
            'pl-10 pr-11 h-12 bg-white text-sm transition-all duration-200',
            'border focus-visible:outline-none focus-visible:ring-[3px]',
            error
              ? 'border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/10'
              : 'border-[#E2E8F0] hover:border-[#CBD5E1] focus-visible:border-[#2563EB] focus-visible:ring-[#2563EB]/10',
            className
          )}
          style={{ color: 'var(--ob-text-primary)' }}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible(v => !v)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors hover:opacity-70"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? (
            <EyeOff className="h-[18px] w-[18px]" style={{ color: 'var(--ob-text-muted)' }} />
          ) : (
            <Eye className="h-[18px] w-[18px]" style={{ color: 'var(--ob-text-muted)' }} />
          )}
        </button>
      </div>

      {showStrength && value.length > 0 && (
        <div className="space-y-2.5">
          {/* Strength meter bar */}
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1 flex-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className="h-1.5 flex-1 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: strength >= level 
                      ? strengthConfig?.color 
                      : '#E2E8F0',
                  }}
                />
              ))}
            </div>
            {strengthConfig && (
              <span
                className="text-xs font-semibold min-w-[44px] text-right"
                style={{ color: strengthConfig.color }}
                aria-live="polite"
              >
                {strengthConfig.label}
              </span>
            )}
          </div>

          {/* Requirements checklist */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {PASSWORD_REQUIREMENTS.map(({ key, label, test }) => {
              const met = test(value);
              return (
                <div 
                  key={key} 
                  className="flex items-center gap-1.5 transition-all duration-200"
                >
                  {met ? (
                    <Check className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--ob-success)' }} />
                  ) : (
                    <X className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--ob-text-muted)' }} />
                  )}
                  <span 
                    className="text-xs transition-colors duration-200"
                    style={{ color: met ? 'var(--ob-success)' : 'var(--ob-text-muted)' }}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export { PasswordInput, PASSWORD_REQUIREMENTS };
