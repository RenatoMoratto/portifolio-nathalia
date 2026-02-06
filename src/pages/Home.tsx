import { motion, useReducedMotion } from 'framer-motion';
import { Hero, Projects, HowIWork } from '../sections';

export function Home() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.main
      className="pt-24 pb-20 px-3 sm:px-4 lg:px-6"
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0 }}
      transition={{
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1], // premium, easeOutExpo-ish
      }}
    >
      <Hero />
      <Projects />
      <HowIWork />
    </motion.main>
  );
}
