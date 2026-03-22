import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Dashboard from './pages/Dashboard';
import MergePage from './pages/MergePage';
import SplitPage from './pages/SplitPage';
import CompressPage from './pages/CompressPage';
import ConvertPage from './pages/ConvertPage';
import WatermarkPage from './pages/WatermarkPage';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/merge', label: 'Merge' },
  { to: '/split', label: 'Split' },
  { to: '/compress', label: 'Compress' },
  { to: '/convert', label: 'Convert' },
  { to: '/watermark', label: 'Watermark' },
];

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Top navigation */}
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <NavLink to="/" className="text-xl font-extrabold text-gray-900">
              Doc<span className="text-brand-600">Ease</span>
            </NavLink>

            {/* Desktop nav */}
            <div className="hidden sm:flex gap-1">
              {NAV_LINKS.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-100 text-brand-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* Page content */}
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/merge" element={<MergePage />} />
            <Route path="/split" element={<SplitPage />} />
            <Route path="/compress" element={<CompressPage />} />
            <Route path="/convert" element={<ConvertPage />} />
            <Route path="/watermark" element={<WatermarkPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-400 py-6 border-t border-gray-100">
          © {new Date().getFullYear()} DocEase · All files auto-deleted after 1 hour
        </footer>
      </div>

      {/* Global toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{ duration: 4000, style: { fontSize: '14px' } }}
      />
    </Router>
  );
}

export default App;
