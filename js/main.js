/**
 * GIGA SOFT LIMITED — THE SOUL OF TECHNOLOGY
 * Core Interactive Scripts & Micro-Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initThemeModeToggle();
  initAccentSwitcher();
  initHeroSlider();
  initCatSlider();
  initServiceFilters();
  initFaqAccordion();
  initCounterAnimation();
  initContactForm();
  initScrollTop();
  initPricingToggle();
  initServiceModal();
  init3DTilt();
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

/* 2. Light / Dark Mode Toggle */
function initThemeModeToggle() {
  const toggleBtn = document.getElementById('themeModeToggle');
  const savedTheme = localStorage.getItem('giga-theme') || 'dark';

  document.documentElement.setAttribute('data-theme', savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('giga-theme', newTheme);

      showToast(`Switched to ${newTheme.toUpperCase()} mode`);
    });
  }
}

/* 3. Hero 10-Picture Interactive Carousel */
function initHeroSlider() {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.hero-slide');
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');
  const dotsContainer = document.getElementById('heroSliderDots');
  const counter = document.getElementById('heroSlideCounter');

  if (!slides.length) return;

  let currentIndex = 0;
  let autoPlayTimer = null;

  // Create dot indicators
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(index) {
    slides[currentIndex].classList.remove('active');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.slider-dot') : [];
    if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

    currentIndex = (index + slides.length) % slides.length;

    slides[currentIndex].classList.add('active');
    if (dots[currentIndex]) dots[currentIndex].classList.add('active');
    if (counter) counter.innerText = currentIndex + 1;
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoPlay();
    });
  }

  function startAutoPlay() {
    autoPlayTimer = setInterval(nextSlide, 3500);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  slider.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
  slider.addEventListener('mouseleave', startAutoPlay);

  startAutoPlay();
}

/* 4. Category Pages 4-Picture Slider */
function initCatSlider() {
  const catSlider = document.getElementById('catSlider');
  if (!catSlider) return;

  const slides = catSlider.querySelectorAll('.cat-slide');
  const prevBtn = document.getElementById('catPrevBtn');
  const nextBtn = document.getElementById('catNextBtn');
  const dotsContainer = document.getElementById('catDots');
  const counter = document.getElementById('catCounter');

  if (!slides.length) return;

  let currentIndex = 0;
  let autoPlayTimer = null;

  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(index) {
    slides[currentIndex].classList.remove('active');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.slider-dot') : [];
    if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

    currentIndex = (index + slides.length) % slides.length;

    slides[currentIndex].classList.add('active');
    if (dots[currentIndex]) dots[currentIndex].classList.add('active');
    if (counter) counter.innerText = currentIndex + 1;
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });

  function startAutoPlay() {
    autoPlayTimer = setInterval(nextSlide, 3800);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  catSlider.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
  catSlider.addEventListener('mouseleave', startAutoPlay);

  startAutoPlay();
}

/* 5. Theme Accent Switcher */
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

      showToast(`Atmosphere switched to ${color.toUpperCase()}`);
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

/* 6. Pricing Billing Toggle (Monthly vs Yearly) */
function initPricingToggle() {
  const toggleBtn = document.getElementById('billingToggle');
  const monthlyLabel = document.querySelector('.billing-label.monthly');
  const yearlyLabel = document.querySelector('.billing-label.yearly');
  const priceElements = document.querySelectorAll('.price-val[data-monthly]');

  if (!toggleBtn) return;

  let isYearly = false;

  toggleBtn.addEventListener('click', () => {
    isYearly = !isYearly;
    toggleBtn.classList.toggle('yearly-active', isYearly);
    monthlyLabel.classList.toggle('active', !isYearly);
    yearlyLabel.classList.toggle('active', isYearly);

    priceElements.forEach(el => {
      const newVal = isYearly ? el.getAttribute('data-yearly') : el.getAttribute('data-monthly');
      el.style.opacity = '0';
      setTimeout(() => {
        el.innerText = newVal;
        el.style.opacity = '1';
      }, 150);
    });

    showToast(isYearly ? "Annual Pricing Applied (20% Discount)" : "Monthly Standard Pricing Applied");
  });
}

