import { Suspense, lazy } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useScrollAnimation } from '../hooks';
import { cn } from '../utils/cn';

/*
 * Loading this module pulls in three + @react-three/fiber + drei, which are the
 * single largest thing in the bundle and are used only by this decoration.
 * Lazy-loading keeps them off the critical path, so routes that never show the
 * hero (/about, /contact, /projects/*) do not download them at all.
 */
const OrganicOrbs = lazy(() => import('./OrganicOrbs'));

interface OrbsBackdropProps {
  className?: string;
}

/** Cheap CSS stand-in: the reduced-motion result and the loading placeholder. */
function StaticOrbs({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-rose-300/30 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-1/5 w-80 h-80 bg-stone-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl" />
    </div>
  );
}

/**
 * Decides *whether* the expensive 3D backdrop should exist at all, and keeps it
 * paused while off-screen.
 *
 * `useReducedMotion` subscribes to the media query, unlike the previous
 * one-shot `useMemo(() => matchMedia(...).matches)`, so toggling the OS setting
 * now takes effect without a reload.
 */
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
