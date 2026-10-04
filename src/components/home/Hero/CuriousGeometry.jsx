import React, { useRef, useEffect } from 'react';

export default function CuriousGeometry() {
  const canvasRef = useRef(null);
  const reqRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    let width, height;
    let isVisible = true;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * 2;
      canvas.height = height * 2;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
      ctx.scale(2, 2);
    };

    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => {
      if (!isVisible) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / width;
      const y = (e.clientY - rect.top) / height;
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };
    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0.5;
      mouseRef.current.targetY = 0.5;
    };
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0 });
    observer.observe(container);

    const draw = () => {
      if (!isVisible || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        reqRef.current = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, width, height);
      
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      
      timeRef.current += 0.002;
      const t = timeRef.current;
      
      const cx = width / 2;
      const cy = height / 2;
      const size = Math.min(width, height) * 0.4;
      
      const mouseOffsetX = (mouseRef.current.x - 0.5) * 50;
      const mouseOffsetY = (mouseRef.current.y - 0.5) * 50;
      
      const points = [];
      const numRings = 5;
      const numPoints = 12;

      for (let i = 0; i < numRings; i++) {
        const ringZ = (i / numRings - 0.5) * 2;
        const ringRadius = Math.sqrt(1 - ringZ * ringZ) * size;
        
        for (let j = 0; j < numPoints; j++) {
          const angle = (j / numPoints) * Math.PI * 2 + t * (i % 2 === 0 ? 1 : -1);
          
          let x3d = Math.cos(angle) * ringRadius;
          let y3d = Math.sin(angle) * ringRadius;
          let z3d = ringZ * size;
          
          const rotY = mouseOffsetX * 0.02 + t;
          const rotX = mouseOffsetY * 0.02;
          
          let x2 = x3d * Math.cos(rotY) - z3d * Math.sin(rotY);
          let z2 = z3d * Math.cos(rotY) + x3d * Math.sin(rotY);
          
          let y2 = y3d * Math.cos(rotX) - z2 * Math.sin(rotX);
          let z3 = z2 * Math.cos(rotX) + y3d * Math.sin(rotX);
          
          const perspective = 800;
          const scale = perspective / (perspective + z3);
          
          const finalX = cx + x2 * scale;
          const finalY = cy + y2 * scale;
          
          points.push({ x: finalX, y: finalY, z: z3, ring: i, idx: j });
        }
      }
      
      ctx.lineWidth = 1;
      
      for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        
        if (p1.idx < numPoints - 1) {
          const p2 = points[i + 1];
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = 'rgba(0, 245, 255, ' + (0.2 + (p1.z + size) / (2 * size) * 0.4) + ')';
                  ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 245, 255, 0.5)';
        ctx.stroke();
        ctx.shadowBlur = 0;
        } else {
           const p2 = points[i - numPoints + 1];
           ctx.beginPath();
           ctx.moveTo(p1.x, p1.y);
           ctx.lineTo(p2.x, p2.y);
           ctx.strokeStyle = 'rgba(0, 245, 255, ' + (0.2 + (p1.z + size) / (2 * size) * 0.4) + ')';
                   ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 245, 255, 0.5)';
        ctx.stroke();
        ctx.shadowBlur = 0;
        }
        
        if (p1.ring < numRings - 1) {
          const p3 = points[i + numPoints];
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.strokeStyle = 'rgba(57, 255, 20, ' + (0.1 + (p1.z + size) / (2 * size) * 0.2) + ')';
                  ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 245, 255, 0.5)';
        ctx.stroke();
        ctx.shadowBlur = 0;
        }
        
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(57, 255, 20, ' + (0.4 + (p1.z + size) / (2 * size) * 0.6) + ')';
        ctx.fill();
      }

      reqRef.current = requestAnimationFrame(draw);
    };
    
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
      cancelAnimationFrame(reqRef.current);
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', cursor: 'crosshair', background: 'transparent' }}>
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
