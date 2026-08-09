import { Navbar } from './Navbar';
import { Footer } from '../sections';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-light-bg text-slate-900 dark:bg-dark-bg dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <main className="flex flex-1 flex-col pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
