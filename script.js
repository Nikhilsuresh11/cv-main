/* ====================================================
   NIKHIL R — SYSTEMS
   Script: Animations, nav, interactions
   ==================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ========== Smooth scroll for anchor links ==========
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        // Close mobile menu if open
        closeMobileMenu();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ========== Navbar scroll effect ==========
  const nav = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // ========== Mobile menu toggle ==========
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  function closeMobileMenu() {
    if (mobileToggle && mobileMenu) {
      mobileToggle.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileToggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // ========== Theme Toggle ==========
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.textContent = '🌙';
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.textContent = '☀️';
      }

      // Re-trigger mask animations on theme switch
      const maskInners = document.querySelectorAll('.mask-inner');
      maskInners.forEach(inner => {
        inner.style.animationName = 'none';
        void inner.offsetWidth; // trigger reflow to restart animation
        inner.style.animationName = '';
      });
    });
  }

  // ========== Scroll Velocity Marquee ==========
  const velocityRows = document.querySelectorAll('.scroll-velocity-row');
  if (velocityRows.length > 0) {
    let lastScrollY = window.scrollY;
    let targetVelocity = 0;
    let currentVelocity = 0;
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      targetVelocity = delta * 0.15; // Sensitivity
      lastScrollY = currentScrollY;
    }, { passive: true });

    velocityRows.forEach(row => {
      const inner = row.querySelector('.scroll-velocity-inner');
      const spans = inner.querySelectorAll('span');
      if (!spans.length) return;
      
      const direction = parseFloat(row.getAttribute('data-direction')) || 1;
      const baseSpeed = parseFloat(row.getAttribute('data-speed')) || 1.5;
      
      let spanWidth = spans[0].offsetWidth;
      let position = direction === 1 ? -spanWidth : 0;

      window.addEventListener('resize', () => {
        spanWidth = spans[0].offsetWidth;
      });

      function animate() {
        currentVelocity += (targetVelocity - currentVelocity) * 0.1;
        targetVelocity *= 0.9;
        
        let moveBy = direction * baseSpeed;
        moveBy += direction * Math.abs(currentVelocity) * 2; 

        position += moveBy;
        
        if (position > 0) {
          position -= spanWidth;
        } else if (position < -spanWidth) {
          position += spanWidth;
        }
        
        inner.style.transform = `translate3d(${position}px, 0, 0)`;
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    });
  }

  // ========== Commit Grid ==========
  const commitGrid = document.getElementById('commit-grid');
  if (commitGrid) {
    const totalDots = 7 * 19; // 133 dots fits perfectly in the card width
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('div');
      dot.className = 'commit-dot';
      // ~35% chance for a dot to be 'active' (dark tone)
      if (Math.random() < 0.35) {
        dot.classList.add('active');
      }
      commitGrid.appendChild(dot);
    }
  }

  // ========== Intersection Observer — Reveal animations ==========
  const revealElements = document.querySelectorAll(
    '.hero-card, .hero-headline, .hero-footer, ' +
    '.big-heading, .metric-card, .capability, .validate-row, ' +
    '.process-heading, .process-step, .process-banner, ' +
    '.product-card, .stack-section, .research-card, ' +
    '.contact-left, .contact-right, .detail-block'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger children of same type
        const siblings = Array.from(entry.target.parentElement.children).filter(
          child => child.classList.contains('reveal')
        );
        const index = siblings.indexOf(entry.target);
        const delay = Math.min(index * 80, 400);

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));

  // ========== Animated counter for metrics ==========
  const metricNumbers = document.querySelectorAll('.metric-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  metricNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const text = el.textContent;
    // Extract number from the text content (before the unit span)
    const numberMatch = el.childNodes[0].textContent.trim();
    const target = parseInt(numberMatch);

    if (isNaN(target)) return;

    const duration = 1200;
    const startTime = performance.now();
    const startVal = 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.round(startVal + (target - startVal) * eased);

      el.childNodes[0].textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ========== Big year counter ==========
  const bigYear = document.querySelector('.big-year');
  if (bigYear) {
    const yearObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateYear(entry.target);
          yearObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    yearObserver.observe(bigYear);
  }

  function animateYear(el) {
    const target = parseInt(el.textContent);
    if (isNaN(target)) return;

    const duration = 1500;
    const startTime = performance.now();
    const startVal = 2020;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (target - startVal) * eased);

      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ========== Hover parallax on hero headline ==========
  const heroHeadline = document.querySelector('.hero-headline h1');
  if (heroHeadline && window.matchMedia('(hover: hover)').matches) {
    const heroSection = document.querySelector('.hero-section');

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      heroHeadline.style.transform = `translate(${x * 6}px, ${y * 4}px)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      heroHeadline.style.transform = 'translate(0, 0)';
      heroHeadline.style.transition = 'transform 0.5s ease';
      setTimeout(() => {
        heroHeadline.style.transition = '';
      }, 500);
    });
  }

  // ========== Active nav link on scroll ==========
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-center a:not(.nav-brand):not(.nav-cta)');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });
});
