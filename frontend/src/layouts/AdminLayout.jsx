import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/navigation/AdminSidebar';
import AdminTopbar from '../components/navigation/AdminTopbar';

const AdminLayout = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  // Close mobile drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && mobileDrawerOpen) {
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileDrawerOpen]);

  return (
    <div className="min-h-screen bg-background flex text-text">
      {/* ==================================================
          DESKTOP SIDEBAR (lg+)
          ================================================== */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-30">
        <AdminSidebar />
      </div>

      {/* ==================================================
          MOBILE DRAWER BACKDROP & SLIDE-IN SIDEBAR (<lg)
          ================================================== */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setMobileDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed top-0 left-0 bottom-0 w-64 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminSidebar
          onClose={() => setMobileDrawerOpen(false)}
          onItemClick={() => setMobileDrawerOpen(false)}
        />
      </div>

      {/* ==================================================
          MAIN CONTENT WRAPPER
          ================================================== */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <AdminTopbar onToggleSidebar={() => setMobileDrawerOpen((prev) => !prev)} />

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
