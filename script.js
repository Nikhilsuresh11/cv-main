// ===================================
// Smooth Scroll & Navigation
// ===================================
document.addEventListener('DOMContentLoaded', function () {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightNavigation() {
        let current = '';
        const scrollPosition = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation(); // Initial call

    // ===================================
    // Navbar Scroll Effect
    // ===================================
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.8)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });

    // ===================================
    // Mobile Menu Toggle
    // ===================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }

    // ===================================
    // Scroll Animations
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all project cards, skill categories, and timeline items
    const animatedElements = document.querySelectorAll('.project-card, .skill-category, .timeline-item, .expertise-item, .contact-card');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });

    // ===================================
    // Skill Progress Animation
    // ===================================
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });

    // ===================================
    // Cursor Trail Effect (Desktop only)
    // ===================================
    if (window.innerWidth > 768) {
        const coords = { x: 0, y: 0 };
        const circles = document.querySelectorAll('.cursor-circle');

        if (circles.length === 0) {
            // Create cursor circles
            for (let i = 0; i < 20; i++) {
                const circle = document.createElement('div');
                circle.className = 'cursor-circle';
                circle.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #8B5CF6, #3B82F6);
                    pointer-events: none;
                    z-index: 9999;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                `;
                document.body.appendChild(circle);
            }
        }

        const cursorCircles = document.querySelectorAll('.cursor-circle');
        
        window.addEventListener('mousemove', (e) => {
            coords.x = e.clientX;
            coords.y = e.clientY;
        });

        function animateCircles() {
            let x = coords.x;
            let y = coords.y;

            cursorCircles.forEach((circle, index) => {
                circle.style.left = x - 5 + 'px';
                circle.style.top = y - 5 + 'px';
                circle.style.opacity = (20 - index) / 40;
                circle.style.transform = `scale(${(20 - index) / 20})`;

                const nextCircle = cursorCircles[index + 1] || cursorCircles[0];
                x += (nextCircle.offsetLeft - x) * 0.3;
                y += (nextCircle.offsetTop - y) * 0.3;
            });

            requestAnimationFrame(animateCircles);
        }

        animateCircles();
    }

    // ===================================
    // Parallax Effect for Hero
    // ===================================
    const heroOrbs = document.querySelectorAll('.gradient-orb');
    
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        heroOrbs.forEach((orb, index) => {
            const speed = (index + 1) * 20;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // ===================================
    // Typing Effect for Hero Title (Optional)
    // ===================================
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && heroTitle.textContent.includes('Nikhil Ramachandran')) {
        const text = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        heroTitle.style.opacity = '1';
        
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroTitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        // Uncomment to enable typing effect
        // setTimeout(typeWriter, 500);
    }

    // ===================================
    // Stats Counter Animation
    // ===================================
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                
                // Only animate if it's a number
                if (!isNaN(parseFloat(finalValue))) {
                    const isDecimal = finalValue.includes('.');
                    const numValue = parseFloat(finalValue);
                    const duration = 2000;
                    const steps = 60;
                    const increment = numValue / steps;
                    let current = 0;
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= numValue) {
                            target.textContent = finalValue;
                            clearInterval(timer);
                        } else {
                            target.textContent = isDecimal ? current.toFixed(2) : Math.floor(current);
                        }
                    }, duration / steps);
                }
                
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    // ===================================
    // Project Card Tilt Effect
    // ===================================
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ===================================
    // Add Loading Animation
    // ===================================
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        }, 100);
    });

    // ===================================
    // Console Easter Egg
    // ===================================
    console.log('%c👋 Hello there!', 'font-size: 20px; font-weight: bold; color: #8B5CF6;');
    console.log('%cInterested in the code? Check out my GitHub: https://github.com/nikhilsuresh11', 'font-size: 14px; color: #3B82F6;');
    console.log('%cLet\'s build something amazing together! 🚀', 'font-size: 14px; color: #EC4899;');
});
