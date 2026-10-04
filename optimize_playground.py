import re

with open('src/components/home/BuiltByClub/BuiltByClub.jsx', 'r') as f:
    content = f.read()

# Make sure intersection observer is used and canvas transform is reset
new_use_effect = '''  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    let width, height;
    let particles = [];
    let animationFrame;
    let isVisible = false;
    
    let mouse = { x: -1000, y: -1000 };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * 2;
      canvas.height = height * 2;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
      ctx.scale(2, 2);
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const numParticles = Math.min(60, Math.floor((width * height) / 10000));
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1
        });
      }
    };

    const draw = () => {
      if (!isVisible) {
        animationFrame = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.x -= dx * 0.05;
          p.y -= dy * 0.05;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(40, 40, 40, 0.4)';
        ctx.fill();
        
        for (let j = i + 1; j < particles.length; j++) {
          let p2 = particles[j];
          const ddx = p.x - p2.x;
          const ddy = p.y - p2.y;
          const ddist = Math.sqrt(ddx * ddx + ddy * ddy);
          
          if (ddist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            
            if (dist < 150) {
              ctx.strokeStyle = gba(255, 70, 18, );
            } else {
              ctx.strokeStyle = gba(40, 40, 40, );
            }
            ctx.stroke();
          }
        }
      }
      
      animationFrame = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => { mouse.x = -1000; mouse.y = -1000; };
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0 });
    observer.observe(container);

    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, []);'''

pattern = r'  useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);'
content = re.sub(pattern, new_use_effect, content)

with open('src/components/home/BuiltByClub/BuiltByClub.jsx', 'w') as f:
    f.write(content)
