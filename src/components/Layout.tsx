import { Navbar } from './Navbar';
import { Footer } from '../sections';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-light-bg text-slate-900 dark:bg-dark-bg dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      {/*
       * Flex column so `main` absorbs whatever viewport height a short route
       * leaves over. Without it the footer stopped where the content stopped
       * and the rest of the `min-h-screen` shell showed up as a blank band
       * underneath it - visible on /contact, the shortest page.
       */}
      <main className="flex flex-1 flex-col pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
