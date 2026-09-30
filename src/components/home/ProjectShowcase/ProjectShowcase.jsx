import React from 'react';
import { PROJECTS_LIST } from '../../../data/projectsData';
import SectionHeader from '../../common/SectionHeader/SectionHeader';
import ImagePlaceholder from '../../common/ImagePlaceholder/ImagePlaceholder';
import './ProjectShowcase.css';

export default function ProjectShowcase() {
  return (
    <section className="project-showcase-section section" id="projects">
      <div className="container">
        <SectionHeader
          index="04"
          category="SELECTED WORK"
          title="Student Projects & Club Work"
          subtitle="A showcase of software utilities, open-source repositories, and technical prototypes built by club members."
        />

        <div className="project-showcase-grid">
          {PROJECTS_LIST.map((project) => (
            <div key={project.id} className="project-card flat-panel">
              {/* Visual Project Frame Placeholder */}
              <div className="project-image-box">
                <ImagePlaceholder
                  aspectRatio="16/9"
                  label="Project Screenshot / Interface"
                  sublabel="Reserved for actual project UI or repository preview"
                  className="project-frame"
                />
              </div>

              {/* Project Meta & Details */}
              <div className="project-details">
                <div className="project-domain-tag">
                  <span>{project.domain}</span>
                </div>

                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.description}</p>

                <div className="project-tags-row">
                  {project.tags.map((tag, idx) => (
                    <span key={idx} className="project-tag">{tag}</span>
                  ))}
                </div>

                <div className="project-links-row">
                  <span className="project-placeholder-link">
                    {project.githubLink}
                  </span>
                  <span className="project-placeholder-divider">•</span>
                  <span className="project-placeholder-link">
                    {project.demoLink}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

