import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { CLUB_INFO } from '../../../data/clubInfo';
import { NAV_LINKS } from '../../../data/navigation';
import Button from '../../common/Button/Button';
import './Navbar.css';

export default function Navbar({ activePage = 'home', onNavigate }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (id) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
    }
  };

  return (
    <header className={`navbar-wrapper ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-container">
        {/* Brand / Logo */}
        <button 
          type="button"
          className="navbar-brand" 
          onClick={() => handleLinkClick('home')}
        >
          <span className="navbar-brand-name">{CLUB_INFO.name}</span>
          <span className="navbar-brand-col">{CLUB_INFO.college}</span>
        </button>

        {/* Desktop Nav Links */}
        <nav className="navbar-nav-desktop" aria-label="Main Navigation">
          {NAV_LINKS.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                type="button"
                className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                onClick={() => handleLinkClick(link.id)}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="navbar-actions-desktop" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button
            type="button"
            style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            onClick={() => handleLinkClick('admin/login')}
          >
            Admin Login
          </button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleLinkClick('contact')}
          >
            Join Club
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="navbar-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-drawer">
          <nav className="navbar-mobile-links">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                className={`mobile-nav-link ${activePage === link.id ? 'mobile-nav-link-active' : ''}`}
                onClick={() => handleLinkClick(link.id)}
              >
                {link.label}
              </button>
            ))}
          </nav>
          <div className="navbar-mobile-actions" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => handleLinkClick('contact')}
            >
              Join Club
            </Button>
            <button
              type="button"
              style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center', width: '100%', padding: '8px 0' }}
              onClick={() => handleLinkClick('admin/login')}
            >
              Admin Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
