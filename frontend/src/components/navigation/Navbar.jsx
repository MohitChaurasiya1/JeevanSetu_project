import React, { useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { FiLogOut, FiLayout } from 'react-icons/fi';
import { ROUTES } from '../../constants/routes';
import { AuthContext } from '../../context/AuthContext';
import { getHomeRouteForUser, isAdminRole } from '../../utils/roleUtils';
import Button from '../common/Button';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    closeMobileMenu();
    logout();
    navigate(ROUTES.LOGIN);
  };

  const navLinks = [
    { name: 'Home', path: ROUTES.HOME },
    { name: 'About', path: ROUTES.ABOUT },
    { name: 'Diseases', path: ROUTES.DISEASES },
    { name: 'Contact', path: ROUTES.CONTACT },
  ];

  const homeDashboardRoute = getHomeRouteForUser(user);
  const isAdmin = isAdminRole(user);

  return (
    <header className="sticky top-0 z-40 w-full bg-green-100 border-b border-border">
      <nav aria-label="Main Navigation" className="page-container">
        <div className="flex items-center justify-between h-16 md:h-18">

          {/* Brand / Logo */}
          <Link
            to={ROUTES.HOME}
            onClick={closeMobileMenu}
            className="flex items-center gap-2.5 text-primary hover:opacity-90 hover:scale-105 transition-all duration-200 focus-visible:outline-primary"
            aria-label="JeevanSetu Home"
          >
            <img
              src="/Logo.jpeg"
              alt="JeevanSetu"
              className="w-10 h-10 object-contain"
            />

            <span className="text-xl font-bold tracking-tight text-text">
              Jeevan<span className="text-primary">Setu</span>
            </span>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === ROUTES.HOME}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium nav-link-animated transition-colors duration-200 ${
                    isActive
                      ? 'text-primary bg-primary-light/30 font-semibold'
                      : 'text-text-secondary hover:text-primary'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

          </div>

          {/* Right Auth Action Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to={homeDashboardRoute} tabIndex={-1}>
                  <Button
                    variant="primary"
                    className="text-xs lg:text-sm px-3.5 py-1.5 transition-all duration-200 flex items-center gap-1.5"
                  >
                    <FiLayout className="w-4 h-4" />
                    <span>{isAdmin ? 'Admin Portal' : 'Dashboard'}</span>
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="text-xs lg:text-sm px-3 py-1.5 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors flex items-center gap-1.5"
                >
                  <FiLogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} tabIndex={-1}>
                  <Button
                    variant="outline"
                    className="text-xs lg:text-sm px-3.5 py-1.5 transition-colors duration-200 hover:border-primary hover:text-primary"
                  >
                    Login
                  </Button>
                </Link>

                <Link to={ROUTES.REGISTER} tabIndex={-1}>
                  <Button
                    variant="primary"
                    className="text-xs lg:text-sm px-3.5 py-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-menu"
              className="p-2 rounded-lg text-text-secondary hover:text-text hover:bg-slate-100 transition-colors focus-visible:outline-primary"
            >
              {mobileMenuOpen ? (
                <HiX className="w-6 h-6" aria-hidden="true" />
              ) : (
                <HiMenu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu Dropdown */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation-menu"
            className="md:hidden border-t border-border py-4 space-y-3 bg-white"
          >
            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === ROUTES.HOME}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? 'text-primary bg-primary-light/40 font-semibold'
                        : 'text-text-secondary hover:text-primary hover:bg-slate-50'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {isAuthenticated && (
                <NavLink
                  to={homeDashboardRoute}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? 'text-primary bg-primary-light/40 font-semibold'
                        : 'text-text-secondary hover:text-primary hover:bg-slate-50'
                    }`
                  }
                >
                  {isAdmin ? 'Admin Portal' : 'Dashboard'}
                </NavLink>
              )}
            </div>

            {/* Mobile Auth Buttons */}
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full justify-center py-2.5 text-red-600 border-red-200 hover:bg-red-50"
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Link
                    to={ROUTES.LOGIN}
                    onClick={closeMobileMenu}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-center py-2.5"
                    >
                      Login
                    </Button>
                  </Link>

                  <Link
                    to={ROUTES.REGISTER}
                    onClick={closeMobileMenu}
                  >
                    <Button
                      variant="primary"
                      className="w-full justify-center py-2.5"
                    >
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;