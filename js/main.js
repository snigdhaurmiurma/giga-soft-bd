/**
 * GIGA SOFT LIMITED — THE SOUL OF TECHNOLOGY
 * Core Interactive Scripts & Micro-Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initAccentSwitcher();
  initServiceFilters();
  initFaqAccordion();
  initCounterAnimation();
  initContactForm();
  initScrollTop();
});

/* 1. Navbar Sticky & Mobile Menu */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  });

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = toggleBtn.querySelector('svg');
      if (navLinks.classList.contains('active')) {
        toggleBtn.innerHTML = `&times;`;
        toggleBtn.style.fontSize = '2rem';
      } else {
        toggleBtn.innerHTML = `&#9776;`;
        toggleBtn.style.fontSize = '1.5rem';
      }
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        toggleBtn.innerHTML = `&#9776;`;
        toggleBtn.style.fontSize = '1.5rem';
      });
    });
  }
}

/* Active Nav Link Spy */
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.pageYOffset;

  sections.forEach(current => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 120;
    const sectionId = current.getAttribute('id');
    const navItem = document.querySelector(`.nav-link[href*="${sectionId}"]`);

    if (navItem && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      navItem.classList.add('active');
    }
  });
}

/* 2. Theme Accent Switcher */
function initAccentSwitcher() {
  const pills = document.querySelectorAll('.accent-pill-btn');
  const savedAccent = localStorage.getItem('giga-accent') || 'blue';

  document.documentElement.setAttribute('data-accent', savedAccent);
  pills.forEach(p => {
    if (p.getAttribute('data-color') === savedAccent) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }

    p.addEventListener('click', () => {
      const color = p.getAttribute('data-color');
      document.documentElement.setAttribute('data-accent', color);
      localStorage.setItem('giga-accent', color);

      pills.forEach(btn => btn.classList.remove('active'));
      p.classList.add('active');
    });
  });
}

/* 3. 10 Core Services Category Filter */
function initServiceFilters() {
  const tabBtns = document.querySelectorAll('.service-tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      serviceCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat.includes(category)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* 4. FAQ Accordion Toggle */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* 5. Number Counter Animation on Viewport Entry */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const suffix = counter.getAttribute('data-suffix') || '';
          let count = 0;
          const speed = target / 40;

          const updateCount = () => {
            count += speed;
            if (count < target) {
              counter.innerHTML = `${Math.ceil(count)}<span>${suffix}</span>`;
              requestAnimationFrame(updateCount);
            } else {
              counter.innerHTML = `${target}<span>${suffix}</span>`;
            }
          };
          updateCount();
        });
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.hero-stats-row');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* 6. Contact Form Submission */
function initContactForm() {
  const form = document.getElementById('consultationForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = `Sending...`;
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = `Consultation Request Sent! ✓`;
      btn.style.background = '#10B981';
      form.reset();

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    }, 1200);
  });
}

/* 7. Scroll To Top */
function initScrollTop() {
  const topBtn = document.querySelector('.float-top');
  if (!topBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      topBtn.classList.add('show');
    } else {
      topBtn.classList.remove('show');
    }
  });

  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
