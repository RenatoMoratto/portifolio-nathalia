import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { ThemeProvider } from './providers';
import { DocumentLanguage } from './components/DocumentLanguage';

/*
 * Home is eager: it is the landing route, and lazy-loading it would only add a
 * round trip before first paint. The rest are split so a visitor who never
 * opens them never downloads them.
 */
import { Home } from './pages/Home';

const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })));
const Contact = lazy(() =>
  import('./pages/Contact').then((m) => ({ default: m.Contact })),
);
const ProjectPage = lazy(() =>
  import('./pages/ProjectPage').then((m) => ({ default: m.ProjectPage })),
);

/** Reserves vertical space so lazy routes do not collapse the layout. */
function RouteFallback() {
  return <div className="min-h-screen" aria-busy="true" />;
}

function AppRoutes() {
  const location = useLocation();

  return (
    /*
     * `Routes` is keyed by pathname so it is a *new* child of AnimatePresence on
     * every navigation. Without the key, AnimatePresence sees one child that
     * never changes identity and the pages' `exit` animations never run.
     */
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <>
              <ScrollToTop />
              <Layout />
            </>
          }
        >
          <Route index element={<Home />} />
          <Route
            path="about"
            element={
              <Suspense fallback={<RouteFallback />}>
                <About />
              </Suspense>
            }
          />
          <Route
            path="contact"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Contact />
              </Suspense>
            }
          />
          <Route
            path="projects/:slug"
            element={
              <Suspense fallback={<RouteFallback />}>
                <ProjectPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <DocumentLanguage />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
