import React, { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface AnimateNumberProps {
  value: number;
  duration?: number;
}

const AnimateNumber: React.FC<AnimateNumberProps> = ({ value, duration = 1 }) => {
  // Инициализируем motionValue с 0 (или можно с value, если хотите)
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));

  useEffect(() => {
    // Анимируем от текущего значения к новому value
    const controls = animate(motionValue, value, { duration });
    return controls.stop;
  }, [value, duration, motionValue]);

  return <motion.span>{rounded}</motion.span>;
};

export default AnimateNumber;
