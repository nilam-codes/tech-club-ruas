import React from 'react';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

export default function Layout({ activePage, onNavigate, children }) {
  return (
    <div className="app-layout">
      {/* Minimal Sticky Navigation */}
      <Navbar activePage={activePage} onNavigate={onNavigate} />

      {/* Main Page View */}
      <main style={{ paddingTop: 'var(--nav-height)', minHeight: 'calc(100vh - var(--nav-height))' }}>
        {children}
      </main>

      {/* Minimal Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
