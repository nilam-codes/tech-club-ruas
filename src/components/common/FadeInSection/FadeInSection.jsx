import React, { useRef, useEffect } from 'react';
import './FadeInSection.css';

export default function FadeInSection({ children, delay = 0 }) {
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    if (domRef.current) {
      observer.observe(domRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      className="fade-in-section" 
      ref={domRef} 
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
