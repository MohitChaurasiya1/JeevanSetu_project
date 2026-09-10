import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaHeartbeat } from 'react-icons/fa';
import { ROUTES } from '../../constants/routes';
import Button from '../common/Button';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: ROUTES.HOME },
    { name: 'About', path: ROUTES.ABOUT },
    { name: 'Diseases', path: ROUTES.DISEASES },
    { name: 'Contact', path: ROUTES.CONTACT },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-border">
      <nav aria-label="Main Navigation" className="page-container">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Brand / Logo */}
          <Link
            to={ROUTES.HOME}
            onClick={closeMobileMenu}
            className="flex items-center gap-2.5 text-primary hover:opacity-90 transition-opacity focus-visible:outline-primary"
            aria-label="JeevanSetu Home"
          >
            <div className="w-9 h-9 rounded-lg bg-primary-light/50 flex items-center justify-center text-primary">
              <FaHeartbeat className="w-5 h-5" aria-hidden="true" />
            </div>
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
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary bg-primary-light/30'
                      : 'text-text-secondary hover:text-primary hover:bg-slate-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right Auth Action Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <Link to={ROUTES.LOGIN} tabIndex={-1}>
              <Button variant="outline" className="text-xs lg:text-sm px-3.5 py-1.5">
                Login
              </Button>
            </Link>
            <Link to={ROUTES.REGISTER} tabIndex={-1}>
              <Button variant="primary" className="text-xs lg:text-sm px-3.5 py-1.5">
                Register
              </Button>
            </Link>
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
            </div>

            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <Link to={ROUTES.LOGIN} onClick={closeMobileMenu}>
                <Button variant="outline" className="w-full justify-center py-2.5">
                  Login
                </Button>
              </Link>
              <Link to={ROUTES.REGISTER} onClick={closeMobileMenu}>
                <Button variant="primary" className="w-full justify-center py-2.5">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
