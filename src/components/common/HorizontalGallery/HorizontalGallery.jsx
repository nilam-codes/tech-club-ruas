import React, { useRef, useEffect } from 'react';
import './HorizontalGallery.css';

export default function HorizontalGallery({ gallery, renderThumbnail }) {
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const scrollRef = useRef(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !stickyRef.current || !scrollRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      if (rect.top <= 0 && rect.bottom >= viewportHeight) {
        const scrollRange = rect.height - viewportHeight;
        const scrolled = Math.abs(rect.top);
        const progress = Math.min(1, Math.max(0, scrolled / scrollRange));
        
        const track = scrollRef.current;
        const maxScroll = track.scrollWidth - track.clientWidth;
        track.style.transform = `translateX(-${progress * maxScroll}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const numItems = gallery.length;
  const estimatedWidth = numItems * 400;
  const containerHeight = Math.max(window.innerHeight * 2, estimatedWidth);

  return (
    <div ref={containerRef} style={{ height: `${containerHeight}px`, position: 'relative' }}>
      <div ref={stickyRef} style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '100%', padding: '0 5vw' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>EVENT GALLERY</h3>
          
          <div style={{ overflow: 'hidden' }}>
            <div 
              ref={scrollRef} 
              style={{ 
                display: 'flex', 
                gap: '32px', 
                willChange: 'transform',
                width: 'max-content'
              }}
            >
              {gallery.map(photo => (
                <div 
                  key={photo.id} 
                  className="gallery-item-hover"
                  style={{ 
                    width: '350px', 
                    aspectRatio: '3/4', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    flexShrink: 0
                  }}
                >
                  {renderThumbnail(photo.image_url, 'Gallery')}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
