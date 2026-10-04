import React from 'react';
import TeamSpotlight from '../../components/home/TeamSpotlight/TeamSpotlight';

export default function TeamPage({ onNavigate }) {
  return (
    <div className="team-page" style={{ paddingTop: '4rem', paddingBottom: '2rem' }}>
      <TeamSpotlight />
    </div>
  );
}
