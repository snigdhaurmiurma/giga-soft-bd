/**
 * GIGA SOFT LIMITED &mdash; THE SOUL OF TECHNOLOGY
 * Core Interactive Scripts & Micro-Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initNavbar();
  initThemeModeToggle();
  initAccentSwitcher();
  initHeroSlider();
  initServiceShowcase();
  initCatSlider();
  initServiceFilters();
  initFaqAccordion();
  initCounterAnimation();
  initContactForm();
  initScrollTop();
  initPricingToggle();
  initServiceModal();
  init3DTilt();
  initHeroTopology();
});

/* 0. Ambient Interactive Canvas Animation */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;

  // Respect system reduced-motion accessibility preference
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 28 : 55;
  let mouse = { x: null, y: null, radius: 120 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function getThemeColors() {
    const accent = document.documentElement.getAttribute('data-accent') || 'blue';
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    
    switch (accent) {
      case 'orange':
        return isLight ? 'rgba(234, 88, 12, ' : 'rgba(255, 120, 30, ';
      case 'purple':
        return isLight ? 'rgba(124, 58, 237, ' : 'rgba(192, 132, 252, ';
      case 'emerald':
        return isLight ? 'rgba(5, 150, 105, ' : 'rgba(52, 211, 153, ';
      default:
        // Saturated, vibrant cobalt blue for light mode so particles and neural lines pop vividly
        return isLight ? 'rgba(37, 99, 235, ' : 'rgba(56, 189, 248, ';
    }
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.2 + 1;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.baseAlpha = Math.random() * 0.45 + 0.25;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactive push
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
        }
      }
    }

    draw(colorPrefix, isLight) {
      ctx.beginPath();
      const dotSize = isLight ? this.size + 1.2 : this.size;
      ctx.arc(this.x, this.y, dotSize, 0, Math.PI * 2);
      const alphaVal = isLight ? Math.min(1, this.baseAlpha + 0.40) : this.baseAlpha;
      ctx.fillStyle = colorPrefix + alphaVal + ')';
      ctx.shadowBlur = isLight ? 12 : 8;
      ctx.shadowColor = colorPrefix + (isLight ? '0.85)' : '0.6)');
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const colorPrefix = getThemeColors();

    // Connect close particles with neural constellation lines (clearly visible in both light & dark)
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = isLight ? 150 : 140;

        if (dist < maxDist) {
          const alphaFactor = isLight ? 0.60 : 0.28;
          const alpha = (1 - dist / maxDist) * alphaFactor;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = colorPrefix + alpha + ')';
          ctx.lineWidth = isLight ? 1.6 : 1;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw(colorPrefix, isLight);
    });

    requestAnimationFrame(animate);
  }

  animate();
}

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

/* 3. Full-Bleed Agency Hero Slider & Interactive Service Showcase */
function initHeroSlider() {
  const track = document.getElementById('agencyHeroTrack');
  const slides = track ? track.querySelectorAll('.agency-hero-slide') : document.querySelectorAll('.hero-slide');
  const prevBtn = document.getElementById('agencyHeroPrev') || document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('agencyHeroNext') || document.getElementById('heroNextBtn');
  const dotsContainer = document.getElementById('agencyHeroDots') || document.getElementById('heroSliderDots');

  if (!slides || !slides.length) return;

  let currentIndex = 0;
  let autoPlayTimer = null;

  // Create dot indicators
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `agency-dot ${i === 0 ? 'active' : ''}`;
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
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.agency-dot, .slider-dot') : [];
    if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

    currentIndex = (index + slides.length) % slides.length;

    slides[currentIndex].classList.add('active');
    if (dots[currentIndex]) dots[currentIndex].classList.add('active');
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
    autoPlayTimer = setInterval(nextSlide, 2500); // 2.5s smooth transition
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  const container = document.getElementById('home') || track;
  if (container) {
    container.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    container.addEventListener('mouseleave', startAutoPlay);
  }

  startAutoPlay();
}

