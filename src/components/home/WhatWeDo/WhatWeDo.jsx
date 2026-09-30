import React from 'react';
import SectionHeader from '../../common/SectionHeader/SectionHeader';
import './WhatWeDo.css';

const PILLARS = [
  {
    num: "01",
    title: "BUILD",
    description: "Turn ideas into working projects and experiments."
  },
  {
    num: "02",
    title: "LEARN",
    description: "Workshops, discussions and hands-on technical sessions."
  },
  {
    num: "03",
    title: "COMPETE",
    description: "Challenges, hackathons and technical competitions."
  },
  {
    num: "04",
    title: "CONNECT",
    description: "Meet students who are curious about technology."
  }
];

export default function WhatWeDo() {
  return (
    <section className="what-we-do-section section" id="what-we-do">
      <div className="container">
        <SectionHeader
          index="01"
          category="WHAT WE DO"
          title="Technology is better when you build it together."
        />

        <div className="what-we-do-grid">
          {PILLARS.map((pillar) => (
            <div key={pillar.num} className="what-we-do-column">
              <div className="pillar-num">{pillar.num}</div>
              <h3 className="pillar-title">{pillar.title}</h3>
              <p className="pillar-desc">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

