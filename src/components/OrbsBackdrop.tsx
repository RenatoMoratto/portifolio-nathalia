import { Suspense, lazy } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useScrollAnimation } from '../hooks';
import { cn } from '../utils/cn';

// Keep the Three.js bundle off routes without the hero.
const OrganicOrbs = lazy(() => import('./OrganicOrbs'));

interface OrbsBackdropProps {
  className?: string;
}

function StaticOrbs({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-rose-300/30 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-1/5 w-80 h-80 bg-stone-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl" />
    </div>
  );
}

/** Skips WebGL for reduced motion and pauses it off-screen. */
export function OrbsBackdrop({ className }: OrbsBackdropProps) {
  const shouldReduceMotion = useReducedMotion();
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({
    triggerOnce: false,
    threshold: 0,
  });

  if (shouldReduceMotion) {
    return <StaticOrbs className={className} />;
  }

  return (
    <div ref={ref} className={cn('absolute inset-0 pointer-events-none', className)}>
      <Suspense fallback={<StaticOrbs />}>
        <OrganicOrbs active={isVisible} />
      </Suspense>
    </div>
  );
}
