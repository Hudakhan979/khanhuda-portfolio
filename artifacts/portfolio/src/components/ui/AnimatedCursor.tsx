import { useEffect, useRef } from 'react';

export function AnimatedCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseEnter = () => {
      if (dotRef.current && ringRef.current) {
        dotRef.current.style.opacity = '1';
        ringRef.current.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      if (dotRef.current && ringRef.current) {
        dotRef.current.style.opacity = '0';
        ringRef.current.style.opacity = '0';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    let rafId: number;
    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px)`;
      }

      // Lerp for ring with lag
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.08;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.08;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }

      // Check for hoverable elements
      const hoveredElement = document.elementFromPoint(mousePos.current.x, mousePos.current.y);
      const isHoverable = hoveredElement?.closest('button, a, [role="button"]');
      
      if (ringRef.current) {
        if (isHoverable) {
          ringRef.current.style.width = '48px';
          ringRef.current.style.height = '48px';
        } else {
          ringRef.current.style.width = '32px';
          ringRef.current.style.height = '32px';
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] w-2 h-2 rounded-full bg-primary opacity-0 transition-opacity duration-200"
        style={{ marginLeft: '-4px', marginTop: '-4px' }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] w-8 h-8 rounded-full border-2 border-primary/50 opacity-0 transition-[width,height,opacity] duration-200"
        style={{ marginLeft: '-16px', marginTop: '-16px' }}
      />
    </>
  );
}
