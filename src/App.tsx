import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home, About, Contact } from './pages';
import { ThemeProvider } from './hooks';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            {/* Placeholder for projects */}
            <Route
              path="projects/:id"
              element={
                <div className="pt-20 text-center">
                  Project Details (Work in Progress)
                </div>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
