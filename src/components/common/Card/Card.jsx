import React from 'react';
import './Card.css';

export default function Card({
  children,
  className = '',
  interactive = false,
  glow = 'none', // 'cyan' | 'violet' | 'emerald' | 'none'
  padding = 'md', // 'sm' | 'md' | 'lg' | 'none'
  onClick,
  ...rest
}) {
  const classes = [
    'custom-card',
    'glass-panel',
    interactive ? 'glass-panel-interactive custom-card-interactive' : '',
    glow !== 'none' ? `card-glow-${glow}` : '',
    `card-padding-${padding}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={onClick} {...rest}>
      {children}
    </div>
  );
}

