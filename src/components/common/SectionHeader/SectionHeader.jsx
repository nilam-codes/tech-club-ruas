import React from 'react';
import './SectionHeader.css';

export default function SectionHeader({
  index,
  category,
  title,
  subtitle,
  align = 'left',
  className = ''
}) {
  return (
    <div className={`section-header section-header-${align} ${className}`}>
      {(index || category) && (
        <div className="section-index">
          <span className="section-index-cat">$ ./{category.toLowerCase().replace(/ /g, '-')}</span>
        </div>
      )}
      <h2 className="section-header-title">{title}</h2>
      {subtitle && <p className="section-header-subtitle">{subtitle}</p>}
    </div>
  );
}
