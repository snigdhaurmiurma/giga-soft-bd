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

/* 3. Services & AI Solutions Directory Category Filters */
function initServiceFilters() {
  const bindFilterGroup = (navSelector, cardsSelector) => {
    const nav = document.querySelector(navSelector);
    if (!nav) return;
    const tabBtns = nav.querySelectorAll('.service-filter-btn, .service-tab-btn, .directory-filter-btn, .ai-filter-btn');
    const cards = document.querySelectorAll(cardsSelector);

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-filter') || btn.getAttribute('data-category');

        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        cards.forEach(card => {
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
  };

  bindFilterGroup('#servicesFilterNav', '#servicesCardsGrid .directory-service-card');
  bindFilterGroup('#aiSolutionsFilterNav', '#aiSolutionsCardsGrid .directory-service-card');
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
  },
  "ai-solutions": {
    title: "Enterprise AI Solutions & Intelligent Automation",
    cat: "AI & Automation",
    desc: "Production-grade generative AI, custom LLM & RAG enterprise assistants, autonomous workflow automation, computer vision OCR, and predictive machine learning models engineered for measurable ROI.",
    deliverables: ["Custom LLM & RAG Enterprise Chatbots", "AI Workflow & Business Process Automation", "Bangla & English Omnichannel AI Agents", "Document OCR & Computer Vision Pipelines", "Private VPC LLM Hosting & Zero-Trust Guardrails"],
    tech: ["Python", "PyTorch", "LangChain", "OpenAI / Gemini", "pgvector", "FastAPI", "Kubernetes GPU"]
  },
  "business-process-automation": {
    title: "Business Process Automation (BPA)",
    cat: "Business Automation",
    desc: "Unified state-machine orchestration across SAP, Oracle, and custom enterprise ERPs to eliminate manual bottlenecks, synchronize approvals, and enforce audit-grade execution.",
    deliverables: ["Cross-ERP State-Machine Orchestration", "Automated Finance & Procurement Approvals", "SAP, Oracle & Custom REST/SOAP Connectors", "Dead-Letter Recovery & Audit Trail Telemetry", "99.95% SLA High-Throughput Execution"],
    tech: ["Temporal", "Python", "FastAPI", "Kafka", "SAP / Oracle APIs", "PostgreSQL"]
  },
  "ai-workflow-automation": {
    title: "AI Workflow Automation",
    cat: "Business Automation",
    desc: "Multi-agent LLM reasoning pipelines built with LangGraph orchestration and deterministic API tool calling for autonomous multi-step execution across enterprise apps.",
    deliverables: ["Multi-Agent LangGraph Orchestration", "Deterministic Tool Calling & Function Routing", "Human-in-the-Loop Escalation Guardrails", "CRM, Slack, Email & Database Tool Integrations", "Real-Time Agent Observability & Cost Controls"],
    tech: ["LangGraph", "OpenAI / Gemini", "Python", "n8n", "Redis", "Vector DB"]
  },
  "intelligent-document-processing": {
    title: "Intelligent Document Processing (IDP)",
    cat: "Business Automation",
    desc: "Multimodal layout-aware OCR and smart data ingestion engineered for Letters of Credit (LC), commercial invoices, NBR VAT/tax forms, NIDs, and shipping manifests.",
    deliverables: ["Layout-Aware Multimodal OCR Extraction", "LC, Commercial Invoice & NBR Form Schemas", "Confidence Scoring & Exception Review Queue", "Automated ERP & Accounting JSON Ingestion", "Bangla & English Bilingual Extraction"],
    tech: ["Document AI", "Vision LLMs", "PyTorch", "PaddleOCR", "FastAPI", "PostgreSQL"]
  },
  "ai-voice-agent": {
    title: "AI Voice Agent",
    cat: "Business Automation",
    desc: "24/7 conversational AI voice bots featuring sub-500ms voice round-trip latency, natural dual-language fluency in English & Bengali, and direct PBX/SIP telephony integration.",
    deliverables: ["Sub-500ms Full-Duplex Voice Pipeline", "Natural English & Bengali Speech Fluency", "Direct SIP Trunk & Corporate PBX Integration", "Live CRM Lookup, Booking & Ticket Creation", "Warm Call Transfer & Full Transcript Analytics"],
    tech: ["LiveKit / WebRTC", "Asterisk / SIP", "Deepgram", "ElevenLabs", "OpenAI Realtime", "Node.js"]
  },
  "ecommerce-customer-service": {
    title: "Ecommerce Customer Service",
    cat: "Business Automation",
    desc: "Autonomous omnichannel support across WhatsApp, Facebook Messenger, Instagram, and web chat with live Steadfast/Pathao/RedX courier tracking and automated order resolution.",
    deliverables: ["Autonomous WhatsApp, Messenger & Web Chat AI", "Live Courier Tracking & Order Status Sync", "Automated Return, Refund & Exchange Flows", "bKash / Nagad / SSLCommerz Payment Verification", "Bangla, Banglish & English Customer Fluency"],
    tech: ["WhatsApp Cloud API", "Meta Graph API", "LangChain", "Shopify / WooCommerce", "Redis", "Node.js"]
  },
  "ai-scribe-clinical-documentation": {
    title: "AI Scribe for Clinical Notes",
    cat: "Healthcare & Regulated",
    desc: "Ambient clinical listening that converts physician-patient consultations into structured SOAP notes, accurate ICD-10/CPT medical coding, and direct EHR drafts in real time.",
    deliverables: ["Ambient Multi-Speaker Clinical Transcription", "Structured SOAP & Discharge Summary Generation", "Automated ICD-10 & CPT Coding Suggestions", "HL7 FHIR / Epic / Cerner EHR Integration", "HIPAA-Aligned Zero-Retention Privacy Controls"],
    tech: ["Whisper Medical", "HL7 FHIR", "SNOMED-CT", "Python", "Zero-Trust VPC", "AES-256"]
  },
  "prior-authorization-automation": {
    title: "Prior Authorization Automation",
    cat: "Healthcare & Regulated",
    desc: "Accelerate insurance approvals through automated clinical chart parsing, real-time payer policy matching, medical necessity evidence assembly, and EDI 278 / FHIR ePA submissions.",
    deliverables: ["Automated Clinical Chart & Lab Parsing", "Real-Time Payer Coverage Policy Matching", "EDI 278 & HL7 FHIR ePA Submission Engine", "Denial-Risk Detection & Appeal Packet Drafting", "End-to-End Status Tracking & Audit Logs"],
    tech: ["HL7 FHIR", "EDI X12 278", "RAG Policy Engine", "Python", "PostgreSQL", "HIPAA Cloud"]
  },
  "ai-regulatory-document-generation": {
    title: "AI Regulatory Documents",
    cat: "Healthcare & Regulated",
    desc: "Automated authoring of Clinical Study Reports (CSR), CMC modules, and pharma compliance filings with grounded primary-source citation verification and 21 CFR Part 11 auditability.",
    deliverables: ["Automated ICH E3 CSR & eCTD CMC Authoring", "Strict Primary-Source Grounded Citations", "Traceable Claim-to-Table Verification Matrix", "21 CFR Part 11 Compliant Version & Audit Trails", "Private Air-Gapped / VPC Model Deployment"],
    tech: ["Private LLMs", "Citation RAG", "eCTD XML", "Python", "SharePoint / Veeva API", "Zero-Trust IAM"]
  },
  "healthcare-ai-solutions": {
    title: "Healthcare AI Solutions",
    cat: "Healthcare & Regulated",
    desc: "Secure clinical intelligence encompassing predictive inpatient triage, real-time ICU risk telemetry, sepsis early-warning scoring, and DICOM radiology worklist prioritization.",
    deliverables: ["Predictive Inpatient Triage & Deterioration Alerts", "Real-Time ICU Vitals Risk Telemetry Models", "DICOM Radiology PACS Worklist Routing", "Federated & On-Premise Clinical Model Hosting", "HIPAA & ISO 27001 Encrypted Architecture"],
    tech: ["MONAI / PyTorch", "DICOM / PACS", "HL7 FHIR", "Kubernetes GPU", "TimescaleDB", "Vault"]
  },
  "ai-recruitment-automation": {
    title: "AI Recruitment Automation",
    cat: "HR & Hiring",
    desc: "High-volume talent intelligence delivering deep semantic resume parsing, objective role-competency scoring, automated ATS enrichment, and bias-free candidate shortlisting.",
    deliverables: ["Deep Semantic CV & Portfolio Parsing", "Objective Role-Competency Scoring Matrix", "Bias-Mitigated Blind Candidate Ranking", "Two-Way ATS & LinkedIn / HRIS Sync", "Automated Candidate Outreach & Scheduling"],
    tech: ["Embeddings / pgvector", "Python", "FastAPI", "Greenhouse / Lever / ERP API", "React"]
  },
  "ai-interview-automation": {
    title: "AI Interview Automation",
    cat: "HR & Hiring",
    desc: "Adaptive conversational candidate screening featuring dynamic technical and behavioral question branching, anti-cheating signals, and structured executive hiring dossiers.",
    deliverables: ["Adaptive Voice & Video Screening Interviews", "Dynamic Competency-Based Question Branching", "Structured Hiring Scorecards & Transcripts", "Technical Coding & Scenario Evaluation Rubrics", "Instant Recruiter Calibration Dashboards"],
    tech: ["WebRTC", "LLM Evaluators", "Speech AI", "Node.js", "PostgreSQL", "ATS Webhooks"]
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

// Interactive SEO Blog Hub Controller
function initInteractiveBlog() {
  const grid = document.getElementById('blogCardsGrid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.blog-card'));
  const filterPills = Array.from(document.querySelectorAll('#blogFilterPills .blog-filter-pill'));
  const searchInput = document.getElementById('blogSearchInput');
  const searchClear = document.getElementById('blogSearchClear');
  const statusEl = document.getElementById('blogResultsStatus');
  const emptyState = document.getElementById('blogEmptyState');
  const emptyText = document.getElementById('blogEmptyText');
  const resetBtn = document.getElementById('blogResetFiltersBtn');
  const savedCountEl = document.getElementById('savedBlogCount');
  const toastEl = document.getElementById('blogToast');

  // Quick-Reader Modal elements
  const modal = document.getElementById('blogPreviewModal');
  const closeModalBtn = document.getElementById('closeBlogPreviewModal');
  const modalImg = document.getElementById('blogModalImg');
  const modalBadge = document.getElementById('blogModalBadge');
  const modalMeta = document.getElementById('blogModalMeta');
  const modalTitle = document.getElementById('blogModalTitle');
  const modalSummary = document.getElementById('blogModalSummary');
  const modalTakeaways = document.getElementById('blogModalTakeaways');
  const modalFullLink = document.getElementById('blogModalFullLink');
  const modalShareBtn = document.getElementById('blogModalShareBtn');

  const previewData = {
    'ai-enterprise-automation': {
      badge: 'AI & Automation',
      badgeClass: 'blog-badge-violet',
      img: 'images/blog/ai-enterprise-automation.jpg',
      alt: 'Enterprise AI workflow automation, bilingual voice agents, and intelligent document processing',
      meta: 'Nov 20, 2026 • AI Engineering Lab • 6 min read',
      title: 'Enterprise AI Workflow & Voice Automation: Practical ROI Blueprint for 2026',
      summary: 'Enterprise leaders across banking, healthcare, RMG, and e-commerce are moving past experimental chatbots toward deterministic AI agents. By combining LangGraph multi-step orchestration, sub-500ms bilingual Bengali & English AI voice agents, and multimodal OCR document processing, companies eliminate repetitive bottlenecks while preserving full human-in-the-loop governance.',
      takeaways: [
        'Sub-500ms full-duplex AI Voice Agents resolve up to 74% of tier-1 Bangla & English support calls over existing SIP/PBX lines.',
        'Layout-aware Intelligent Document Processing (IDP) extracts Letters of Credit, NBR VAT forms, and invoices directly into ERP ledgers with >99.2% field accuracy.',
        'Private VPC deployment with zero-retention guardrails ensures sensitive corporate and clinical records never train public models.'
      ]
    },
    'it-exports': {
      badge: 'Global Trade & Software',
      badgeClass: 'blog-badge-blue',
      img: 'images/blog/it-exports-global.jpg',
      alt: 'Bangladesh IT exports and global enterprise software engineering studio in Dhaka',
      meta: 'Nov 18, 2026 • Software Architecture Lead • 5 min read',
      title: 'IT Exports Shoot Up 52%: Scaling Enterprise Software from Bangladesh Globally',
      summary: 'Information technology exports from Bangladesh are accelerating rapidly as global enterprises look beyond basic staff augmentation toward full-lifecycle architecture partners. Senior engineering hubs in Dhaka now architect multi-tenant cloud ERPs, PCI-compliant payment bridges, and containerized microservices for North America, Europe, and GCC clients.',
      takeaways: [
        'Full IP handover, SOC 2 / ISO 27001 controls, and automated CI/CD pipelines drive long-term international enterprise trust.',
        'Event-driven Go, Node.js, and Python microservices deliver tier-1 throughput at highly competitive enterprise delivery economics.',
        'AI-augmented QA and observability tooling cut release cycles by 40% across cross-timezone engineering sprints.'
      ]
    },
    'software-slowdown': {
      badge: 'Cloud & Resilience',
      badgeClass: 'blog-badge-emerald',
      img: 'images/blog/cloud-resilience.jpg',
      alt: 'High-availability Kubernetes cloud server clusters and fiber-optic failover architecture',
      meta: 'Nov 12, 2026 • Cloud Infrastructure Lead • 7 min read',
      title: 'Preventing Critical Software Slowdowns in Mission-Critical Cloud Infrastructure',
      summary: 'When mission-critical logistics, customs, or enterprise ERP databases suffer unexpected memory leaks or traffic spikes, operational losses cascade in minutes. Retrofitting monolithic deployments with asynchronous message queues, Horizontal Pod Autoscaling, and distributed Redis caches prevents bottlenecks from taking core transactions offline.',
      takeaways: [
        'Decouple heavy analytical reporting from primary transactional databases using Kafka/RabbitMQ queues and read replicas.',
        'Multi-region Redis in-memory caching offloads 85%+ of repetitive read traffic during peak billing and checkout surges.',
        'Automated Kubernetes HPA and proactive VAPT load testing maintain 99.99% SLA availability under sudden traffic bursts.'
      ]
    },
    'erp-scaling': {
      badge: 'Enterprise Architecture',
      badgeClass: 'blog-badge-blue',
      img: 'images/blog/distributed-erp.jpg',
      alt: 'Distributed enterprise ERP event-driven microservices architecture',
      meta: 'Nov 05, 2026 • Enterprise Core Systems • 5 min read',
      title: 'Scaling Distributed ERP Systems: Event-Driven Microservices Blueprint',
      summary: 'Multi-branch manufacturing plants, warehouses, and retail chains quickly outgrow single-database monolithic ERPs. By applying the Transactional Outbox Pattern with event-driven microservices, Giga Soft decouples accounting journals, procurement, and real-time inventory synchronization without sacrificing strict financial atomicity.',
      takeaways: [
        'Transactional Outbox + Kafka guarantees zero lost accounting or stock-ledger events during network partitions.',
        'Independent domain deployments allow procurement and HR upgrades with zero downtime to POS and invoicing terminals.',
        'Benchmarked production deployments achieve +340% higher concurrency and sub-15ms master catalog queries.'
      ]
    },
    'zero-trust': {
      badge: 'Cybersecurity',
      badgeClass: 'blog-badge-emerald',
      img: 'images/blog/zero-trust-security.jpg',
      alt: 'Zero-Trust Network Access ZTNA cryptographic shield and micro-segmentation architecture',
      meta: 'Oct 28, 2026 • Lead Security Analyst • 7 min read',
      title: 'Zero-Trust Network Access (ZTNA): Why Legacy Perimeter Firewalls Fail',
      summary: 'The legacy castle-and-moat network model assumes everything inside the corporate LAN or VPN is safe. In hybrid cloud and remote-work environments, a single phished credential enables rapid lateral movement. Zero-Trust Network Access enforces continuous cryptographic verification on every identity, device, and API call.',
      takeaways: [
        'Mutual TLS 1.3 micro-segmentation isolates critical ERP and database workloads even inside internal VPC subnets.',
        'Identity-aware proxies enforce least-privilege RBAC and real-time device posture checks on every session.',
        'Quarterly VAPT penetration testing and SIEM anomaly detection close OWASP Top-10 and API vulnerabilities early.'
      ]
    },
    'headless-ecommerce': {
      badge: 'E-Commerce & SEO',
      badgeClass: 'blog-badge-amber',
      img: 'images/blog/headless-ecommerce.jpg',
      alt: 'Headless e-commerce storefront architecture with edge CDN and technical SEO optimization',
      meta: 'Oct 19, 2026 • Digital Commerce Architect • 5 min read',
      title: 'Headless E-Commerce & Technical SEO: Achieving Sub-Second Storefront Speed',
      summary: 'Every 100ms of storefront latency directly erodes organic search rankings and checkout conversions. Decoupling a Next.js/React presentation layer from backend inventory and local payment gateways unlocks edge-cached page loads, rich JSON-LD Product schema, and higher Google Core Web Vitals scores.',
      takeaways: [
        'Server-Side Rendering (SSR) + Edge CDN caching delivers sub-second LCP and 95+ Lighthouse SEO & Performance scores.',
        'Structured Product, BreadcrumbList, and FAQ JSON-LD schema increases organic click-through rates in Google Search.',
        'Seamless API orchestration with bKash, Nagad, SSLCommerz, and live Steadfast/Pathao courier APIs lifts checkout completion.'
      ]
    }
  };

  let activeCategory = 'all';
  let searchQuery = '';
  let activeModalSlug = null;
  let toastTimer = null;

  const STORAGE_KEY = 'giga-blog-bookmarks';
  let bookmarks = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) bookmarks = JSON.parse(raw);
    if (!Array.isArray(bookmarks)) bookmarks = [];
  } catch (e) {
    bookmarks = [];
  }

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
  }

  function syncBookmarkUI() {
    if (savedCountEl) savedCountEl.textContent = String(bookmarks.length);
    document.querySelectorAll('.blog-bookmark-btn').forEach(btn => {
      const slug = btn.getAttribute('data-bookmark');
      const saved = bookmarks.includes(slug);
      btn.classList.toggle('is-saved', saved);
      btn.setAttribute('aria-pressed', saved ? 'true' : 'false');
      btn.title = saved ? 'Remove from saved articles' : 'Save article for later';
    });
  }

  function applyFilters() {
    const q = searchQuery.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach(card => {
      const slug = card.getAttribute('data-post') || '';
      const cat = card.getAttribute('data-category') || '';
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();
      const text = card.textContent.toLowerCase();

      const matchesCategory =
        activeCategory === 'all' ||
        (activeCategory === 'saved' ? bookmarks.includes(slug) : cat === activeCategory);

      const matchesSearch = !q || text.includes(q) || tags.includes(q);
      const show = matchesCategory && matchesSearch;

      card.hidden = !show;
      if (show) visibleCount++;
    });

    if (statusEl) {
      if (q) {
        statusEl.innerHTML = `Showing <strong>${visibleCount}</strong> result${visibleCount === 1 ? '' : 's'} for &ldquo;${q.replace(/[<>&"]/g, '')}&rdquo;`;
      } else if (activeCategory === 'saved') {
        statusEl.innerHTML = `Showing <strong>${visibleCount}</strong> saved article${visibleCount === 1 ? '' : 's'}`;
      } else {
        statusEl.innerHTML = `Showing <strong>${visibleCount}</strong> engineering perspective${visibleCount === 1 ? '' : 's'}`;
      }
    }

    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
      if (emptyText) {
        emptyText.textContent = activeCategory === 'saved' && bookmarks.length === 0
          ? 'You have not bookmarked any articles yet. Click the bookmark icon on any article to save it for later.'
          : 'No articles matched your current filter or search term.';
      }
    }
  }

  function copyArticleUrl(slug) {
    const base = window.location.origin && window.location.origin.startsWith('http')
      ? window.location.origin
      : 'https://giga-soft-bd.vercel.app';
    const url = `${base}/blog-details.html?post=${encodeURIComponent(slug)}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('Article link copied to clipboard!');
      }).catch(() => {
        showToast('Link ready: ' + url);
      });
    } else {
      showToast('Link ready: ' + url);
    }
  }

  function openPreviewModal(slug) {
    const data = previewData[slug];
    if (!modal || !data) return;
    activeModalSlug = slug;
    if (modalImg) {
      modalImg.src = data.img;
      modalImg.alt = data.alt;
    }
    if (modalBadge) {
      modalBadge.textContent = data.badge;
      modalBadge.className = 'blog-meta-badge ' + data.badgeClass;
    }
    if (modalMeta) modalMeta.textContent = data.meta;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalSummary) modalSummary.textContent = data.summary;
    if (modalTakeaways) {
      modalTakeaways.innerHTML = data.takeaways.map(t => `<li>${t}</li>`).join('');
    }
    if (modalFullLink) modalFullLink.href = `blog-details.html?post=${encodeURIComponent(slug)}`;

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closePreviewModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  // Category pill click handlers
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      activeCategory = pill.getAttribute('data-blog-filter') || 'all';
      filterPills.forEach(p => {
        const isActive = p === pill;
        p.classList.toggle('active', isActive);
        p.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      applyFilters();
    });
  });

  // Live search input
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value;
      if (searchClear) searchClear.hidden = !searchQuery;
      applyFilters();
    });
  }

  if (searchClear && searchInput) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      searchClear.hidden = true;
      applyFilters();
      searchInput.focus();
    });
  }

  // Reset button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      activeCategory = 'all';
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      if (searchClear) searchClear.hidden = true;
      filterPills.forEach(p => {
        const isAll = p.getAttribute('data-blog-filter') === 'all';
        p.classList.toggle('active', isAll);
        p.setAttribute('aria-selected', isAll ? 'true' : 'false');
      });
      applyFilters();
    });
  }

  // Clickable topic tags
  grid.querySelectorAll('.blog-topic-tag').forEach(tagBtn => {
    tagBtn.addEventListener('click', () => {
      const q = tagBtn.getAttribute('data-tag-query') || '';
      activeCategory = 'all';
      filterPills.forEach(p => {
        const isAll = p.getAttribute('data-blog-filter') === 'all';
        p.classList.toggle('active', isAll);
        p.setAttribute('aria-selected', isAll ? 'true' : 'false');
      });
      searchQuery = q;
      if (searchInput) searchInput.value = q;
      if (searchClear) searchClear.hidden = !q;
      applyFilters();
    });
  });

  // Bookmark toggles
  grid.querySelectorAll('.blog-bookmark-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const slug = btn.getAttribute('data-bookmark');
      if (!slug) return;
      if (bookmarks.includes(slug)) {
        bookmarks = bookmarks.filter(item => item !== slug);
        showToast('Removed from saved articles');
      } else {
        bookmarks.push(slug);
        showToast('Article saved to bookmarks');
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
      } catch (err) {}
      syncBookmarkUI();
      if (activeCategory === 'saved') applyFilters();
    });
  });

  // Share buttons
  grid.querySelectorAll('.blog-share-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const slug = btn.getAttribute('data-share');
      if (slug) copyArticleUrl(slug);
    });
  });

  // Quick-Reader modal triggers
  grid.querySelectorAll('.blog-preview-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const slug = btn.getAttribute('data-preview');
      if (slug) openPreviewModal(slug);
    });
  });

  if (closeModalBtn) closeModalBtn.addEventListener('click', closePreviewModal);
  if (modal) {
    modal.querySelectorAll('[data-close-blog-modal]').forEach(el => {
      el.addEventListener('click', closePreviewModal);
    });
  }
  if (modalShareBtn) {
    modalShareBtn.addEventListener('click', () => {
      if (activeModalSlug) copyArticleUrl(activeModalSlug);
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePreviewModal();
  });

  syncBookmarkUI();
  applyFilters();
}

// Interactive Case Studies Filter & Detail Modal Controller
function initCaseStudies() {
  const grid = document.getElementById('caseStudiesGrid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.case-editorial-card'));
  const pills = Array.from(document.querySelectorAll('#caseFilterBar .case-filter-pill'));
  const modal = document.getElementById('caseStudyModal');
  const closeBtn = document.getElementById('closeCaseStudyModal');
  const modalImg = document.getElementById('caseModalImg');
  const modalBadge = document.getElementById('caseModalBadge');
  const modalTitle = document.getElementById('caseModalTitle');
  const modalDesc = document.getElementById('caseModalDesc');
  const modalKpis = document.getElementById('caseModalKpis');
  const modalChallenge = document.getElementById('caseModalChallenge');
  const modalSolution = document.getElementById('caseModalSolution');
  const modalTech = document.getElementById('caseModalTech');
  const modalCta = document.getElementById('caseModalCta');
  const serviceSelect = document.getElementById('serviceSelect');

  const caseData = {
    'erp-supply-chain': {
      badge: 'Supply Chain & ERP',
      badgeClass: 'case-badge-blue',
      img: 'images/project/case-erp-supply-chain.jpg',
      alt: 'Enterprise ERP and Supply Chain Modernization',
      title: 'Enterprise ERP & Supply Chain Modernization',
      desc: 'Re-architected a legacy multi-plant manufacturing inventory and logistics system into a multi-tenant cloud ERP featuring live warehouse barcode tracking, automated procurement approvals, and financial ledger synchronization.',
      challenge: 'Fragmented paper-based warehousing across 14 depots caused 18% inventory mismatch, relational lock deadlocks at month-end, and slow fulfillment.',
      solution: 'Engineered an event-driven Go/Node.js & PostgreSQL microservices ERP with the Transactional Outbox Pattern, live barcode scanning, and automated reorder forecasting.',
      kpis: [
        { val: '+340%', lbl: 'Order Speed' },
        { val: '99.98%', lbl: 'Stock Accuracy' },
        { val: '14 Depots', lbl: 'Live Synced' }
      ],
      tech: ['React', 'Node.js', 'PostgreSQL', 'Kafka', 'Docker', 'AWS'],
      serviceKey: 'software-dev'
    },
    'fintech-zerotrust': {
      badge: 'FinTech & Security',
      badgeClass: 'case-badge-violet',
      img: 'images/project/case-fintech-zerotrust.jpg',
      alt: 'Multi-Cloud Migration and Zero-Trust Banking Core',
      title: 'Multi-Cloud Migration & Zero-Trust Banking Core',
      desc: 'Migrated mission-critical financial workloads off aging on-premise hardware into a multi-region Zero-Trust Kubernetes cluster with encrypted service mesh, automated failover, and continuous compliance telemetry.',
      challenge: 'Single-site on-premise servers suffered traffic spike outages, high capital upkeep, and broad internal network exposure.',
      solution: 'Deployed multi-region Kubernetes via Terraform with Istio mutual TLS 1.3 micro-segmentation, HashiCorp Vault secrets rotation, and continuous VAPT pipelines.',
      kpis: [
        { val: '99.999%', lbl: 'Uptime SLA' },
        { val: '-42%', lbl: 'Cloud Infra Cost' },
        { val: 'Zero', lbl: 'Security Breaches' }
      ],
      tech: ['Kubernetes', 'Terraform', 'Vault', 'GCP', 'Istio', 'Zero-Trust'],
      serviceKey: 'cyber-security'
    },
    'headless-commerce': {
      badge: 'Retail & Commerce',
      badgeClass: 'case-badge-emerald',
      img: 'images/project/case-headless-commerce.jpg',
      alt: 'High-Scale Headless E-Commerce and bKash Engine',
      title: 'High-Scale Headless E-Commerce & bKash Engine',
      desc: 'Architected a high-throughput decoupled Next.js storefront paired with edge CDN caching, sub-second catalog filtering, distributed bKash/Nagad/SSLCommerz payment queues, and real-time conversion telemetry.',
      challenge: 'Monolithic e-commerce storefront crashed during Eid & flash-sale campaigns with 4.5s+ mobile loads and high checkout abandonment.',
      solution: 'Decoupled Next.js SSR storefront with Redis in-memory catalog caching, GraphQL gateway, and asynchronous Kafka checkout processing.',
      kpis: [
        { val: '+210%', lbl: 'Merchant GMV' },
        { val: '0.48s', lbl: 'Avg Page Load' },
        { val: '98/100', lbl: 'SEO Score' }
      ],
      tech: ['Next.js', 'GraphQL', 'Redis', 'Kafka', 'bKash API', 'SSLCommerz'],
      serviceKey: 'ecommerce'
    },
    'ai-voice-support': {
      badge: 'AI & Automation',
      badgeClass: 'case-badge-violet',
      img: 'images/project/case-ai-voice-support.jpg',
      alt: 'Bilingual AI Voice Agent and WhatsApp Automation Hub',
      title: 'Bilingual AI Voice & WhatsApp Automation Hub',
      desc: 'Built an autonomous 24/7 customer operations platform combining sub-500ms Bengali & English AI voice agents over corporate SIP/PBX trunks with omnichannel WhatsApp/Messenger order & courier resolution.',
      challenge: 'High inbound call and WhatsApp message volume during peak retail promotions caused 20+ minute hold queues and lost repeat orders.',
      solution: 'Deployed full-duplex WebRTC/SIP AI Voice Agents and LangGraph WhatsApp workflows integrated directly with CRM, Steadfast, Pathao, and RedX APIs.',
      kpis: [
        { val: '74%', lbl: 'Auto-Resolved' },
        { val: '<480ms', lbl: 'Voice Latency' },
        { val: '24/7', lbl: 'Bangla & English' }
      ],
      tech: ['LangGraph', 'SIP / PBX', 'WhatsApp Cloud API', 'Python', 'Redis'],
      serviceKey: 'ai-voice-agent'
    },
    'healthcare-scribe': {
      badge: 'Healthcare AI',
      badgeClass: 'case-badge-emerald',
      img: 'images/project/case-healthcare-scribe.jpg',
      alt: 'Hospital AI Clinical Scribe and FHIR Integration',
      title: 'Hospital AI Clinical Scribe & FHIR Integration',
      desc: 'Engineered a HIPAA-aligned ambient clinical documentation engine hosted in a private Zero-Trust VPC that transcribes doctor-patient visits into structured SOAP notes, prescriptions, and ICD-10 coding drafts.',
      challenge: 'Specialists spent over 2 hours per shift manually typing clinical notes and coding diagnoses, reducing daily outpatient capacity.',
      solution: 'Fine-tuned medical speech transcription with grounded clinical RAG and direct HL7 FHIR EHR synchronization with zero external data retention.',
      kpis: [
        { val: '-62%', lbl: 'Charting Time' },
        { val: '99.4%', lbl: 'ICD-10 Accuracy' },
        { val: 'Private VPC', lbl: 'Zero Retention' }
      ],
      tech: ['Whisper Medical', 'HL7 FHIR', 'Zero-Trust VPC', 'PyTorch', 'AES-256'],
      serviceKey: 'ai-scribe-clinical-documentation'
    },
    'rmg-idp-ocr': {
      badge: 'Manufacturing & Trade',
      badgeClass: 'case-badge-amber',
      img: 'images/project/case-rmg-idp-ocr.jpg',
      alt: 'RMG and Commercial LC Intelligent Document Processing OCR',
      title: 'RMG & Commercial LC Intelligent Document OCR',
      desc: 'Delivered a layout-aware multimodal document intelligence pipeline for export-oriented RMG groups that extracts, validates, and reconciles Letters of Credit, commercial invoices, packing lists, and NBR VAT forms.',
      challenge: 'Commercial teams manually keyed thousands of multi-page LC amendments and supplier invoices each month, risking costly bank discrepancies.',
      solution: 'Built a Vision LLM + PaddleOCR extraction engine with rule-based LC discrepancy checks, exception queues, and direct SAP/ERP JSON posting.',
      kpis: [
        { val: '12x', lbl: 'Faster LC Audit' },
        { val: '99.2%', lbl: 'Field Accuracy' },
        { val: '-78%', lbl: 'Manual Entry' }
      ],
      tech: ['Document AI', 'Vision LLM', 'FastAPI', 'PostgreSQL', 'SAP ERP'],
      serviceKey: 'intelligent-document-processing'
    }
  };

  let activeServiceKey = 'software-dev';

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const filter = pill.getAttribute('data-case-filter') || 'all';
      pills.forEach(p => {
        const isActive = p === pill;
        p.classList.toggle('active', isActive);
        p.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      cards.forEach(card => {
        const cat = card.getAttribute('data-case-cat') || '';
        card.hidden = !(filter === 'all' || cat === filter);
      });
    });
  });

  function openCaseModal(id) {
    const data = caseData[id];
    if (!modal || !data) return;
    activeServiceKey = data.serviceKey || 'software-dev';
    if (modalImg) {
      modalImg.src = data.img;
      modalImg.alt = data.alt;
    }
    if (modalBadge) {
      modalBadge.textContent = data.badge;
      modalBadge.className = 'case-media-badge ' + data.badgeClass;
    }
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalDesc) modalDesc.textContent = data.desc;
    if (modalChallenge) modalChallenge.textContent = data.challenge;
    if (modalSolution) modalSolution.textContent = data.solution;
    if (modalKpis) {
      modalKpis.innerHTML = data.kpis.map(k => `
        <div class="case-modal-kpi-card">
          <div class="case-kpi-val">${k.val}</div>
          <div class="case-kpi-lbl">${k.lbl}</div>
        </div>
      `).join('');
    }
    if (modalTech) {
      modalTech.innerHTML = data.tech.map(t => `<span class="case-tech-tag">${t}</span>`).join('');
    }
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeCaseModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  grid.querySelectorAll('[data-open-case]').forEach(btn => {
    btn.addEventListener('click', () => {
      openCaseModal(btn.getAttribute('data-open-case'));
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeCaseModal);
  if (modal) {
    modal.querySelectorAll('[data-close-case-modal]').forEach(el => {
      el.addEventListener('click', closeCaseModal);
    });
  }
  if (modalCta) {
    modalCta.addEventListener('click', () => {
      closeCaseModal();
      if (serviceSelect && activeServiceKey) {
        const opt = serviceSelect.querySelector(`option[value="${activeServiceKey}"]`);
        if (opt) serviceSelect.value = activeServiceKey;
      }
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCaseModal();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initLiveCalculationEngine();
  initSursumModeSwitcher();
  initInteractiveBlog();
  initCaseStudies();
});
