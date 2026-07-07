import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export const AnimatedCounter = ({
  value,
  duration = 1.5,
  suffix = '',
  decimals = 0,
  className,
}: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const spring = useSpring(0, { duration: duration * 1000 });
  const rounded = useTransform(spring, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString()
  );

  useEffect(() => {
    spring.set(value);
    const unsubscribe = rounded.on('change', (v) => setDisplayValue(parseFloat(v)));
    return unsubscribe;
  }, [value, spring, rounded]);

  return (
    <motion.span className={className}>
      {decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue)}
      {suffix}
    </motion.span>
  );
};
