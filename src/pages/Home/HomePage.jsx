import React from 'react';
import Hero from '../../components/home/Hero/Hero';
import CuriositySection from '../../components/home/CuriositySection/CuriositySection';
import UpcomingEvent from '../../components/home/UpcomingEvent/UpcomingEvent';
import WinnerSection from '../../components/home/WinnerSection/WinnerSection';
import WhatWeDo from '../../components/home/WhatWeDo/WhatWeDo';
import FeaturedEvents from '../../components/home/FeaturedEvents/FeaturedEvents';
import PastEventsSection from '../../components/home/PastEventsSection/PastEventsSection';
import ProjectShowcase from '../../components/home/ProjectShowcase/ProjectShowcase';
import TeamSpotlight from '../../components/home/TeamSpotlight/TeamSpotlight';
import SocialCTA from '../../components/home/SocialCTA/SocialCTA';
import BuiltByClub from '../../components/home/BuiltByClub/BuiltByClub';

export default function HomePage({ onNavigate }) {
  return (
    <div className="home-page">
      {/* Hero section */}
      <Hero onNavigate={onNavigate} />

      <CuriositySection />

      {/* SECTION 01 — WHAT WE DO */}
      {/* WINNER OF OUR FIRST EVENT */}
      <WinnerSection />
      
      <WhatWeDo />

      {/* SECTION 02 — UP NEXT */}
      <UpcomingEvent onNavigate={onNavigate} />

      {/* 5. Upcoming / Recent Events (Clean chronological event list) */}
      <FeaturedEvents onNavigate={onNavigate} />

      {/* 5b. Past Events Archive */}
      <PastEventsSection onNavigate={onNavigate} />

      {/* 6. Student Projects / Club Work (Visual project showcase) */}
      <ProjectShowcase />

      {/* 7. Team introduction */}
      <TeamSpotlight onNavigate={onNavigate} />

      {/* 8. Social CTA */}
      <SocialCTA onNavigate={onNavigate} />
    </div>
  );
}
