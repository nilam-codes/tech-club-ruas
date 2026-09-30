import React from 'react';
import { Camera } from 'lucide-react';
import './ImagePlaceholder.css';

export default function ImagePlaceholder({
  aspectRatio = '16/9', // '16/9' | '4/3' | '3/2' | '1/1'
  label = 'Club Activity / Workshop Photo',
  sublabel = 'Replace with actual club photograph',
  className = ''
}) {
  return (
    <div 
      className={`img-placeholder-frame aspect-${aspectRatio.replace('/', '-')} ${className}`}
      role="img"
      aria-label={`${label} — ${sublabel}`}
    >
      <div className="img-placeholder-grid-lines" aria-hidden="true" />
      <div className="img-placeholder-content">
        <div className="img-placeholder-icon-box">
          <Camera size={20} />
        </div>
        <div className="img-placeholder-text">
          <span className="img-placeholder-label">[ {label} ]</span>
          <span className="img-placeholder-sublabel">{sublabel}</span>
        </div>
      </div>
      <div className="img-placeholder-corner-marker top-left" aria-hidden="true" />
      <div className="img-placeholder-corner-marker top-right" aria-hidden="true" />
      <div className="img-placeholder-corner-marker bottom-left" aria-hidden="true" />
      <div className="img-placeholder-corner-marker bottom-right" aria-hidden="true" />
    </div>
  );
}