/* 7. Interactive 10 Services Deep-Dive Modal */
const serviceDetailsData = {
  "ui-ux": {
    title: "UI/UX Design & Prototyping",
    cat: "Creative & Design",
    desc: "Human-centric design systems, wireframing, and pixel-perfect high-fidelity Figma prototypes engineered for frictionless conversions, intuitive flows, and user delight.",
    deliverables: ["Full Figma Component Design System", "Interactive Clickable Prototypes", "User Journey & Usability Research", "Mobile & Web Layout Assets", "Developer Handoff Specification"],
    tech: ["Figma", "Adobe XD", "Framer", "Protopie", "Design Tokens", "WCAG 2.1 A11y"]
  },
  "web-dev": {
    title: "Full-Stack Web Development",
    cat: "Software & Web",
    desc: "Ultra-fast, responsive web applications engineered with modern web standards, server-side rendering, and scalable backend integrations.",
    deliverables: ["Responsive Multi-Device Layouts", "Next.js / React SSR Architecture", "REST & GraphQL API Endpoints", "SEO Optimized Semantic Code", "Speed Score 95+ Guarantee"],
    tech: ["React.js", "Next.js", "Node.js", "TypeScript", "Tailwind CSS", "Vercel / AWS"]
  },
  "software-dev": {
    title: "Custom Enterprise Software",
    cat: "Software & Web",
    desc: "Bespoke ERPs, custom SaaS suites, inventory management systems, and automated enterprise workflows with bank-grade role-based security.",
    deliverables: ["Custom Business Process Automation", "Multi-Tenant Architecture", "Role-Based Access Control (RBAC)", "Real-Time Analytical Dashboards", "Encrypted Database Architecture"],
    tech: ["Python / Django", "Java / Spring", "PostgreSQL", "Docker", "Redis", ".NET Core"]
  },
  "app-dev": {
    title: "Native & Cross-Platform Mobile Apps",
    cat: "Software & Web",
    desc: "High-performance iOS and Android mobile apps with silky 60fps animations, offline data caching, and native hardware integrations.",
    deliverables: ["iOS & Android Unified Builds", "Push Notification Architecture", "Offline Data Sync & Storage", "Biometric Authentication", "Play Store & App Store Launch"],
    tech: ["Flutter", "Dart", "React Native", "Firebase", "Swift", "Kotlin"]
  },
  "digital-marketing": {
    title: "Performance Digital Marketing",
    cat: "Growth & Marketing",
    desc: "Precision Meta (Facebook/Instagram) ad boosting, Google Search & Display campaigns, and YouTube video ad promotions built to generate qualified leads.",
    deliverables: ["Audience & Competitor Targeting", "Ad Creative & Copy Production", "Pixel & CAPI Server Tracking", "A/B Multivariate Testing", "Weekly Performance ROI Reports"],
    tech: ["Meta Ads Manager", "Google Ads", "Google Analytics 4", "Tag Manager", "SEMrush"]
  },
  "marketing-comm": {
    title: "Marketing & Corporate Communication",
    cat: "Growth & Marketing",
    desc: "Strategic corporate communications, public relations, executive messaging, and reputation management across all commercial and press channels.",
    deliverables: ["Corporate PR & Press Releases", "Multi-Tier Copywriting", "Strategic Brand Voice Guide", "Executive Thought Leadership", "Crisis Communication Plan"],
    tech: ["PR Wire", "Media Relations", "Content Strategy", "Brand Audits", "Editorial Calendars"]
  },
  "branding": {
    title: "Creative Branding & Identity",
    cat: "Creative & Design",
    desc: "Distinctive, authoritative brand identities: logos, complete brand guidelines, stationery, and corporate profiles that command market respect.",
    deliverables: ["Vector Logo Identity Suite", "Complete Corporate Brand Book", "Stationery & Business Collateral", "Typography & Color Matrix", "Packaging & Social Kits"],
    tech: ["Adobe Illustrator", "Photoshop", "Brand Books", "Vector Assets", "Print Standards"]
  },
  "event-activation": {
    title: "Event Management & Brand Activation",
    cat: "Growth & Marketing",
    desc: "Experiential BTL marketing campaigns, corporate technology summits, product launch events, and interactive brand stalls.",
    deliverables: ["360° Event Theme & Concept", "Exhibition Stall & Stage Design", "On-Ground Experiential Tech", "Live Streaming & Media Coverage", "Post-Event Impact Analytics"],
    tech: ["3D Stall Rendering", "Live Production", "LED Visuals", "Audio/Visual", "Crowd Engagement"]
  },
  "ecommerce": {
    title: "E-Commerce Solutions & Portals",
    cat: "Software & Web",
    desc: "High-converting online storefronts with seamless local Bangladeshi payment gateways (bKash, Nagad, Rocket, Upay, Cards) and automated courier sync.",
    deliverables: ["Automated bKash & Nagad Checkout", "Product Catalog & Inventory Matrix", "Courier API Integration (Steadfast/Pathao)", "Order Management Portal", "Customer Retention System"],
    tech: ["WooCommerce", "Shopify", "Custom Node.js", "bKash API", "SSLCommerz", "Nagad API"]
  },
  "hosting": {
    title: "Domain & High-Speed Cloud Hosting",
    cat: "Cloud & Infrastructure",
    desc: "Ultra-fast NVMe cloud hosting, VPS servers, SSL security certificates, and corporate domain management with a 99.9% uptime SLA.",
    deliverables: ["99.9% Guaranteed Uptime SLA", "Enterprise NVMe SSD Storage", "Automated Daily Cloud Backups", "Corporate Email (Webmail/Google Workspace)", "DDoS Protection & Free SSL"],
    tech: ["cPanel / WHM", "AWS Cloud", "Cloudflare CDN", "Linux VPS", "NGINX", "LiteSpeed"]
  }
};

