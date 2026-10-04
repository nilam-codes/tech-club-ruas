import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { isVideoFile } from '../../../services/archiveService';
import './MediaLightbox.css';

export default function MediaLightbox({ url, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!url) return null;

  const isVideo = isVideoFile(url);

  return (
    <div className="media-lightbox-overlay" onClick={onClose}>
      <button className="media-lightbox-close" onClick={onClose}>
        <X size={32} />
      </button>
      
      <div className="media-lightbox-content" onClick={e => e.stopPropagation()}>
        {isVideo ? (
          <video 
            src={url} 
            controls 
            autoPlay 
            muted 
            playsInline
            className="media-lightbox-video"
          />
        ) : (
          <img 
            src={url} 
            alt="Full Preview" 
            className="media-lightbox-image"
          />
        )}
      </div>
    </div>
  );
}
