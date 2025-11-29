/* ========================================
   MODERN PORTFOLIO - SCRIPT.JS
   Animations and Interactions
======================================== */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all features
  initTypingEffect();
  initTabNavigation();
  initScrollAnimations();
  initSkillBars();
  initParticleBackground();
  initMobileNavSlideHint();
});

/* ========================================
   TYPING EFFECT
======================================== */
function initTypingEffect() {
  const typingElement = document.querySelector('.typing-text');
  if (!typingElement) return;

  const texts = [
    'Software Engineer',
    'Full Stack Developer', 
    'AI Developer',
    'Web Developer'
  ];
  
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
      typingElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
      typingSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typingSpeed = 500; // Pause before new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ========================================
   TAB NAVIGATION
======================================== */
function initTabNavigation() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;

      // Remove active class from all
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Add active class to clicked tab
      btn.classList.add('active');
      const activeContent = document.getElementById(tabId);
      if (activeContent) {
        activeContent.classList.add('active');
        
        // Trigger fade-in animations for newly visible content
        setTimeout(() => {
          triggerFadeInAnimations(activeContent);
          
          // Re-trigger skill bar animations if skills tab
          if (tabId === 'skills') {
            animateSkillBars();
          }
        }, 100);
      }
    });
  });

  // Initial trigger for active tab
  const activeTab = document.querySelector('.tab-content.active');
  if (activeTab) {
    triggerFadeInAnimations(activeTab);
  }
}

/* ========================================
   SCROLL ANIMATIONS (Fade-in on scroll)
======================================== */
function initScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(element => {
    observer.observe(element);
  });
}

function triggerFadeInAnimations(container) {
  const fadeElements = container.querySelectorAll('.fade-in');
  fadeElements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add('visible');
    }, index * 100);
  });
}

/* ========================================
   SKILL BARS ANIMATION
======================================== */
function initSkillBars() {
  // Initial animation for visible skill bars
  const skillsTab = document.getElementById('skills');
  if (skillsTab && skillsTab.classList.contains('active')) {
    setTimeout(animateSkillBars, 500);
  }
}

function animateSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');
  
  skillBars.forEach((bar, index) => {
    const progress = bar.dataset.progress;
    // Reset first
    bar.style.width = '0%';
    
    // Animate after a staggered delay
    setTimeout(() => {
      bar.style.width = progress + '%';
    }, 200 + (index * 100));
  });
}

/* ========================================
   PARTICLE BACKGROUND
======================================== */
function initParticleBackground() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  
  // Configuration - reduced for better performance
  const config = {
    particleCount: 50, // Reduced from 80 for better performance
    particleSize: { min: 1, max: 3 },
    speed: { min: 0.2, max: 0.8 },
    connectionDistance: 120, // Reduced for fewer connection calculations
    colors: ['#667eea', '#64ffda', '#f093fb', '#4facfe']
  };

  // Resize canvas
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Particle class
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * (config.particleSize.max - config.particleSize.min) + config.particleSize.min;
      this.speedX = (Math.random() - 0.5) * (config.speed.max - config.speed.min) + config.speed.min;
      this.speedY = (Math.random() - 0.5) * (config.speed.max - config.speed.min) + config.speed.min;
      this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around edges
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // Initialize particles
  function initParticles() {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
      particles.push(new Particle());
    }
  }

  // Draw connections between nearby particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.connectionDistance) {
          const opacity = (1 - distance / config.connectionDistance) * 0.3;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = particles[i].color;
          ctx.globalAlpha = opacity;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    drawConnections();
    animationId = requestAnimationFrame(animate);
  }

  // Initialize
  resizeCanvas();
  initParticles();
  animate();

  // Handle resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      initParticles();
    }, 200);
  });

  // Pause animation when tab is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });
}

/* ========================================
   SMOOTH SCROLL FOR ANCHOR LINKS
======================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

/* ========================================
   FORM HANDLING
======================================== */
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;
    
    // Re-enable after submission (form will handle redirect)
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 3000);
  });
}

/* ========================================
   HOVER EFFECTS ENHANCEMENT
======================================== */
// Add subtle mouse follow effect to cards
const cards = document.querySelectorAll('.service-card, .portfolio-card, .skill-item');

cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const angleX = (y - centerY) / 20;
    const angleY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-5px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});

/* ========================================
   PRELOADER (Optional)
======================================== */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  
  // Trigger initial animations
  setTimeout(() => {
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab) {
      triggerFadeInAnimations(activeTab);
    }
  }, 300);
});

/* ========================================
   MOBILE NAVIGATION SLIDE HINT
======================================== */
function initMobileNavSlideHint() {
  const navTabs = document.querySelector('.nav-tabs');
  
  // Check if mobile
  if (window.innerWidth <= 768 && navTabs) {
    // Calculate dynamic scroll distance based on container width
    const scrollDistance = Math.min(navTabs.scrollWidth - navTabs.clientWidth, navTabs.clientWidth * 0.3);
    
    // Add slide hint class after a short delay
    setTimeout(() => {
      navTabs.classList.add('slide-hint');
      
      // Also physically scroll to show there's more content
      navTabs.scrollTo({ left: scrollDistance, behavior: 'smooth' });
      
      setTimeout(() => {
        navTabs.scrollTo({ left: 0, behavior: 'smooth' });
        navTabs.classList.remove('slide-hint');
      }, 800);
    }, 500);
  }
}
