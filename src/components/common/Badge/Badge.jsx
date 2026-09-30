import React from 'react';
import './Badge.css';

export default function Badge({
  children,
  variant = 'cyan', // 'cyan' | 'violet' | 'emerald' | 'amber' | 'live' | 'neutral'
  size = 'md',      // 'sm' | 'md'
  icon: Icon,
  className = ''
}) {
  return (
    <span className={`badge badge-${variant} badge-${size} ${className}`}>
      {variant === 'live' && <span className="badge-live-dot" />}
      {Icon && <Icon size={size === 'sm' ? 12 : 14} className="badge-icon" />}
      <span className="badge-text">{children}</span>
    </span>
  );
}

