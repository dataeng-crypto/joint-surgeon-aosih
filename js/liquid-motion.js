/**
 * ==============================================================================
 * AOSIH MASTER LIQUID MOTION CONTROLLER
 * Advance Orthopedic & Sports Injury Hospital | Dr. Naveen Sharma
 * Fluid Canvas Shader, GSAP ScrollTrigger, Wave Morphing, Liquid Micro-Interactions
 * 100% Native Scroll Performance (Zero Scroll Hijacking)
 * ==============================================================================
 */

(function() {
  'use strict';

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  // 1. Smooth In-Page Anchor Navigation (Preserves 100% native wheel/touch scroll)
  function initAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (!href || href === '#' || href.length < 2) return;
        try {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            const headerOffset = 78;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: isReducedMotion ? 'auto' : 'smooth'
            });
          }
        } catch (err) {
          // Ignore invalid selectors
        }
      });
    });
  }

  // 2. Interactive Fluid Canvas Shader (Hero & Banners)
  function initFluidCanvas() {
    if (isReducedMotion) return;

    const targets = document.querySelectorAll('.hero-hospital, .page-banner');
    if (!targets.length) return;

    targets.forEach((target) => {
      let container = target.querySelector('.liquid-canvas-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'liquid-canvas-container';
        target.prepend(container);
      }

      const canvas = document.createElement('canvas');
      canvas.className = 'liquid-bg-canvas';
      container.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let width = 0, height = 0;
      let animationFrameId = null;
      let isVisible = false;

      const nodes = [
        { x: 0.25, y: 0.35, r: 240, vx: 0.0007, vy: 0.0009, color: 'rgba(0, 151, 167, 0.45)' },
        { x: 0.75, y: 0.65, r: 280, vx: -0.0008, vy: 0.0006, color: 'rgba(77, 208, 225, 0.35)' },
        { x: 0.50, y: 0.50, r: 210, vx: 0.0009, vy: -0.0008, color: 'rgba(21, 101, 192, 0.38)' }
      ];

      let mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };

      function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const rect = target.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
      }

      resize();
      window.addEventListener('resize', resize, { passive: true });

      if (!isTouchDevice) {
        target.addEventListener('mousemove', (e) => {
          const rect = target.getBoundingClientRect();
          mouse.targetX = (e.clientX - rect.left) / width;
          mouse.targetY = (e.clientY - rect.top) / height;
        }, { passive: true });
      }

      let time = 0;

      function render() {
        if (!isVisible) return;
        time += 0.015;

        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        ctx.clearRect(0, 0, width, height);

        nodes.forEach((node, i) => {
          const oscX = Math.sin(time * 0.7 + i * 2) * 0.08;
          const oscY = Math.cos(time * 0.8 + i * 2) * 0.08;

          const currentX = (node.x + oscX + (mouse.x - 0.5) * 0.15) * width;
          const currentY = (node.y + oscY + (mouse.y - 0.5) * 0.15) * height;

          const grad = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, node.r);
          grad.addColorStop(0, node.color);
          grad.addColorStop(1, 'rgba(10, 37, 64, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(currentX, currentY, node.r, 0, Math.PI * 2);
          ctx.fill();
        });

        animationFrameId = requestAnimationFrame(render);
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(render);
          } else {
            cancelAnimationFrame(animationFrameId);
          }
        });
      }, { threshold: 0.05 });

      observer.observe(target);
    });
  }

  // 3. SVG Liquid Wave Divider Morpher
  function initLiquidWaves() {
    const waveDividers = document.querySelectorAll('.liquid-wave-divider svg');
    if (!waveDividers.length || isReducedMotion) return;

    waveDividers.forEach((svg) => {
      const paths = svg.querySelectorAll('.liquid-wave-path');
      if (!paths.length) return;

      let phase = 0;
      let isVisible = false;
      let animId = null;

      function morph() {
        if (!isVisible) return;
        phase += 0.02;

        paths.forEach((path, idx) => {
          const speed = (idx + 1) * 0.6;
          const amp = 8 + idx * 4;
          const w = 1200;
          const h = 72;
          
          let d = 'M 0,' + h;
          const pts = 4;
          const step = w / pts;

          for (let i = 0; i <= pts; i++) {
            const x = i * step;
            const y = (h * 0.45) + Math.sin(phase * speed + i * 1.5) * amp;
            if (i === 0) {
              d += ' L ' + x + ',' + y;
            } else {
              const px = (i - 1) * step;
              const py = (h * 0.45) + Math.sin(phase * speed + (i - 1) * 1.5) * amp;
              const cx1 = px + step * 0.5;
              const cy1 = py;
              const cx2 = px + step * 0.5;
              const cy2 = y;
              d += ' C ' + cx1 + ',' + cy1 + ' ' + cx2 + ',' + cy2 + ' ' + x + ',' + y;
            }
          }
          d += ' L ' + w + ',' + h + ' L 0,' + h + ' Z';
          path.setAttribute('d', d);
        });

        animId = requestAnimationFrame(morph);
      }

      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            cancelAnimationFrame(animId);
            animId = requestAnimationFrame(morph);
          } else {
            cancelAnimationFrame(animId);
          }
        });
      }, { threshold: 0.1 });

      obs.observe(svg);
    });
  }

  // 4. Liquid Button Click Ripples & Micro-Interactions
  function initLiquidButtons() {
    const buttons = document.querySelectorAll('.btn, .nb, [data-open-modal="appointment"]');

    buttons.forEach((btn) => {
      btn.addEventListener('pointerdown', function(e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'liquid-ripple';

        const size = Math.max(rect.width, rect.height) * 1.8;
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top = (e.clientY - rect.top) + 'px';

        this.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 650);
      });
    });
  }

  // 5. Magnetic Navigation Elements (Desktop Only)
  function initMagneticLinks() {
    if (isTouchDevice || isReducedMotion || typeof gsap === 'undefined') return;

    const magneticElements = document.querySelectorAll('.nli, .magnetic-link');

    magneticElements.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - (rect.left + rect.width / 2)) * 0.28;
        const y = (e.clientY - (rect.top + rect.height / 2)) * 0.28;

        gsap.to(el, {
          x: x,
          y: y,
          duration: 0.25,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.45,
          ease: 'elastic.out(1.1, 0.4)',
          overwrite: 'auto'
        });
      });
    });
  }

  // 6. Sticky Header Frosted Glass Transition
  function initStickyHeaderMotion() {
    const header = document.querySelector('.sh2');
    if (!header) return;

    function onScroll() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollY > 15) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 7. Native ScrollTrigger Entrance Reveals (Zero Scroll Hijacking)
  function initScrollReveals() {
    if (isReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const headings = document.querySelectorAll('.sh, .sec-hdr');
    headings.forEach((hdr) => {
      gsap.from(hdr, {
        scrollTrigger: {
          trigger: hdr,
          start: 'top 90%',
          once: true
        },
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out'
      });
    });

    const cardSelectors = ['.dept-card', '.sidebar-card', '.about-stat-box'];
    cardSelectors.forEach((sel) => {
      const cards = document.querySelectorAll(sel);
      if (cards.length > 0) {
        ScrollTrigger.batch(cards, {
          start: 'top 90%',
          once: true,
          onEnter: (batch) => {
            gsap.from(batch, {
              y: 20,
              opacity: 0,
              stagger: 0.06,
              duration: 0.5,
              ease: 'power2.out',
              clearProps: 'all'
            });
          }
        });
      }
    });
  }

  function init() {
    initAnchorScroll();
    initFluidCanvas();
    initLiquidWaves();
    initLiquidButtons();
    initMagneticLinks();
    initStickyHeaderMotion();
    initScrollReveals();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
