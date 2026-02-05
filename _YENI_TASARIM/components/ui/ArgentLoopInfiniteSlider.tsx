import * as React from "react";

interface SocialData {
  title: string;
  image: string;
  category: string;
  handle: string;
  description: string;
}

const SOCIAL_DATA: SocialData[] = [
  {
    title: "Instagram",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop",
    category: "Visual Stories",
    handle: "@css_berlin",
    description: "Daily Eco-Fashion Inspo",
  },
  {
    title: "LinkedIn",
    image: "https://images.unsplash.com/photo-1560179707-f14e90ef3dab?q=80&w=1974&auto=format&fit=crop",
    category: "Corporate",
    handle: "CSS Berlin GmbH",
    description: "Sustainability Reports",
  },
  {
    title: "TikTok",
    image: "https://images.unsplash.com/photo-1520466809213-7b9a56adcd45?q=80&w=1887&auto=format&fit=crop",
    category: "Viral Trends",
    handle: "@css_watch",
    description: "Behind the scenes",
  },
  {
    title: "Twitter / X",
    image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=1974&auto=format&fit=crop",
    category: "Updates",
    handle: "@css_support",
    description: "Real-time support",
  },
  {
    title: "Pinterest",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
    category: "Moodboards",
    handle: "CSS_Official",
    description: "Style curation",
  },
];

const CONFIG = {
  SCROLL_SPEED: 0.5, // Slower for container
  LERP_FACTOR: 0.08,
  BUFFER_SIZE: 5,
  MAX_VELOCITY: 100,
  SNAP_DURATION: 700,
};

// Utility functions
const lerp = (start: number, end: number, factor: number) =>
  start + (end - start) * factor;

const getSocialData = (index: number) => {
  const i =
    ((Math.abs(index) % SOCIAL_DATA.length) + SOCIAL_DATA.length) %
    SOCIAL_DATA.length;
  return SOCIAL_DATA[i];
};

