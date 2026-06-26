import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Button } from './Button';

/**
 * SuccessScreen — Animated success confirmation.
 *
 * Props:
 * - heading: string
 * - description: string | ReactNode
 * - ctaLabel: string
 * - onCtaClick: () => void
 * - secondaryCtaLabel: string
 * - onSecondaryCtaClick: () => void
 * - children: ReactNode (extra content below description)
 */
const SuccessScreen = ({
  heading = 'Success!',
  description,
  ctaLabel,
  onCtaClick,
  secondaryCtaLabel,
  onSecondaryCtaClick,
  children,
}) => {
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowParticles(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center px-6 py-10 max-w-md mx-auto"
    >
      {/* Animated checkmark circle */}
      <div className="relative mb-8">
        {/* Celebration particles */}
        {showParticles && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 6 + Math.random() * 4,
                  height: 6 + Math.random() * 4,
                  left: '50%',
                  top: '50%',
                  backgroundColor: [
                    '#2563EB', '#059669', '#8B5CF6', '#D97706',
                    '#EC4899', '#06B6D4', '#F59E0B', '#10B981',
                  ][i],
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos((i * Math.PI * 2) / 8) * (50 + Math.random() * 30),
                  y: Math.sin((i * Math.PI * 2) / 8) * (50 + Math.random() * 30),
                  opacity: 0,
                  scale: 0,
                }}
                transition={{
                  duration: 0.8 + Math.random() * 0.4,
                  ease: 'easeOut',
                  delay: Math.random() * 0.2,
                }}
              />
            ))}
          </>
        )}

        {/* Checkmark SVG */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background circle */}
            <motion.circle
              cx="40"
              cy="40"
              r="38"
              stroke="#059669"
              strokeWidth="3"
              fill="#ECFDF5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.2 }}
            />
            {/* Checkmark */}
            <motion.path
              d="M24 40L35 51L56 30"
              stroke="#059669"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.6 }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="text-2xl font-bold mb-2"
        style={{ 
          color: 'var(--ob-text-primary)',
          fontFamily: 'var(--font-heading)',
        }}
      >
        {heading}
      </motion.h2>

      {/* Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-base mb-6 leading-relaxed"
          style={{ color: 'var(--ob-text-secondary)' }}
        >
          {description}
        </motion.p>
      )}

      {/* Extra content */}
      {children && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="w-full mb-6"
        >
          {children}
        </motion.div>
      )}

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="flex flex-col sm:flex-row gap-3 w-full"
      >
        {ctaLabel && (
          <Button
            onClick={onCtaClick}
            className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white h-12 rounded-[10px] text-base font-semibold transition-all hover:scale-[1.01] hover:shadow-lg"
          >
            {ctaLabel}
          </Button>
        )}
        {secondaryCtaLabel && (
          <Button
            onClick={onSecondaryCtaClick}
            variant="outline"
            className="flex-1 h-12 rounded-[10px] text-base font-medium"
            style={{ 
              borderColor: 'var(--ob-border)',
              color: 'var(--ob-text-secondary)',
            }}
          >
            {secondaryCtaLabel}
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
};

export { SuccessScreen };
