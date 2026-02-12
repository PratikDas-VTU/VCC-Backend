/* ============================================
   VIBATHON 2026 - JavaScript Functionality
   ============================================ */

// ============================================
// CYBER BACKGROUND ANIMATION
// ============================================
class CyberBackground {
    constructor() {
        this.canvas = document.getElementById('cyber-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.orbs = [];
        this.particleCount = 80;
        this.orbCount = 5;
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.createOrbs();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }
    
    createOrbs() {
        this.orbs = [];
        for (let i = 0; i < this.orbCount; i++) {
            this.orbs.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 100 + 50,
                hue: Math.random() * 60 + 180, // Cyan to magenta range
                opacity: Math.random() * 0.1 + 0.05
            });
        }
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 240, 255, ${particle.opacity})`;
            this.ctx.fill();
            
            // Add glow effect
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = 'rgba(0, 240, 255, 0.5)';
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
    }
    
    drawConnections() {
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            });
        });
    }
    
    drawOrbs() {
        this.orbs.forEach(orb => {
            const gradient = this.ctx.createRadialGradient(
                orb.x, orb.y, 0,
                orb.x, orb.y, orb.radius
            );
            
            gradient.addColorStop(0, `hsla(${orb.hue}, 100%, 50%, ${orb.opacity})`);
            gradient.addColorStop(0.5, `hsla(${orb.hue}, 100%, 50%, ${orb.opacity * 0.5})`);
            gradient.addColorStop(1, `hsla(${orb.hue}, 100%, 50%, 0)`);
            
            this.ctx.beginPath();
            this.ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        });
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Keep within bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
        });
    }
    
    updateOrbs() {
        this.orbs.forEach(orb => {
            orb.x += orb.vx;
            orb.y += orb.vy;
            
            // Bounce off edges
            if (orb.x < -orb.radius || orb.x > this.canvas.width + orb.radius) orb.vx *= -1;
            if (orb.y < -orb.radius || orb.y > this.canvas.height + orb.radius) orb.vy *= -1;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawOrbs();
        this.drawConnections();
        this.drawParticles();
        
        this.updateParticles();
        this.updateOrbs();
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// NAVBAR FUNCTIONALITY
// ============================================
class Navbar {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.loginBtn = document.getElementById('loginBtn');
        this.loginDropdown = document.getElementById('loginDropdown');
        
        this.init();
    }
    
    init() {
        this.handleScroll();
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupDropdown();
        
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    handleScroll() {
        if (window.scrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }
    
    setupMobileMenu() {
        this.mobileMenuToggle.addEventListener('click', () => {
            this.mobileMenu.classList.toggle('active');
            this.mobileMenuToggle.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.mobileMenu.classList.remove('active');
                this.mobileMenuToggle.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }
    
    setupSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#' || href === '') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offset = 80;
                    const targetPosition = target.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    setupDropdown() {
        // The dropdown is handled by CSS :hover
        // This is just for touch devices
        if ('ontouchstart' in window) {
            this.loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.loginDropdown.style.opacity = 
                    this.loginDropdown.style.opacity === '1' ? '0' : '1';
                this.loginDropdown.style.visibility = 
                    this.loginDropdown.style.visibility === 'visible' ? 'hidden' : 'visible';
            });
        }
    }
}

// ============================================
// RULES ACCORDION
// ============================================
class RulesAccordion {
    constructor() {
        this.ruleItems = document.querySelectorAll('.rule-item');
        this.init();
    }
    
    init() {
        this.ruleItems.forEach(item => {
            const header = item.querySelector('.rule-header');
            header.addEventListener('click', () => this.toggle(item));
        });
    }
    
    toggle(item) {
        const isActive = item.classList.contains('active');
        
        // Close all items
        this.ruleItems.forEach(i => i.classList.remove('active'));
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    }
}

// ============================================
// SCROLL ANIMATIONS (AOS - Animate on Scroll)
// ============================================
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-aos]');
        this.init();
    }
    
    init() {
        this.observe();
        window.addEventListener('scroll', () => this.checkElements());
        // Initial check
        this.checkElements();
    }
    
    observe() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('aos-animate');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            this.elements.forEach(element => observer.observe(element));
        } else {
            // Fallback for browsers without IntersectionObserver
            this.checkElements();
        }
    }
    
    checkElements() {
        this.elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight - 100) {
                element.classList.add('aos-animate');
            }
        });
    }
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
class BackToTop {
    constructor() {
        this.button = document.getElementById('backToTop');
        this.init();
    }
    
    init() {
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ============================================
// HERO TEXT ANIMATION
// ============================================
class HeroAnimation {
    constructor() {
        this.heroTitle = document.querySelector('.hero-title');
        this.init();
    }
    
    init() {
        if (this.heroTitle) {
            this.animateText();
        }
    }
    
    animateText() {
        const text = this.heroTitle.textContent;
        this.heroTitle.textContent = '';
        
        let index = 0;
        const interval = setInterval(() => {
            if (index < text.length) {
                this.heroTitle.textContent += text[index];
                index++;
            } else {
                clearInterval(interval);
            }
        }, 100);
    }
}

// ============================================
// CURSOR TRAIL EFFECT (Optional Enhancement)
// ============================================
class CursorTrail {
    constructor() {
        this.trail = [];
        this.maxTrail = 20;
        this.init();
    }
    
    init() {
        // Only enable on desktop
        if (window.innerWidth > 768) {
            document.addEventListener('mousemove', (e) => this.addTrail(e));
        }
    }
    
    addTrail(e) {
        const dot = document.createElement('div');
        dot.style.position = 'fixed';
        dot.style.width = '4px';
        dot.style.height = '4px';
        dot.style.background = 'rgba(0, 240, 255, 0.5)';
        dot.style.borderRadius = '50%';
        dot.style.pointerEvents = 'none';
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';
        dot.style.zIndex = '9999';
        dot.style.transition = 'opacity 0.5s ease';
        
        document.body.appendChild(dot);
        
        setTimeout(() => {
            dot.style.opacity = '0';
            setTimeout(() => dot.remove(), 500);
        }, 50);
    }
}

// ============================================
// BUTTON CLICK EFFECTS
// ============================================
class ButtonEffects {
    constructor() {
        this.buttons = document.querySelectorAll('.btn, .lr-card button, .coordinator-contact');
        this.init();
    }
    
    init() {
        this.buttons.forEach(button => {
            button.addEventListener('click', (e) => this.createRipple(e, button));
        });
    }
    
    createRipple(e, button) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.borderRadius = '50%';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
}

// Add ripple animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: translate(-50%, -50%) scale(20);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// PRELOADER (Optional)
// ============================================
class Preloader {
    constructor() {
        this.init();
    }
    
    init() {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            // Start animations after page load
            setTimeout(() => {
                document.body.style.overflow = 'auto';
            }, 500);
        });
    }
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Reduce animations on low-end devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            document.body.classList.add('reduced-motion');
        }
        
        // Lazy load images if any
        if ('IntersectionObserver' in window) {
            const images = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
}

// ============================================
// TIMELINE INTERACTION
// ============================================
class TimelineInteraction {
    constructor() {
        this.timelineItems = document.querySelectorAll('.timeline-item');
        this.init();
    }
    
    init() {
        this.timelineItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                const marker = item.querySelector('.timeline-marker');
                marker.style.transform = 'scale(1.5)';
            });
            
            item.addEventListener('mouseleave', () => {
                const marker = item.querySelector('.timeline-marker');
                marker.style.transform = 'scale(1)';
            });
        });
    }
}

// ============================================
// HIGHLIGHT CARDS ANIMATION
// ============================================
class HighlightCardsAnimation {
    constructor() {
        this.cards = document.querySelectorAll('.highlight-card');
        this.init();
    }
    
    init() {
        this.cards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = `translateY(-15px) rotate(${Math.random() * 4 - 2}deg)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) rotate(0)';
            });
        });
    }
}

