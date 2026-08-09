import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { ThemeProvider } from './providers';
import { DocumentLanguage } from './components/DocumentLanguage';

// Keep the landing route eager; split routes visitors may never open.
import { Home } from './pages/Home';

const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })));
const Contact = lazy(() =>
  import('./pages/Contact').then((m) => ({ default: m.Contact })),
);
const ProjectPage = lazy(() =>
  import('./pages/ProjectPage').then((m) => ({ default: m.ProjectPage })),
);

/** Prevents lazy routes from collapsing the layout. */
function RouteFallback() {
  return <div className="min-h-screen" aria-busy="true" />;
}

function AppRoutes() {
  const location = useLocation();

  return (
    // Key routes by path so exit animations receive a new child.
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
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