/* 3.1 Interactive Agency Service Showcase Tabs */
function initServiceShowcase() {
  const tabsNav = document.getElementById('showcaseTabsNav');
  if (!tabsNav) return;

  const tabBtns = tabsNav.querySelectorAll('.showcase-tab-btn');
  const panels = document.querySelectorAll('.showcase-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const service = btn.getAttribute('data-service');
      
      // Update active tab button
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update active panel
      panels.forEach(p => {
        p.classList.remove('active');
        if (p.id === `showcase-${service}`) {
          p.classList.add('active');
        }
      });
    });
  });
}

/* 4. Category Pages 4-Picture Slider */
function initCatSlider() {
  const catSlider = document.getElementById('catSlider');
  if (!catSlider) return;

  const slides = catSlider.querySelectorAll('.cat-slide');
  const prevBtn = document.getElementById('catPrevBtn') || document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('catNextBtn') || document.getElementById('sliderNext');
  const dotsContainer = document.getElementById('catDots') || document.getElementById('sliderDots');
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
    autoPlayTimer = setInterval(nextSlide, 2000);
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
  updateThemeImages(savedAccent);

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
      updateThemeImages(color);
    });
  });
}

/* 3. 14 Technical Services Directory Category Filter */
function initServiceFilters() {
  const tabBtns = document.querySelectorAll('.service-filter-btn, .service-tab-btn, .directory-filter-btn');
  const serviceCards = document.querySelectorAll('.services-cards-grid .service-box, .service-card, .directory-service-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter') || btn.getAttribute('data-category');

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      serviceCards.forEach(card => {
        const cardCat = card.getAttribute('data-category') || '';
        if (category === 'all' || cardCat.includes(category)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/* 3.1 Interactive Hero Architecture & Topology Live Telemetry */
function initHeroTopology() {
  const nodes = document.querySelectorAll('.topology-node');
  const statLatency = document.querySelectorAll('.console-stat-val')[1];
  const statThroughput = document.querySelectorAll('.console-stat-val')[2];

  if (!nodes.length) return;

  // Gentle live telemetry updates
  setInterval(() => {
    if (statLatency) {
      const ms = Math.floor(10 + Math.random() * 5);
      statLatency.textContent = `${ms}ms`;
    }
    if (statThroughput) {
      const tp = (1.3 + Math.random() * 0.3).toFixed(1);
      statThroughput.textContent = `${tp}M/s`;
    }
  }, 3500);

  nodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      node.style.borderColor = 'var(--accent-cobalt-light)';
    });
    node.addEventListener('mouseleave', () => {
      node.style.borderColor = '';
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
  },
  "it-solutions": {
    title: "IT Solutions & Infrastructure Engineering",
    cat: "Software & Web",
    desc: "Comprehensive enterprise IT systems, high-availability internal networking, automated workflows, and corporate technology advisory.",
    deliverables: ["High-Availability Mesh Networks", "Zero-Latency Routing & VPNs", "Internal Communication Protocols", "Enterprise Active Directory & IAM", "24/7 SLA Engineering Support"],
    tech: ["Cisco", "Fortinet", "Windows Server", "Linux", "Kubernetes", "VMware"]
  },
  "cyber-security": {
    title: "Cyber Security & Zero-Trust Defense",
    cat: "Cloud, Security & Data",
    desc: "Vulnerability assessment, ethical penetration testing (VAPT), Zero-Trust IAM access control, and encrypted multi-cloud infrastructure.",
    deliverables: ["OWASP Top 10 Penetration Audit", "Zero-Trust IAM Enforcement", "Automated Threat Detection", "DDoS Mitigation Architecture", "Regulatory Compliance Certificate"],
    tech: ["Burp Suite", "Kali Linux", "Wireshark", "Metasploit", "Cloudflare", "Sentinel"]
  },
  "cloud-services": {
    title: "Cloud Infrastructure & Multi-Cloud DevOps",
    cat: "Cloud, Security & Data",
    desc: "Enterprise cloud migration, automated CI/CD deployment pipelines, container orchestration, and multi-region failover across AWS, GCP, and Azure.",
    deliverables: ["Terraform Infrastructure as Code", "Docker & Kubernetes Clusters", "Zero-Downtime CI/CD Pipelines", "Auto-Scaling & Load Balancing", "Multi-Cloud Backup & DR Plan"],
    tech: ["AWS", "Google Cloud", "Microsoft Azure", "Terraform", "Docker", "Kubernetes"]
  },
  "data-analytics": {
    title: "Data Analytics & Business Intelligence",
    cat: "Cloud, Security & Data",
    desc: "Unify fragmented data silos into high-speed executive dashboards, automated ETL pipelines, predictive customer analytics, and data warehousing.",
    deliverables: ["Real-Time Executive Dashboards", "BigQuery / Snowflake Warehouses", "Automated ETL/ELT Ingestion", "Predictive Machine Learning Models", "Multi-Touch Attribution Systems"],
    tech: ["Power BI", "Tableau", "BigQuery", "Python / Pandas", "Apache Spark", "dbt"]
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
    const modalTitle = document.getElementById('modalTitle');
    const modalCat = document.getElementById('modalCategory');
    const modalDesc = document.getElementById('modalDesc');
    const delivList = document.getElementById('modalDeliverables');
    const techBox = document.getElementById('modalTechTags');

    if (modalTitle) modalTitle.innerText = data.title;
    if (modalCat) modalCat.innerText = data.cat;
    if (modalDesc) modalDesc.innerText = data.desc;

    // Deliverables
    if (delivList && data.deliverables) {
      delivList.innerHTML = data.deliverables.map(d => `<li>${d}</li>`).join('');
    }

    // Tech Tags
    if (techBox && data.tech) {
      techBox.innerHTML = data.tech.map(t => `<span class="spec-tag-item">${t}</span>`).join('');
    }

    modal.classList.add('active');
    modal.setAttribute('data-current-service', key);
    document.body.style.overflow = 'hidden';
  };

  // Expose globally for onclick handlers
  window.openServiceModalFromCard = openModal;

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

/* Helper to prevent XSS in dynamic alert DOM */
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, function(m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
  });
}

/* 9. Contact Form Submission with Dual Reliable Delivery & Instant Actions (No Browser Popups) */
function initContactForm() {
  const forms = document.querySelectorAll('#consultationForm, #consultForm, .contact-form');
  if (!forms.length) return;

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const nameInput = form.querySelector('#clientName') || form.querySelector('input[type="text"]');
      const phoneInput = form.querySelector('#clientPhone') || form.querySelector('input[type="tel"]');
      const emailInput = form.querySelector('#clientEmail') || form.querySelector('input[type="email"]');
      const serviceInput = form.querySelector('#serviceSelect') || form.querySelector('select');
      const msgInput = form.querySelector('#projectMessage') || form.querySelector('textarea');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const service = serviceInput ? serviceInput.value : 'General Software Inquiry';
      const msg = msgInput ? msgInput.value.trim() : '';

      const statusAlert = form.parentElement.querySelector('.form-status-alert') || document.getElementById('formStatusAlert');

      if (!name || !phone || !email || !msg) {
        if (statusAlert) {
          statusAlert.innerHTML = `
            <div class="form-alert-content">
              <div class="form-alert-header">
                <div class="alert-icon-wrap" style="background: rgba(239, 68, 68, 0.15); color: #EF4444;">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <div>
                  <h4 class="form-alert-title" style="color: #EF4444;">Please Complete All Required Fields</h4>
                  <p class="form-alert-text">Make sure to provide your name, phone number, email address, and project requirements.</p>
                </div>
              </div>
            </div>
          `;
          statusAlert.style.display = 'block';
          statusAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return;
      }

      const originalHTML = btn ? btn.innerHTML : 'Submit Request';
      if (btn) {
        btn.innerHTML = `<span>Sending Consultation Request...</span>`;
        btn.disabled = true;
      }

      const leadId = 'GSL-' + Date.now().toString().slice(-6);

      // 1. Primary Dispatch: Vercel Serverless Function (/api/contact)
      try {
        const vercelRes = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name,
            phone: phone,
            email: email,
            service: service,
            message: msg,
            reference: leadId
          })
        });
        if (vercelRes.ok) {
          const resData = await vercelRes.json();
          console.log('[API] Consultation successfully sent via /api/contact:', resData);
        }
      } catch (err) {
        console.warn('/api/contact dispatch note:', err);
      }

      // 2. Secondary Dispatch: Direct PHP Handler (if hosted on Apache / LiteSpeed)
      try {
        await fetch('api/contact.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name,
            phone: phone,
            email: email,
            service: service,
            message: msg
          })
        });
      } catch (err) {
        // Handled silently
      }

      // 3. Fallback Dispatch: FormSubmit AJAX endpoint to gigasoftbd@gmail.com
      try {
        await fetch('https://formsubmit.co/ajax/gigasoftbd@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `New Consultation Request [${leadId}] - ${name} (${service || 'General'})`,
            _replyto: email,
            _template: 'table',
            _captcha: 'false',
            reference_id: leadId,
            client_name: name,
            client_phone: phone,
            client_email: email,
            service_requested: service,
            project_message: msg,
            submitted_url: window.location.href,
            timestamp: new Date().toISOString()
          })
        });
      } catch (err) {
        console.warn('FormSubmit endpoint notice:', err);
      }

      // 4. Local Storage Backup
      try {
        const leads = JSON.parse(localStorage.getItem('gigasoft_leads_db') || '[]');
        leads.unshift({
          id: leadId,
          name: name,
          phone: phone,
          email: email,
          service: service,
          message: msg,
          date: new Date().toLocaleString()
        });
        localStorage.setItem('gigasoft_leads_db', JSON.stringify(leads.slice(0, 100)));
      } catch (e) {}

      // 5. Update UI Button Status & Toast
      if (btn) {
        btn.innerHTML = `<span>Request Sent Successfully!</span>`;
        btn.style.background = '#10B981';
      }
      showToast(`Thank you, ${name}! Your inquiry (${leadId}) has been submitted.`);

      // 6. Inline Success Banner (Zero browser popups: No alert, no confirm!)
      const directWaLink = `https://wa.me/8801778741894?text=${encodeURIComponent(`Hello Giga Soft Limited,\nInquiry Ref: ${leadId}\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nService: ${service}\nMessage: ${msg}`)}`;

      if (statusAlert) {
        statusAlert.innerHTML = `
          <div class="form-alert-content">
            <div class="form-alert-header">
              <div class="alert-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div>
                <h4 class="form-alert-title">Submitted Successfully!</h4>
                <p class="form-alert-text">
                  Thank you, <strong>${escapeHtml(name)}</strong>. Your request (Ref: <code>${leadId}</code>) has been submitted. Our team will contact you soon!
                </p>
              </div>
            </div>
            <div class="form-alert-actions">
              <a href="${directWaLink}" target="_blank" rel="noopener noreferrer" class="btn-alert-wa">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
                <span>Instant Chat on WhatsApp</span>
              </a>
              <button type="button" class="btn-alert-dismiss" onclick="this.closest('.form-status-alert').style.display='none'">Dismiss</button>
            </div>
          </div>
        `;
        statusAlert.style.display = 'block';
        statusAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      form.reset();

      if (btn) {
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.background = '';
          btn.disabled = false;
        }, 4500);
      }
    });
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


