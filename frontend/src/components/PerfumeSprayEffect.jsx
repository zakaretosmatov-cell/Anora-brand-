import React, { useEffect, useRef } from 'react';

const PerfumeSprayEffect = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // Particle object class representation
    class Particle {
      constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2.5 + 0.8; // fine perfume mist size (0.8px to 3.3px)
        
        // Spray angle mirroring user's drawn lines
        // Left side sprays down-right (e.g., angle 15 to 45 degrees)
        // Right side sprays down-left (e.g., angle 135 to 165 degrees)
        let angle;
        if (direction === 'left') {
          angle = (Math.random() * 30 + 15) * (Math.PI / 180); 
        } else {
          angle = (Math.random() * 30 + 135) * (Math.PI / 180); 
        }
        
        const speed = Math.random() * 8 + 6; // high initial velocity
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 0.9;
        this.decay = Math.random() * 0.015 + 0.012; // gradual dispersion
        
        // Random golden hues representing elegant fragrance droplets
        const goldHues = [
          'rgba(212, 175, 55, ',  // metallic gold
          'rgba(243, 229, 171, ',  // vanilla cream gold
          'rgba(255, 239, 150, ',  // bright glowing gold
          'rgba(255, 255, 255, '   // pure white ambient drop
        ];
        this.colorPrefix = goldHues[Math.floor(Math.random() * goldHues.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Drag physics (simulates air friction slowing down mist)
        this.vx *= 0.95;
        this.vy *= 0.95;
        
        // Gravity effect: slow downward drift of heavy particles
        this.vy += 0.08;
        
        // Alpha decay (mist evaporating)
        this.alpha -= this.decay;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.colorPrefix}${Math.max(0, this.alpha)})`;
        
        // Ambient glow to make it look like a mist under lights
        ctx.shadowBlur = 3;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.3)';
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }
    }

    const spawnSpray = (amount) => {
      // Spawn sprays from left and right edges at various heights in the active viewport
      for (let i = 0; i < amount; i++) {
        // Random Y coordinates along the top and middle parts of the screen
        const leftY = Math.random() * (window.innerHeight * 0.7) + (window.innerHeight * 0.1);
        const rightY = Math.random() * (window.innerHeight * 0.7) + (window.innerHeight * 0.1);
        
        // Left side spray (pointing down-right)
        particlesRef.current.push(new Particle(0, leftY, 'left'));
        // Right side spray (pointing down-left)
        particlesRef.current.push(new Particle(window.innerWidth, rightY, 'right'));
      }
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDiff = Math.abs(currentScrollY - lastScrollY.current);

      if (scrollDiff > 2) {
        // Spawn more particles if scroll speed is faster
        const spawnCount = Math.min(6, Math.floor(scrollDiff / 4) + 1);
        spawnSpray(spawnCount);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    let animationFrameId;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();
        
        // Remove dead particles
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'screen'
      }}
    />
  );
};

export default PerfumeSprayEffect;
