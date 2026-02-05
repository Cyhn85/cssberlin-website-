import React, { useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  variant?: 'global' | 'orange' | 'green'; // 'global' is subtle, others are intense for auth
  className?: string;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ variant = 'global', className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasSize = () => {
        if (canvas.parentElement) {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        } else {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 0.5;
        // Global is slower, Auth is more active
        const speedMultiplier = variant === 'global' ? 0.2 : 0.6;
        this.speedX = (Math.random() - 0.5) * speedMultiplier;
        this.speedY = (Math.random() - 0.5) * speedMultiplier;
        
        this.alpha = Math.random() * 0.5 + 0.1;
        
        if (variant === 'global') {
            // Subtle white/gray particles for main site
            this.color = `rgba(255, 255, 255, ${this.alpha * 0.3})`; 
        } else if (variant === 'orange') {
            // Floating embers for Login
            this.color = `rgba(255, 140, 66, ${this.alpha})`; 
        } else {
            // Floating spores for Register
            this.color = `rgba(22, 91, 51, ${this.alpha})`;
        }
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas!.width) this.x = 0;
        if (this.x < 0) this.x = canvas!.width;
        if (this.y > canvas!.height) this.y = 0;
        if (this.y < 0) this.y = canvas!.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Determine count based on area
    const area = canvas.width * canvas.height;
    const particleCount = variant === 'global' ? Math.floor(area / 25000) : 80;
    
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      cancelAnimationFrame(animationId);
    };
  }, [variant]);

  return <canvas ref={canvasRef} className={className} />;
};
