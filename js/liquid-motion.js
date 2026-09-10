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
        ease: 'power3.out',
        clearProps: 'all'
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

  // 8. Live Rolling Odometer Counters (Phase 1)
  function initCounters() {
    const counterElements = document.querySelectorAll('[data-counter], .counter-val');
    if (!counterElements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        obs.unobserve(el);

        const rawTarget = el.getAttribute('data-counter') || el.textContent.replace(/[^0-9.]/g, '');
        const targetVal = parseFloat(rawTarget);
        if (isNaN(targetVal)) return;

        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const decimals = parseInt(el.getAttribute('data-decimals') || (rawTarget.includes('.') ? '1' : '0'), 10);
        const duration = isReducedMotion ? 0.01 : 1.8;

        const counterObj = { val: 0 };
        if (typeof gsap !== 'undefined') {
          gsap.to(counterObj, {
            val: targetVal,
            duration: duration,
            ease: 'power2.out',
            onUpdate: () => {
              const formatted = decimals > 0 
                ? counterObj.val.toFixed(decimals) 
                : Math.floor(counterObj.val).toLocaleString('en-IN');
              el.innerHTML = prefix + formatted + (suffix ? `<span>${suffix}</span>` : '');
            },
            onComplete: () => {
              const formatted = decimals > 0 
                ? targetVal.toFixed(decimals) 
                : Math.floor(targetVal).toLocaleString('en-IN');
              el.innerHTML = prefix + formatted + (suffix ? `<span>${suffix}</span>` : '');
            }
          });
        } else {
          let start = null;
          function step(timestamp) {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / (duration * 1000), 1);
            const current = progress * targetVal;
            const formatted = decimals > 0 
              ? current.toFixed(decimals) 
              : Math.floor(current).toLocaleString('en-IN');
            el.innerHTML = prefix + formatted + (suffix ? `<span>${suffix}</span>` : '');
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              const final = decimals > 0 
                ? targetVal.toFixed(decimals) 
                : Math.floor(targetVal).toLocaleString('en-IN');
              el.innerHTML = prefix + final + (suffix ? `<span>${suffix}</span>` : '');
            }
          }
          requestAnimationFrame(step);
        }
      });
    }, { threshold: 0.25 });

    counterElements.forEach((el) => observer.observe(el));
  }

  // 9. 3D Perspective Card Tilt & Specular Light Sheen (Phase 1)
  function initCardTilt3D() {
    if (isTouchDevice || isReducedMotion) return;

    const cards = document.querySelectorAll('.card-tilt-3d, .dept-card, .treatment-card, .infra-card, .book-card, .testi-card, .testi-card-lg, .about-stat-box, .award-item-box, .aeo-fact');
    if (!cards.length) return;

    cards.forEach((card) => {
      if (!card.querySelector('.card-sheen')) {
        const sheen = document.createElement('div');
        sheen.className = 'card-sheen';
        card.appendChild(sheen);
      }
      card.classList.add('card-tilt-3d');

      let reqId = null;
      let mouseX = 0, mouseY = 0;
      let isHovered = false;

      function updateTilt() {
        if (!isHovered) return;
        const rect = card.getBoundingClientRect();
        const px = (mouseX - rect.left) / rect.width;
        const py = (mouseY - rect.top) / rect.height;

        const rotX = ((0.5 - py) * 8).toFixed(2);
        const rotY = ((px - 0.5) * 8).toFixed(2);

        card.style.setProperty('--sheen-x', `${(px * 100).toFixed(1)}%`);
        card.style.setProperty('--sheen-y', `${(py * 100).toFixed(1)}%`);
        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;

        reqId = null;
      }

      card.addEventListener('pointerenter', () => {
        isHovered = true;
      });

      card.addEventListener('pointermove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!reqId) {
          reqId = requestAnimationFrame(updateTilt);
        }
      }, { passive: true });

      card.addEventListener('pointerleave', () => {
        isHovered = false;
        if (reqId) cancelAnimationFrame(reqId);
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  // 10. Interactive Recovery Milestones Timeline / Scrubber (Phase 2)
  function initRecoveryTimeline() {
    const timelineBoxes = document.querySelectorAll('.recovery-timeline-box');
    if (!timelineBoxes.length) return;

    const milestonesData = [
      {
        time: 'Hour 4',
        title: 'Same-Day Bedside Standing & Walking',
        badge: 'Zero Muscle Cut (Day 0 Mobilization)',
        pct: 20,
        desc: 'Thanks to true muscle-sparing Direct Anterior Approach (DAA) Hip Replacement and Subvastus Knee Replacement, zero tendons or muscle bellies are detached. Patients bear full body weight and walk bedside within 4 hours of surgery under physiotherapist guidance.',
        rationale: '<strong>Clinical Rationale:</strong> Conventional surgery severs major stabilizers (quadriceps or gluteal rotators), enforcing 24-48 hours bed confinement. AOSIH tissue-preserving planes preserve immediate proprioception and motor control.'
      },
      {
        time: 'Day 1',
        title: 'Independent Corridor Ambulation (90° Flexion)',
        badge: 'Active Quad Activation',
        pct: 45,
        desc: 'Patients walk comfortably along hospital corridors using a lightweight walker and visit the washroom independently. Knee flexion easily reaches 90° without severe stretching pain. Continuous adductor canal block maintains pain scores under 2/10.',
        rationale: '<strong>Clinical Rationale:</strong> Multi-modal opioid-sparing pain protocols prevent post-op nausea and dizziness, enabling early cardiovascular stimulation and zero deep vein thrombosis (DVT) risk.'
      },
      {
        time: 'Day 4',
        title: 'Stair Climbing & Safe Hospital Discharge',
        badge: 'Home Independence',
        pct: 70,
        desc: 'Patients master independent stair navigation with our physiotherapy team and receive safe hospital discharge. Subcuticular absorbable cosmetic sutures eliminate painful staple removal. Patients comfortably sit on standard dining chairs.',
        rationale: '<strong>Clinical Rationale:</strong> Retaining the natural capsule and avoiding muscle trauma means zero dislocation precautions for DAA hip patients and rapid quadriceps lock for knee patients.'
      },
      {
        time: 'Week 2',
        title: 'Crutch-Free Walking, Driving & Office Return',
        badge: 'Active Daily Living',
        pct: 88,
        desc: 'Supportive walkers and crutches are completely discarded. Patients resume indoor activities, work at their desk or clinic, and drive automatic vehicles with confident emergency brake reaction times.',
        rationale: '<strong>Clinical Rationale:</strong> Rapid wound sealing and preserved vascular supply around the joint drastically minimize prolonged swelling and inflammatory stiffness.'
      },
      {
        time: 'Month 3–6',
        title: 'Full Return to Sports, Gym, Trekking & 4km Walks',
        badge: 'Unrestricted Active Life',
        pct: 100,
        desc: 'Complete joint forgetfulness (Forgotten Joint Score > 90/100). Patients comfortably accomplish 4–5 km brisk morning walks, recreational badminton, swimming, gym workouts, and cross-legged sitting without pain.',
        rationale: '<strong>Clinical Rationale:</strong> Swiss and German precision modular implants are anatomically aligned to patient-specific kinematics, engineered for 30+ years of high-demand performance.'
      }
    ];

    timelineBoxes.forEach((box) => {
      const nodeItems = box.querySelectorAll('.timeline-node-item');
      const progressBar = box.querySelector('.timeline-track-progress');
      const gaugeRing = box.querySelector('.radial-gauge-fill');
      const gaugeVal = box.querySelector('.radial-gauge-val');
      const gaugeSub = box.querySelector('.radial-gauge-sub');
      const titleEl = box.querySelector('.milestone-title-text');
      const badgeEl = box.querySelector('.milestone-badge-pill');
      const descEl = box.querySelector('.milestone-info-desc');
      const rationaleEl = box.querySelector('.milestone-clinical-rationale');

      let currentIndex = 0;

      function setMilestone(index) {
        if (index < 0 || index >= milestonesData.length) return;
        currentIndex = index;
        const data = milestonesData[index];

        nodeItems.forEach((item, i) => {
          item.classList.toggle('active', i === index);
          item.classList.toggle('completed', i < index);
        });

        if (progressBar) {
          const stepPct = (index / (milestonesData.length - 1)) * 100;
          progressBar.style.width = `${stepPct}%`;
        }

        if (gaugeRing) {
          const circumference = 377;
          const offset = circumference - (circumference * data.pct) / 100;
          gaugeRing.style.strokeDashoffset = offset;
        }
        if (gaugeVal) gaugeVal.textContent = `${data.pct}%`;
        if (gaugeSub) gaugeSub.textContent = data.pct === 100 ? 'Full Mobility' : `${data.time} Target`;

        if (titleEl) titleEl.textContent = data.title;
        if (badgeEl) badgeEl.textContent = data.badge;
        if (descEl) descEl.textContent = data.desc;
        if (rationaleEl) rationaleEl.innerHTML = data.rationale;
      }

      nodeItems.forEach((btn, idx) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          setMilestone(idx);
        });
      });

      setMilestone(0);
    });
  }

  // 11. Interactive Draggable "Before & After" Joint Comparison Slider (Phase 2)
  function initBeforeAfterSliders() {
    const sliderContainers = document.querySelectorAll('.ba-slider-container');
    if (!sliderContainers.length) return;

    sliderContainers.forEach((container) => {
      let isDragging = false;

      function updateSplit(clientX) {
        const rect = container.getBoundingClientRect();
        let pct = ((clientX - rect.left) / rect.width) * 100;
        pct = Math.max(5, Math.min(95, pct));

        container.style.setProperty('--split-pos', `${pct.toFixed(2)}%`);
      }

      function onPointerDown(e) {
        isDragging = true;
        container.classList.add('is-dragging');
        updateSplit(e.clientX);
      }

      function onPointerMove(e) {
        if (!isDragging) return;
        updateSplit(e.clientX);
      }

      function onPointerUp() {
        if (isDragging) {
          isDragging = false;
          container.classList.remove('is-dragging');
        }
      }

      container.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerup', onPointerUp, { passive: true });
      window.addEventListener('pointercancel', onPointerUp, { passive: true });

      const parentSection = container.closest('.ba-section') || container.parentElement;
      const tabBtns = parentSection ? parentSection.querySelectorAll('.ba-tab-btn') : [];
      if (tabBtns.length) {
        const datasets = {
          knee: {
            beforeImg: 'images/knee_clinical_photo.jpg',
            afterImg: 'images/knee_replacement_graphic.png',
            beforeBadge: 'Pre-Op: Grade 4 Varus Bowing',
            afterBadge: 'Post-Op: 0° Neutral Alignment (AOSIH)',
            stat1: ['Mechanical Axis', '18° Severe Varus → 0° Neutral'],
            stat2: ['Weight-Bearing', 'Immediate (Day 0 Recovery Room)'],
            stat3: ['Quadriceps Cut', '0% (Subvastus Sparing)']
          },
          hip: {
            beforeImg: 'images/avn_hip_case.jpg',
            afterImg: 'images/hip_replacement_graphic.png',
            beforeBadge: 'Pre-Op: Stage 3 AVN Femoral Collapse',
            afterBadge: 'Post-Op: DAA Dual-Mobility Hip (AOSIH)',
            stat1: ['Dislocation Risk', '< 0.1% (Zero Movement Restriction)'],
            stat2: ['First Ambulation', 'Within 4 Hours Post-Surgery'],
            stat3: ['Gluteal Detachment', '0% (Inter-Muscular Interval)']
          },
          shoulder: {
            beforeImg: 'images/shoulder_dislocation.jpg',
            afterImg: 'images/acl_surgery_graphic.png',
            beforeBadge: 'Pre-Op: Full Rotator Cuff Tear',
            afterBadge: 'Post-Op: Double-Row Keyhole Fixation',
            stat1: ['Incision Portals', '3 x 4mm Keyholes (Zero Muscle Split)'],
            stat2: ['Overhead Range', '165° Active Pain-Free Flexion'],
            stat3: ['Re-Tear Rate', '< 3% (Uniform Pressure Bridge)']
          }
        };

        tabBtns.forEach((btn) => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const key = btn.getAttribute('data-tab') || 'knee';
            const data = datasets[key];
            if (!data) return;

            const imgBefore = container.querySelector('.ba-layer.ba-before img');
            const imgAfter = container.querySelector('.ba-layer.ba-after img');
            const badgeBefore = container.querySelector('.ba-badge-before');
            const badgeAfter = container.querySelector('.ba-badge-after');

            if (imgBefore) imgBefore.src = data.beforeImg;
            if (imgAfter) imgAfter.src = data.afterImg;
            if (badgeBefore) badgeBefore.textContent = data.beforeBadge;
            if (badgeAfter) badgeAfter.textContent = data.afterBadge;

            const statsCols = parentSection.querySelectorAll('.ba-stat-col');
            if (statsCols.length >= 3) {
              statsCols[0].querySelector('.ba-stat-col-lbl').textContent = data.stat1[0];
              statsCols[0].querySelector('.ba-stat-col-val').textContent = data.stat1[1];
              statsCols[1].querySelector('.ba-stat-col-lbl').textContent = data.stat2[0];
              statsCols[1].querySelector('.ba-stat-col-val').textContent = data.stat2[1];
              statsCols[2].querySelector('.ba-stat-col-lbl').textContent = data.stat3[0];
              statsCols[2].querySelector('.ba-stat-col-val').textContent = data.stat3[1];
            }

            container.style.setProperty('--split-pos', '50%');
          });
        });
      }
    });
  }

  // 12. Interactive Procedure & Surgical Anatomy Morphing Visualizer (Phase 3)
  function initProcedureVisualizer() {
    const visualizerBoxes = document.querySelectorAll('.procedure-visualizer-box');
    if (!visualizerBoxes.length) return;

    const procedureData = {
      subvastus: {
        title: 'Fast-Track Subvastus Knee Replacement',
        subtitle: 'Quad-Sparing Fast Recovery vs Conventional Parapatellar',
        image: 'images/knee_replacement_graphic.png',
        hotspots: [
          {
            id: 1, x: '45%', y: '30%',
            title: 'Subvastus Muscle Plane',
            text: 'The vastus medialis muscle is lifted without cutting a single tendon fiber. The extensor mechanism is 100% preserved, allowing immediate straight leg raises.'
          },
          {
            id: 2, x: '50%', y: '62%',
            title: 'Mechanical Kinematic Alignment',
            text: 'Class 100 modular surgical precision ensures 0° neutral weight-bearing axis, eliminating pre-operative varus bowing and joint strain.'
          },
          {
            id: 3, x: '42%', y: '48%',
            title: 'Natural Patellar Kinematics',
            text: 'Patella is not everted or tilted. Natural patellar tracking prevents anterior knee pain, kneeling discomfort, and quadriceps weakness.'
          }
        ],
        table: [
          ['Muscle Cutting', '0% Cut (Muscles lifted gently)', '8–12 cm Quadriceps Tendon Severed'],
          ['First Ambulation', 'Within 4 to 12 Hours Post-Op', '48 to 72 Hours (Bed Rest Enforced)'],
          ['Wound Closure', 'Absorbable Subcuticular (No Staple Removal)', '25–30 Painful Metal Staples on Day 14'],
          ['Full Independence', '2 to 3 Weeks Crutch-Free', '6 to 12 Weeks Prolonged Rehabilitation']
        ]
      },
      daa: {
        title: 'Direct Anterior Approach (DAA) Hip Replacement',
        subtitle: 'True Inter-Muscular Plane vs Conventional Posterior Hip',
        image: 'images/hip_replacement_graphic.png',
        hotspots: [
          {
            id: 1, x: '48%', y: '36%',
            title: 'Hueter Inter-Muscular Plane',
            text: 'Surgery navigates between Tensor Fasciae Latae and Sartorius muscles. Zero detachment of gluteus medius or piriformis external rotators.'
          },
          {
            id: 2, x: '52%', y: '54%',
            title: 'Anterior Cup Positioning',
            text: 'Supine surgical positioning provides real-time radiological verification of cup inclination and anteversion, optimizing leg-length equality.'
          },
          {
            id: 3, x: '46%', y: '72%',
            title: 'Dual-Mobility Kinematics',
            text: 'Extreme range of motion with less than 0.1% dislocation risk. Patients can sit cross-legged and bend forward without fear of dislocation.'
          }
        ],
        table: [
          ['Gluteal Detachment', '0% Muscle Detached', 'Piriformis & External Rotators Severed'],
          ['Movement Restrictions', '0 Precautions (Sit, bend, cross legs)', 'Strict 90° flexion limit & high chairs for 6 weeks'],
          ['Dislocation Risk', '< 0.1% (Extreme Stability)', '2.0% – 4.0% in Posterior Approach'],
          ['Incision & Scarring', '7–9 cm Bikini Line (Minimal Scar)', '15–20 cm Deep Curvilinear Lateral Scar']
        ]
      },
      shoulder: {
        title: 'Double-Row 4K Keyhole Shoulder Repair',
        subtitle: 'Anatomical Footprint Compression vs Single-Row Repair',
        image: 'images/acl_surgery_graphic.png',
        hotspots: [
          {
            id: 1, x: '48%', y: '34%',
            title: 'Supraspinatus Footprint',
            text: 'Restores 100% anatomical contact area on greater tuberosity, maximizing biological vascular ingrowth and tendon healing.'
          },
          {
            id: 2, x: '42%', y: '50%',
            title: 'Medial Row Suture Mattress',
            text: 'Double-loaded bio-composite anchors create high-tensile mattress stitches that prevent suture cutout under tension.'
          },
          {
            id: 3, x: '56%', y: '64%',
            title: 'Lateral Row Knotless Bridge',
            text: 'Criss-cross crisscrossing suture bands provide uniform downward pressure across the tendon footprint without knot impingement.'
          }
        ],
        table: [
          ['Surgical Technique', 'Double-Row Suture Bridge', 'Single-Row Traditional Fixation'],
          ['Tendon Re-Tear Rate', '< 3% (High-Strength Fixation)', '15% – 25% Structural Failure'],
          ['Incision Type', '3 Keyhole Portals (3–4 mm each)', '6–8 cm Open Muscle Split Deltoid'],
          ['Overhead Return', 'Full 165°+ Active Elevation', 'Often restricted to 120°–140° elevation']
        ]
      }
    };

    visualizerBoxes.forEach((box) => {
      const tabBtns = box.querySelectorAll('.proc-tab-btn');
      const stageImg = box.querySelector('.proc-anatomy-canvas-box img');
      const hotspotContainer = box.querySelector('.proc-hotspots-container');
      const cardTitle = box.querySelector('.proc-active-hotspot-card h4');
      const cardText = box.querySelector('.proc-active-hotspot-card p');
      const compTableBody = box.querySelector('.proc-comparison-table tbody');
      const headerTitle = box.querySelector('.proc-info-panel h3');

      function renderProcedure(procKey) {
        const data = procedureData[procKey];
        if (!data) return;

        tabBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-proc') === procKey));

        if (stageImg) {
          stageImg.src = data.image;
        }

        if (headerTitle) {
          headerTitle.innerHTML = `${data.title} <span>Technique</span>`;
        }

        if (hotspotContainer) {
          hotspotContainer.innerHTML = '';
          data.hotspots.forEach((hs, idx) => {
            const dot = document.createElement('button');
            dot.className = `hotspot-dot ${idx === 0 ? 'active' : ''}`;
            dot.style.left = hs.x;
            dot.style.top = hs.y;
            dot.textContent = hs.id;
            dot.setAttribute('title', hs.title);
            dot.setAttribute('aria-label', hs.title);

            dot.addEventListener('click', (e) => {
              e.preventDefault();
              hotspotContainer.querySelectorAll('.hotspot-dot').forEach(d => d.classList.remove('active'));
              dot.classList.add('active');
              if (cardTitle) cardTitle.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg> ${hs.title}`;
              if (cardText) cardText.textContent = hs.text;
            });

            hotspotContainer.appendChild(dot);
          });

          if (data.hotspots.length > 0) {
            if (cardTitle) cardTitle.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg> ${data.hotspots[0].title}`;
            if (cardText) cardText.textContent = data.hotspots[0].text;
          }
        }

        if (compTableBody) {
          compTableBody.innerHTML = '';
          data.table.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td><strong>${row[0]}</strong></td>
              <td class="aosih-col">✓ ${row[1]}</td>
              <td class="trad-col">✗ ${row[2]}</td>
            `;
            compTableBody.appendChild(tr);
          });
        }
      }

      tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const proc = btn.getAttribute('data-proc');
          renderProcedure(proc);
        });
      });

      renderProcedure('subvastus');
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
    initCounters();
    initCardTilt3D();
    initRecoveryTimeline();
    initBeforeAfterSliders();
    initProcedureVisualizer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