/* 12. Theme Atmosphere Image Switcher */
const themeImageMap = {
  blue: {
    who: "images/resource/about-one-img-1.jpg",
    services: [
      "images/services/services-1-1.jpg",
      "images/services/services-1-2.jpg",
      "images/services/services-1-3.jpg",
      "images/services/services-1-4.jpg",
      "images/services/services-1-5.jpg",
      "images/services/services-1-6.jpg"
    ]
  },
  orange: {
    who: "images/resource/why-choose-one-img.jpg",
    services: [
      "images/services/services-3-1.jpg",
      "images/services/services-3-2.jpg",
      "images/services/services-3-3.jpg",
      "images/services/services-3-4.jpg",
      "images/resource/about-one-img-2.jpg",
      "images/resource/why-choose-one-img-2.jpg"
    ]
  },
  purple: {
    who: "images/blog/blog-2-3.jpg",
    services: [
      "images/service-sliders/cat-design-1.jpg",
      "images/service-sliders/cat-design-2.jpg",
      "images/service-sliders/cat-design-3.jpg",
      "images/service-sliders/cat-design-4.jpg",
      "images/blog/blog-3-1.jpg",
      "images/blog/blog-3-2.jpg"
    ]
  },
  emerald: {
    who: "images/resource/about-one-standard-img.jpg",
    services: [
      "images/service-sliders/cat-cloud-1.jpg",
      "images/service-sliders/cat-cloud-2.jpg",
      "images/service-sliders/cat-cloud-3.jpg",
      "images/service-sliders/cat-cloud-4.jpg",
      "images/blog/blog-3-3.jpg",
      "images/services/services-1-8.jpg"
    ]
  }
};

