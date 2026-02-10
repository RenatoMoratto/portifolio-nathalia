import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { Home, About, Contact, ProjectPage } from './pages';
import { ThemeProvider } from './hooks';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { premiumEasing } from './utils/animations';

function AppRoutes() {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence initial={!shouldReduceMotion}>
      <motion.div
        layout
        transition={{
          duration: 0.55,
          ease: premiumEasing,
        }}
      >
        <Routes location={location}>
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
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="projects/:slug" element={<ProjectPage />} />
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
