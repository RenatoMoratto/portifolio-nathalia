import { motion, useReducedMotion } from 'framer-motion';
import { Hero, Projects, HowIWork } from '../sections';
import { premiumEasing } from '../utils/animations';

export function Home() {
  const shouldReduceMotion = useReducedMotion();

  // Layout owns the main landmark.
  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0 }}
      transition={{ duration: 0.25, ease: premiumEasing }}
    >
      <Hero />
      <Projects />
      <HowIWork />
    </motion.div>
  );
}