function updateThemeImages(accent) {
  const map = themeImageMap[accent] || themeImageMap['blue'];
  
  // 1. Who We Are Image with crossfade
  const whoImg = document.getElementById('whoWeAreImg');
  if (whoImg && map.who) {
    whoImg.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    whoImg.style.opacity = '0';
    whoImg.style.transform = 'scale(0.96)';
    setTimeout(() => {
      whoImg.src = map.who;
      whoImg.style.opacity = '1';
      whoImg.style.transform = 'scale(1)';
    }, 180);
  }

  // 2. Service Cards Images with staggered crossfade
  const serviceImgs = document.querySelectorAll('.service-box-img img');
  serviceImgs.forEach((img, idx) => {
    if (map.services && map.services[idx]) {
      img.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      img.style.opacity = '0';
      img.style.transform = 'scale(0.96)';
      setTimeout(() => {
        img.src = map.services[idx];
        img.style.opacity = '1';
        img.style.transform = 'scale(1)';
      }, 120 + idx * 30);
    }
  });
}


/* Live Calculation Engine for Competency Matrix */
function initLiveCalculationEngine() {
  const container = document.getElementById('liveCalcContainer');
  if (!container) return;

  let calculated = false;

  function runCalculations() {
    if (calculated) return;
    calculated = true;

    const valElements = container.querySelectorAll('.live-calc-val');
    const barElements = container.querySelectorAll('.live-calc-bar');

    valElements.forEach((el, index) => {
      const target = parseInt(el.getAttribute('data-target'), 10) || 80;
      let current = 0;
      const stepTime = Math.max(12, Math.floor(1200 / target));

      const interval = setInterval(() => {
        current += 1;
        el.innerText = current + '%';
        if (current >= target) {
          el.innerText = target + '%';
          clearInterval(interval);
        }
      }, stepTime + index * 4);
    });

    barElements.forEach(bar => {
      const targetWidth = bar.getAttribute('data-width') || '80%';
      bar.style.width = '0%';
      setTimeout(() => {
        bar.style.transition = 'width 1.4s cubic-bezier(0.16, 1, 0.3, 1)';
        bar.style.width = targetWidth;
      }, 100);
    });
  }

  // IntersectionObserver to trigger on scroll
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCalculations();
        }
      });
    }, { threshold: 0.25 });
    observer.observe(container);
  } else {
    runCalculations();
  }

  // Periodic micro-jitter for live feel
  setInterval(() => {
    const latencyEl = document.getElementById('liveLatency');
    if (latencyEl) {
      const ms = Math.floor(Math.random() * 4) + 10;
      latencyEl.innerText = ms + 'ms';
    }
  }, 3500);
}

// Sursum Mode Tabs Interactive Switcher
function initSursumModeSwitcher() {
  const tabBtns = document.querySelectorAll('.eco-tab-btn');
  const satellites = document.querySelectorAll('.satellite-card');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-tab');

      satellites.forEach(sat => {
        sat.style.transition = 'all 0.3s ease';
        if (mode === 'all') {
          sat.style.opacity = '1';
          sat.style.transform = 'scale(1)';
        } else if (sat.getAttribute('data-module') === mode || mode === 'infra') {
          sat.style.opacity = '1';
          sat.style.transform = 'scale(1.05)';
        } else {
          sat.style.opacity = '0.65';
          sat.style.transform = 'scale(0.96)';
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initLiveCalculationEngine();
  initSursumModeSwitcher();
});
