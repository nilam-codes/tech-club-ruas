import React, { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import HomePage from './pages/Home/HomePage';
import AboutPage from './pages/About/AboutPage';
import EventsPage from './pages/Events/EventsPage';
import EventDetailPage from './pages/Events/EventDetailPage';
import TeamPage from './pages/Team/TeamPage';
import ContactPage from './pages/Contact/ContactPage';
import CookedWithoutCodePage from './pages/CookedWithoutCode/CookedWithoutCodePage';
import CookedWithoutCodeGamePage from './pages/CookedWithoutCode/CookedWithoutCodeGamePage';
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import AdminLoginPage from './pages/Admin/AdminLoginPage';
import AdminForgotPasswordPage from './pages/Admin/AdminForgotPasswordPage';
import AdminResetPasswordPage from './pages/Admin/AdminResetPasswordPage';
import PastEventsPage from './pages/Archive/PastEventsPage';
import ArchiveDetailPage from './pages/Archive/ArchiveDetailPage';

export default function App() {
  const getInitialPage = () => {
    if (window.location.hash.includes('type=recovery')) return 'admin/reset-password';
    const rawHash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    
    if (rawHash === 'events/cooked-without-code/game' || rawHash === 'cooked-without-code/game') return 'cooked-without-code-game';
    if (rawHash === 'events/ai-challenge' || rawHash === 'ai-challenge' || rawHash === 'events/cooked-without-code' || rawHash === 'cooked-without-code') return 'cooked-without-code';
    if (rawHash === 'admin') return 'admin';
    if (rawHash === 'admin/login') return 'admin/login';
    if (rawHash === 'past-events') return 'past-events';
    if (rawHash.startsWith('archive/')) return rawHash;
    if (rawHash.startsWith('event/')) return rawHash;
    
    const validPages = ['home', 'about', 'events', 'team', 'contact', 'admin', 'admin/login', 'admin/forgot-password', 'admin/reset-password', 'past-events'];
    return validPages.includes(rawHash) ? rawHash : 'home';
  };

  const [activePage, setActivePage] = useState(getInitialPage);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.includes('type=recovery')) {
        setActivePage('admin/reset-password');
        return;
      }
      const rawHash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      
      if (rawHash === 'events/cooked-without-code/game' || rawHash === 'cooked-without-code/game') {
        setActivePage('cooked-without-code-game');
        return;
      }
      if (rawHash === 'events/ai-challenge' || rawHash === 'ai-challenge' || rawHash === 'events/cooked-without-code' || rawHash === 'cooked-without-code') {
        setActivePage('cooked-without-code');
        return;
      }
      if (rawHash === 'admin') {
        setActivePage('admin');
        return;
      }
      if (rawHash === 'admin/login') {
        setActivePage('admin/login');
        return;
      }
      if (rawHash === 'past-events') {
        setActivePage('past-events');
        return;
      }
      if (rawHash.startsWith('archive/')) {
        setActivePage(rawHash);
        return;
      }
      if (rawHash.startsWith('event/')) {
        setActivePage(rawHash);
        return;
      }
      const validPages = ['home', 'about', 'events', 'team', 'contact', 'admin', 'admin/login', 'admin/forgot-password', 'admin/reset-password', 'past-events'];
      if (validPages.includes(rawHash)) {
        setActivePage(rawHash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToPage = (pageId) => {
    if (pageId === 'cooked-without-code-game' || pageId === '/events/cooked-without-code/game' || pageId === 'events/cooked-without-code/game') {
      setActivePage('cooked-without-code-game');
      window.location.hash = '/events/cooked-without-code/game';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const isCooked = pageId === 'ai-challenge' || pageId === '/events/ai-challenge' || pageId === 'events/ai-challenge' || pageId === 'cooked-without-code' || pageId === '/events/cooked-without-code' || pageId === 'events/cooked-without-code';
    const targetPage = isCooked ? 'cooked-without-code' : pageId;
    setActivePage(targetPage);
    window.location.hash = isCooked ? '/events/cooked-without-code' : targetPage;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    if (activePage.startsWith('archive/')) {
      const eventId = activePage.split('/')[1];
      return <ArchiveDetailPage eventId={eventId} onNavigate={navigateToPage} />;
    }
    
    if (activePage.startsWith('event/')) {
      const eventId = activePage.split('/')[1];
      return <EventDetailPage eventId={eventId} onNavigate={navigateToPage} />;
    }

    switch (activePage) {
      case 'about':
        return <AboutPage onNavigate={navigateToPage} />;
      case 'events':
        return <EventsPage onNavigate={navigateToPage} />;
      case 'past-events':
        return <PastEventsPage onNavigate={navigateToPage} />;
      case 'team':
        return <TeamPage onNavigate={navigateToPage} />;
      case 'contact':
        return <ContactPage onNavigate={navigateToPage} />;
      case 'cooked-without-code':
        return <CookedWithoutCodePage onNavigate={navigateToPage} />;
      case 'cooked-without-code-game':
        return <CookedWithoutCodeGamePage onNavigate={navigateToPage} />;
      case 'admin':
        return <AdminDashboardPage onNavigate={navigateToPage} />;
      case 'admin/forgot-password':
          return <AdminForgotPasswordPage onNavigate={navigateToPage} />;
        case 'admin/reset-password':
          return <AdminResetPasswordPage onNavigate={navigateToPage} />;
        case 'admin/login':
        return <AdminLoginPage onNavigate={navigateToPage} />;
      case 'home':
      default:
        return <HomePage onNavigate={navigateToPage} />;
    }
  };

  return (
    <Layout activePage={activePage} onNavigate={navigateToPage}>
      {renderPage()}
    </Layout>
  );
}