// ============================================
// PARTICLE CLICK EFFECT
// ============================================
class ParticleClickEffect {
    constructor() {
        this.init();
    }
    
    init() {
        document.addEventListener('click', (e) => {
            this.createParticles(e.clientX, e.clientY);
        });
    }
    
    createParticles(x, y) {
        const particleCount = 8;
        const colors = ['#00f0ff', '#ff00ff', '#8b00ff', '#00ff88'];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 2;
            
            particle.style.position = 'fixed';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.zIndex = '9999';
            
            document.body.appendChild(particle);
            
            let posX = x;
            let posY = y;
            let opacity = 1;
            
            const animate = () => {
                posX += Math.cos(angle) * velocity;
                posY += Math.sin(angle) * velocity;
                opacity -= 0.02;
                
                particle.style.left = posX + 'px';
                particle.style.top = posY + 'px';
                particle.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            
            animate();
        }
    }
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================
class KeyboardNavigation {
    constructor() {
        this.sections = ['hero', 'highlights', 'timeline', 'rules', 'login-register', 'coordinators'];
        this.currentSection = 0;
        this.init();
    }
    
    init() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                e.preventDefault();
                this.navigateToSection(1);
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                e.preventDefault();
                this.navigateToSection(-1);
            } else if (e.key === 'Home') {
                e.preventDefault();
                this.scrollToTop();
            } else if (e.key === 'End') {
                e.preventDefault();
                this.scrollToBottom();
            }
        });
    }
    
    navigateToSection(direction) {
        this.currentSection += direction;
        this.currentSection = Math.max(0, Math.min(this.sections.length - 1, this.currentSection));
        
        const section = document.getElementById(this.sections[this.currentSection]);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.currentSection = 0;
    }
    
    scrollToBottom() {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        this.currentSection = this.sections.length - 1;
    }
}

// ============================================
// INITIALIZE ALL FEATURES
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    new CyberBackground();
    new Navbar();
    new RulesAccordion();
    new ScrollAnimations();
    new BackToTop();
    
    // Enhanced effects
    new HeroAnimation();
    new ButtonEffects();
    new TimelineInteraction();
    new HighlightCardsAnimation();
    
    // Optional effects (can be disabled for performance)
    if (window.innerWidth > 768) {
        new CursorTrail();
        new ParticleClickEffect();
    }
    
    // Utilities
    new Preloader();
    new PerformanceOptimizer();
    new KeyboardNavigation();
    
    console.log('🚀 VIBATHON 2026 - Website Loaded Successfully!');
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Random number generator
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// ============================================
// EXPORT FOR TESTING (if needed)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CyberBackground,
        Navbar,
        RulesAccordion,
        ScrollAnimations,
        BackToTop
    };
}
document.querySelectorAll('.admin-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'admin-login.html';
  });
});
// ================================
// UNIVERSAL DATA-REDIRECT HANDLER
// ================================
document.querySelectorAll('[data-redirect]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();

    const target = el.getAttribute('data-redirect');
    if (!target) return;

    window.location.href = target;
  });
});
