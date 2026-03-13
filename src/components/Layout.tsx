import { Link, NavLink } from 'react-router-dom';
import { PropsWithChildren } from 'react';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 text-sm rounded-full transition ${isActive ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-200'}`;

export const Layout = ({ children }: PropsWithChildren) => (
  <div className="min-h-screen">
    <header className="sticky top-0 z-20 bg-stone-100/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-semibold text-xl text-stone-900">NatureForm 3D</Link>
        <nav className="flex items-center gap-2">
          <NavLink className={navClass} to="/dashboard">Dashboard</NavLink>
          <NavLink className={navClass} to="/wizard">New Project</NavLink>
          <NavLink className={navClass} to="/demo">Demo Workflow</NavLink>
        </nav>
      </div>
    </header>
    <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
  </div>
);
