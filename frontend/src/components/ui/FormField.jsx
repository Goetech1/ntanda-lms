import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

/**
 * FormField — Accessible form field wrapper.
 * 
 * Props:
 * - label: string (required)
 * - name: string (required, used for IDs and aria linking)
 * - error: string | null
 * - helperText: string | null
 * - required: boolean
 * - children: the input element
 * - className: optional wrapper class
 */
const FormField = ({ 
  label, 
  name, 
  error, 
  helperText, 
  required = false, 
  children, 
  className = '' 
}) => {
  const errorId = `${name}-error`;
  const helperId = `${name}-helper`;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label 
        htmlFor={name} 
        className="block text-sm font-semibold"
        style={{ color: 'var(--ob-text-primary)' }}
      >
        {label}
        {required && (
          <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
        )}
      </label>

      {children}

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            id={errorId}
            key="error"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex items-center gap-1.5 text-sm font-medium"
            style={{ color: 'var(--ob-error)' }}
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {!error && helperText && (
        <p 
          id={helperId} 
          className="text-xs"
          style={{ color: 'var(--ob-text-muted)' }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export { FormField };