export function ArgentLoopInfiniteSlider() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = React.useState({
    min: -CONFIG.BUFFER_SIZE,
    max: CONFIG.BUFFER_SIZE,
  });

  // Refs for state that changes frequently (animation loop)
  const state = React.useRef({
    currentY: 0,
    targetY: 0,
    isDragging: false,
    isSnapping: false,
    snapStart: { time: 0, y: 0, target: 0 },
    lastScrollTime: Date.now(),
    dragStart: { y: 0, scrollY: 0 },
    projectHeight: 0, 
    minimapHeight: 120, // Smaller minimap for the split view
  });

  // Refs to store DOM elements
  const projectsRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const requestRef = React.useRef<number | null>(null);

  // Helper to update parallax for a single item
  const updateParallax = (
    img: HTMLImageElement | null,
    scroll: number,
    index: number,
    height: number
  ) => {
    if (!img) return;
    
    if (!img.dataset.parallaxCurrent) {
      img.dataset.parallaxCurrent = "0";
    }
    
    let current = parseFloat(img.dataset.parallaxCurrent);
    const target = (-scroll - index * height) * 0.15; // Reduced parallax effect
    current = lerp(current, target, 0.1);
    
    if (Math.abs(current - target) > 0.01) {
        img.style.transform = `translateY(${current}px) scale(1.3)`;
        img.dataset.parallaxCurrent = current.toString();
    }
  };

  const updateSnap = () => {
    const s = state.current;
    const progress = Math.min(
      (Date.now() - s.snapStart.time) / CONFIG.SNAP_DURATION,
      1
    );
    const eased = 1 - Math.pow(1 - progress, 3);
    s.targetY =
      s.snapStart.y + (s.snapStart.target - s.snapStart.y) * eased;
    if (progress >= 1) s.isSnapping = false;
  };

  const snapToProject = () => {
    const s = state.current;
    const current = Math.round(-s.targetY / s.projectHeight);
    const target = -current * s.projectHeight;
    s.isSnapping = true;
    s.snapStart = {
      time: Date.now(),
      y: s.targetY,
      target: target,
    };
  };

  const updatePositions = () => {
    const s = state.current;
    
    // Update Projects
    projectsRef.current.forEach((el, index) => {
      const y = index * s.projectHeight + s.currentY;
      el.style.transform = `translateY(${y}px)`;
      const img = el.querySelector("img");
      updateParallax(img, s.currentY, index, s.projectHeight);
    });
  };

  const animate = () => {
    const s = state.current;
    const now = Date.now();

    if (!s.isSnapping && !s.isDragging && now - s.lastScrollTime > 100) {
      const snapPoint =
        -Math.round(-s.targetY / s.projectHeight) * s.projectHeight;
      if (Math.abs(s.targetY - snapPoint) > 1) snapToProject();
    }

    if (s.isSnapping) updateSnap();
    if (!s.isDragging) {
      s.currentY += (s.targetY - s.currentY) * CONFIG.LERP_FACTOR;
    }

    updatePositions();
  };
  
  const renderedRange = React.useRef({ min: -CONFIG.BUFFER_SIZE, max: CONFIG.BUFFER_SIZE });

  const animationLoop = () => {
     animate();
     
     const s = state.current;
     // Prevent division by zero
     if (s.projectHeight > 0) {
        const currentIndex = Math.round(-s.targetY / s.projectHeight);
        const min = currentIndex - CONFIG.BUFFER_SIZE;
        const max = currentIndex + CONFIG.BUFFER_SIZE;

        if (min !== renderedRange.current.min || max !== renderedRange.current.max) {
            renderedRange.current = { min, max };
            setVisibleRange({ min, max });
        }
     }

     requestRef.current = requestAnimationFrame(animationLoop);
  };

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
      // Logic to determine if it was a click or a drag is handled by the state.isDragging
      // But for simplicity, we let the inner onClick fire if the drag distance was small.
      // Since this is a specialized slider, we will attach a direct handler to the item 
      // and assume if drag didn't happen, it's a click.
  };

  const handleClick = (handle: string) => {
      if (state.current.isDragging) return;
      // Simulate navigation
      console.log(`Navigating to Social Hub: ${handle}`);
      // In a real app: history.push(`/social/${handle}`)
      window.location.hash = `#social-hub-profile`;
  };

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
        if (container) {
            state.current.projectHeight = container.clientHeight;
        }
    };
    updateDimensions();
    
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const s = state.current;
      s.isSnapping = false;
      s.lastScrollTime = Date.now();
      const delta = Math.max(
        Math.min(e.deltaY * CONFIG.SCROLL_SPEED, CONFIG.MAX_VELOCITY),
        -CONFIG.MAX_VELOCITY
      );
      s.targetY -= delta;
    };

    const onTouchStart = (e: TouchEvent) => {
        const s = state.current;
        s.isDragging = true;
        s.isSnapping = false;
        s.dragStart = { y: e.touches[0].clientY, scrollY: s.targetY };
        s.lastScrollTime = Date.now();
    }

    const onTouchMove = (e: TouchEvent) => {
        const s = state.current;
        if (!s.isDragging) return;
        // Prevent default window scrolling when dragging inside this component
        if(e.cancelable) e.preventDefault(); 
        
        s.targetY =
            s.dragStart.scrollY +
            (e.touches[0].clientY - s.dragStart.y) * 1.5;
        s.lastScrollTime = Date.now();
    }

    const onTouchEnd = () => {
        state.current.isDragging = false;
    }

    // Bind events to container, not window
    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart, { passive: false });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd);
    
    window.addEventListener("resize", updateDimensions);
    
    // Start Loop
    requestRef.current = requestAnimationFrame(animationLoop);

    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", updateDimensions);
      if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Generate range of indices
  const indices = [];
  for (let i = visibleRange.min; i <= visibleRange.max; i++) {
    indices.push(i);
  }

  return (
    <div className="relative w-full h-full overflow-hidden rounded-[24px] bg-black group select-none cursor-pointer active:cursor-grabbing" ref={containerRef}>
      
      {/* Styles injected locally for this component to maintain specific logic */}
      <style>{`
        .social-slider-item {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          will-change: transform;
        }
        .social-slider-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            will-change: transform;
        }
      `}</style>

      {/* Main List */}
      <div className="absolute inset-0 pointer-events-none">
        {indices.map((i) => {
          const data = getSocialData(i);
          return (
            <div
              key={i}
              className="social-slider-item pointer-events-auto"
              ref={(el) => {
                if (el) projectsRef.current.set(i, el);
                else projectsRef.current.delete(i);
              }}
              onClick={() => handleClick(data.handle)}
            >
              <img src={data.image} alt={data.title} className="social-slider-img opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 p-6 text-center">
                 <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange mb-2">{data.category}</span>
                 <h2 className="text-4xl md:text-5xl font-heading font-black mb-2">{data.title}</h2>
                 <p className="text-sm font-medium opacity-80">{data.handle}</p>
                 <button 
                    className="mt-6 px-4 py-2 border border-white/30 rounded-full text-xs hover:bg-white hover:text-black transition-colors pointer-events-auto"
                 >
                    Folgen
                 </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Label */}
      <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 pointer-events-none">
        <span className="text-[10px] font-bold text-white uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
            Social Hub
        </span>
      </div>

    </div>
  );
}