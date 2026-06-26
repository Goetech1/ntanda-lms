import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

/**
 * StepIndicator — Horizontal multi-step progress indicator.
 *
 * Props:
 * - steps: Array<{ label: string, description?: string }>
 * - currentStep: number (0-indexed)
 * - className: string
 */
const StepIndicator = ({ steps, currentStep, className = '' }) => {
  return (
    <nav 
      aria-label="Registration progress" 
      className={`w-full ${className}`}
    >
      <ol className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <li 
              key={index} 
              className="flex flex-col items-center relative z-10 flex-1"
              aria-current={isCurrent ? 'step' : undefined}
            >
              {/* Connector line (not for first step) */}
              {index > 0 && (
                <div 
                  className="absolute top-[18px] right-1/2 h-[2px] w-full -z-10"
                  style={{ backgroundColor: '#E2E8F0' }}
                >
                  <motion.div
                    className="h-full"
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: isCompleted || isCurrent ? '100%' : '0%' 
                    }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    style={{ backgroundColor: '#2563EB' }}
                  />
                </div>
              )}

              {/* Step circle */}
              <motion.div
                className="flex items-center justify-center rounded-full border-2 transition-colors duration-300"
                style={{
                  width: 36,
                  height: 36,
                  backgroundColor: isCompleted
                    ? '#2563EB'
                    : isCurrent
                    ? '#FFFFFF'
                    : '#FFFFFF',
                  borderColor: isCompleted
                    ? '#2563EB'
                    : isCurrent
                    ? '#2563EB'
                    : '#E2E8F0',
                  boxShadow: isCurrent
                    ? '0 0 0 4px rgba(37, 99, 235, 0.12)'
                    : 'none',
                }}
                animate={{
                  scale: isCurrent ? 1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </motion.div>
                ) : (
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: isCurrent ? '#2563EB' : '#94A3B8',
                    }}
                  >
                    {index + 1}
                  </span>
                )}
              </motion.div>

              {/* Label */}
              <span
                className="mt-2 text-xs font-semibold hidden sm:block text-center"
                style={{
                  color: isCompleted || isCurrent 
                    ? 'var(--ob-text-primary)' 
                    : 'var(--ob-text-muted)',
                }}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export { StepIndicator };
