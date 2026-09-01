import { useEffect, useRef } from 'react';

const BRAND = ['#9B6DE9', '#7343C9', '#B28FF1', '#FF9900'];

/**
 * Ambient drifting motes on a canvas.
 *
 * Canvas rather than DOM nodes because this runs for hours unattended on a
 * booth machine, and a few dozen animated elements in the compositor is a
 * measurable battery and jank cost over that window. Honours
 * prefers-reduced-motion by not animating at all.
 */
export default function AnimatedBackground({ mood = 'calm' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    let particles = [];
    let dpr = 1;

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(Math.min(46, (w * h) / 34000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.9,
        vx: (Math.random() - 0.5) * 0.16,
        vy: -(Math.random() * 0.24 + 0.06),
        a: Math.random() * 0.32 + 0.08,
        c: BRAND[Math.floor(Math.random() * BRAND.length)],
      }));
    };

    const draw = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -12) { p.y = h + 12; p.x = Math.random() * w; }
        if (p.x < -12) p.x = w + 12;
        if (p.x > w + 12) p.x = -12;

        ctx.globalAlpha = p.a;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    build();
    if (reduced) {
      draw();
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }

    const onResize = () => { build(); };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className={`bg ${mood !== 'calm' ? `bg--${mood}` : ''}`} aria-hidden="true">
      <div className="bg__grid" />
      <canvas ref={canvasRef} className="bg__canvas" />
      <div className="bg__bloom" />
    </div>
  );
}