function initServiceModal() {
  const modal = document.getElementById('serviceModal');
  const closeBtn = document.getElementById('closeServiceModal');
  const bookBtn = document.getElementById('modalBookBtn');
  const cards = document.querySelectorAll('.service-card');
  const serviceSelect = document.getElementById('serviceSelect');

  if (!modal) return;

  const openModal = (key) => {
    const data = serviceDetailsData[key] || serviceDetailsData["web-dev"];
    document.getElementById('modalTitle').innerText = data.title;
    document.getElementById('modalCategory').innerText = data.cat;
    document.getElementById('modalDesc').innerText = data.desc;

    // Deliverables
    const delivList = document.getElementById('modalDeliverables');
    delivList.innerHTML = data.deliverables.map(d => `<li>${d}</li>`).join('');

    // Tech Tags
    const techBox = document.getElementById('modalTechTags');
    techBox.innerHTML = data.tech.map(t => `<span class="spec-tag-item">${t}</span>`).join('');

    modal.classList.add('active');
    modal.setAttribute('data-current-service', key);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Card click triggers
  const serviceKeys = ["ui-ux", "web-dev", "software-dev", "app-dev", "digital-marketing", "marketing-comm", "branding", "event-activation", "ecommerce", "hosting"];
  cards.forEach((card, index) => {
    const key = serviceKeys[index] || "web-dev";
    card.addEventListener('click', (e) => {
      openModal(key);
    });

    const linkBtn = card.querySelector('.service-link-btn');
    if (linkBtn) {
      linkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openModal(key);
      });
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Book This Service Button inside Modal
  if (bookBtn) {
    bookBtn.addEventListener('click', () => {
      const key = modal.getAttribute('data-current-service');
      closeModal();
      if (serviceSelect && key) {
        serviceSelect.value = key;
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const messageInput = document.getElementById('projectMessage');
          if (messageInput) messageInput.focus();
        }, 600);
      }
    });
  }
}

/* 8. 3D Card Tilt Mouse Physics */
function init3DTilt() {
  const tiltCards = document.querySelectorAll('.service-card, .pillar-card, .pricing-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
}

/* 9. Contact Form Submission with WhatsApp Option */
function initContactForm() {
  const form = document.getElementById('consultationForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const name = document.getElementById('clientName').value;
    const phone = document.getElementById('clientPhone').value;
    const email = document.getElementById('clientEmail') ? document.getElementById('clientEmail').value : '';
    const service = document.getElementById('serviceSelect').value;
    const msg = document.getElementById('projectMessage').value;

    const originalText = btn.innerHTML;
    btn.innerHTML = `<span>Processing Request...</span>`;
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = `<span>Request Sent Successfully! ✓</span>`;
      btn.style.background = '#10B981';
      showToast(`Thank you, ${name}! We will reach out shortly.`);

      // Optional redirect to WhatsApp with pre-filled message
      const confirmWa = confirm("Your consultation inquiry has been submitted! Would you also like to open WhatsApp to connect with our engineering lead immediately?");
      if (confirmWa) {
        const text = encodeURIComponent(`Hello Giga Soft Limited,\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nService: ${service}\nProject Scope: ${msg}`);
        window.open(`https://wa.me/8801870699677?text=${text}`, '_blank');
      }

      form.reset();

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    }, 1200);
  });
}

/* 10. Scroll To Top */
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

/* Toast Notice Helper */
function showToast(message) {
  const toast = document.getElementById('toastNotice');
  const toastMsg = document.getElementById('toastMessage');
  if (!toast || !toastMsg) return;

  toastMsg.innerText = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
