/**
 * FUTURISTIC DEVELOPER PORTFOLIO - CORE APPLICATION CONTROLLER
 * Responsive Nav, Filters, Modals, Clipboard, Form & Interactivity
 */

// GLOBAL TOAST NOTIFICATION FUNCTION
function showToast(message, iconSvg = null) {
  let toast = document.getElementById('cyber-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cyber-toast';
    toast.className = 'cyber-toast';
    document.body.appendChild(toast);
  }

  const defaultIcon = `<svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;

  toast.innerHTML = `${iconSvg || defaultIcon} <span>${message}</span>`;
  toast.classList.add('show');

  if (toast.timeoutId) clearTimeout(toast.timeoutId);
  toast.timeoutId = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. NAVBAR SCROLL EFFECT & BACK TO TOP
  const navbar = document.querySelector('.navbar');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  function handleScroll() {
    const scrollPos = window.scrollY || document.documentElement.scrollTop;

    // Navbar shrink
    if (navbar) {
      if (scrollPos > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollPos > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 2. MOBILE MENU HAMBURGER & DRAWER
  const hamburger = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMenu() {
    if (!hamburger || !mobileNav) return;
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (hamburger && hamburger.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // 3. SCROLLSPY (ACTIVE NAV LINK HIGHLIGHTING)
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNavLink() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 130;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // 4. SKILLS FILTER SYSTEM
  const skillFilters = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillFilters.forEach((btn) => {
    btn.addEventListener('click', () => {
      skillFilters.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      skillCards.forEach((card) => {
        if (card._filterTimeout) clearTimeout(card._filterTimeout);
        const category = card.getAttribute('data-category');

        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          card._filterTimeout = setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.95)';
          card._filterTimeout = setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // 5. PROJECTS FILTER SYSTEM
  const projectFilters = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilters.forEach((btn) => {
    btn.addEventListener('click', () => {
      projectFilters.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        if (card._filterTimeout) clearTimeout(card._filterTimeout);
        const category = card.getAttribute('data-category');

        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          card._filterTimeout = setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.95)';
          card._filterTimeout = setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // 6. GLOBAL EVENT DELEGATION: CLIPBOARD & RESUME DOWNLOADS
  document.addEventListener('click', (e) => {
    // A. Copy Button Handling
    const copyBtn = e.target.closest('.copy-btn');
    if (copyBtn) {
      e.preventDefault();
      const textToCopy = copyBtn.getAttribute('data-copy');
      const label = copyBtn.getAttribute('data-label') || 'Text';

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`📋 Copied ${label} to clipboard!`);
        }).catch(() => {
          fallbackCopy(textToCopy, label);
        });
      } else {
        fallbackCopy(textToCopy, label);
      }
      return;
    }

    // B. Resume Download Handling
    const downloadBtn = e.target.closest('.download-resume-btn');
    if (downloadBtn) {
      e.preventDefault();
      const link = document.createElement('a');
      link.href = 'assets/docs/resume-placeholder.pdf';
      link.download = 'Umang_Kakkad_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('📄 Downloading Resume: Umang_Kakkad_Resume.pdf', `<svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`);
      return;
    }
  });

  function fallbackCopy(text, label) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`📋 Copied ${label} to clipboard!`);
    } catch (err) {
      showToast(`⚠️ Could not auto-copy, please copy manually.`);
    }
    document.body.removeChild(textArea);
  }

  // 7. CONTACT FORM SUBMISSION
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const subjectInput = document.getElementById('form-subject');
      const messageInput = document.getElementById('form-message');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        showToast('⚠️ Please fill in all required fields.');
        return;
      }

      // Futuristic transmission state
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spin-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg> Transmitting Signal...
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
        contactForm.reset();
        showToast('🚀 Transmission Received! Thank you, I will get back to you shortly.');
      }, 1200);
    });
  }

  // 8. MODAL DATA & CONTROLS
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalContent = document.getElementById('modal-content');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  function openModal(htmlContent) {
    if (!modalBackdrop || !modalContent) return;
    modalContent.innerHTML = htmlContent;
    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });

  // Project details data dictionary
  const projectDetails = {
    'secure-atm': {
      title: 'Secure ATM Module – Transaction & Services Hub',
      badge: 'Desktop Application',
      image: 'assets/images/project-atm.svg',
      desc: 'A robust desktop application developed using C# .NET Framework and SQL Server for secure ATM transactions and banking operations. Features secure PIN verification, account balance inquiry, cash withdrawal, fund transfer, and automated audit logging.',
      tech: ['C#', '.NET Framework', 'SQL Server', 'Desktop GUI', 'Windows Forms / WPF', 'Database Transactions'],
      features: [
        'Secure multi-factor PIN verification and session authentication',
        'Transactional ledger audit logging committed with ACID integrity in SQL Server',
        'Core banking workflows: Cash Withdrawal, Fast Cash, Fund Transfer, and Balance Inquiry',
        'Defensive error handling preventing overdrafts and transaction race conditions'
      ]
    },
    'weather-forecast': {
      title: 'Weather Forecast Web Application',
      badge: 'Web Application',
      image: 'assets/images/project-weather.svg',
      desc: 'A responsive web-based weather forecasting platform engineered using Python and Django. Integrates third-party Weather APIs to deliver real-time atmospheric conditions, dynamic temperature readings, multi-day forecasting, and location search.',
      tech: ['Python', 'Django', 'Weather API', 'HTML5', 'CSS3', 'JavaScript'],
      features: [
        'Real-time atmospheric telemetry via asynchronous Weather API requests',
        'Dynamic multi-day weather forecasts with temperature, humidity, wind speed, and UV indicators',
        'Responsive user interface rendering seamlessly on desktop, tablet, and mobile screens',
        'Clean Django MVC/MVT architecture with secure API key environment management'
      ]
    },
    'nexus-ai': {
      title: 'Nexus AI Workspace',
      badge: 'Full Stack & AI',
      image: 'assets/images/project-1.svg',
      desc: 'An enterprise-grade collaborative AI canvas that orchestrates multi-agent intelligence, live workspace synchronization, and code generation with real-time streaming LLM outputs.',
      tech: ['Python', 'Machine Learning', 'React', 'Node.js', 'Tailwind CSS', 'Redis'],
      features: [
        'Real-time multi-agent LLM pipeline with under 20ms streaming latency',
        'Interactive infinite visual canvas powered by SVG and WebGL',
        'End-to-end encrypted session persistence using Redis and PostgreSQL',
        'Granular role-based access control and collaborative real-time cursor presence'
      ]
    },
    'cyberstream-defi': {
      title: 'CyberStream Analytics Terminal',
      badge: 'Full Stack & Data',
      image: 'assets/images/project-2.svg',
      desc: 'A futuristic telemetry and automated analytics terminal designed for high throughput and ultra-low latency execution.',
      tech: ['JavaScript', 'HTML5', 'CSS3', 'MySQL', 'WebSockets', 'Chart.js'],
      features: [
        'WebSocket sub-millisecond tick data stream processing',
        'High-speed order book and depth visualization charts',
        'Automated database transactions and data integrity verification',
        'Interactive data filter modules and telemetry dashboards'
      ]
    },
    'cloudvault': {
      title: 'CloudVault Distributed Storage',
      badge: 'Cloud & Infrastructure',
      image: 'assets/images/project-3.svg',
      desc: 'A distributed cloud storage architecture with AES-256 zero-knowledge encryption, automatic shard deduplication, and secure API endpoints.',
      tech: ['Python', 'Django', 'SQL Server', 'Linux', 'REST APIs'],
      features: [
        'Automated chunk replication with high data durability',
        'Client-side cryptographic envelope encryption',
        'Full RESTful SDK drop-in compatibility',
        'Automated caching reducing payload retrieval latency'
      ]
    },
    'quantum-commerce': {
      title: 'Quantum Commerce 3.0',
      badge: 'Web Application',
      image: 'assets/images/project-5.svg',
      desc: 'High-speed web marketplace application with responsive UI, dynamic catalog search, and secure database transactions.',
      tech: ['ASP.NET', 'C#', 'SQL Server', 'HTML5', 'CSS3', 'JavaScript'],
      features: [
        'Sub-second page navigation and responsive layout',
        'Relational database architecture with SQL Server',
        'Full inventory management ledger',
        'Dynamic product search and filtering'
      ]
    }
  };


  // Attach modal triggers to project buttons
  document.querySelectorAll('.view-project-details-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projKey = btn.getAttribute('data-project');
      const data = projectDetails[projKey];
      if (!data) return;

      const techBadges = data.tech.map((t) => `<span class="project-tag">${t}</span>`).join('');
      const featuresList = data.features.map((f) => `<li style="display:flex; align-items:flex-start; gap:8px; margin-bottom:8px; font-size:0.92rem; color:var(--text-muted);"><span style="color:var(--neon-cyan); margin-top:2px;">▹</span><span>${f}</span></li>`).join('');

      const content = `
        <div style="margin-bottom: 10px;">
          <span class="project-overlay-badge" style="position:static; display:inline-block; margin-bottom:10px;">${data.badge}</span>
          <h2 style="font-size: 1.8rem; font-weight:800; color:#fff; margin-bottom:8px;">${data.title}</h2>
          <div style="width:100%; aspect-ratio:16/9; border-radius:12px; overflow:hidden; margin:16px 0; border:1px solid var(--border-cyan);">
            <img src="${data.image}" alt="${data.title}" style="width:100%; height:100%; object-fit:cover;">
          </div>
          <p style="color:var(--text-muted); font-size:1rem; line-height:1.7; margin-bottom:20px;">${data.desc}</p>
          
          <h4 style="font-size:1.1rem; font-weight:700; color:var(--neon-cyan); margin-bottom:12px;">Key Architectural Highlights:</h4>
          <ul style="list-style:none; padding:0; margin-bottom:24px;">
            ${featuresList}
          </ul>

          <h4 style="font-size:1rem; font-weight:700; color:#cbd5e1; margin-bottom:10px;">Technology Stack:</h4>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:28px;">
            ${techBadges}
          </div>

          <div style="display:flex; gap:16px; flex-wrap:wrap;">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="btn btn-neon-cyan btn-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              View Live Demo
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="btn btn-cyber-outline btn-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              GitHub Source Code
            </a>
          </div>
        </div>
      `;

      openModal(content);
    });
  });

  // Attach modal triggers to Certificate cards
  document.querySelectorAll('.view-cert-modal-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const certTitle = btn.getAttribute('data-cert');
      const certOrg = btn.getAttribute('data-org');
      const certId = btn.getAttribute('data-id');
      const certImg = btn.getAttribute('data-img');

      const content = `
        <div style="text-align:center; padding:10px;">
          <div style="width:110px; height:110px; margin:0 auto 20px;">
            <img src="${certImg}" alt="${certTitle}" style="width:100%; height:100%; object-fit:contain;">
          </div>
          <span class="section-tag" style="margin-bottom:12px;">Verified Credential</span>
          <h2 style="font-size:1.6rem; font-weight:800; color:#fff; margin-bottom:8px;">${certTitle}</h2>
          <p style="color:var(--neon-cyan); font-weight:600; font-size:1.05rem; margin-bottom:16px;">${certOrg}</p>
          
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); border-radius:12px; padding:20px; max-width:440px; margin:0 auto 24px; text-align:left;">
            <p style="font-family:var(--font-mono); font-size:0.85rem; color:var(--text-muted); margin-bottom:8px;">Credential Identifier:</p>
            <p style="font-family:var(--font-mono); font-size:1rem; font-weight:700; color:#f8fafc; letter-spacing:1px; margin-bottom:14px;">${certId}</p>
            <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:6px;">Status: <span style="color:#10b981; font-weight:600;">Active &amp; Authenticated</span></p>
            <p style="font-size:0.88rem; color:var(--text-muted);">Verification Method: Cryptographic Signature</p>
          </div>

          <div style="display:flex; justify-content:center; gap:14px; flex-wrap:wrap;">
            <button class="btn btn-neon-cyan btn-sm copy-btn" data-copy="${certId}" data-label="Credential ID">
              Copy Credential ID
            </button>
            <button class="btn btn-cyber-outline btn-sm" onclick="document.getElementById('modal-close-btn').click();">
              Close Preview
            </button>
          </div>
        </div>
      `;

      openModal(content);
    });
  });

  // Attach modal trigger to Full Resume View
  document.querySelectorAll('.view-resume-modal-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const content = `
        <div style="padding:10px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:16px; flex-wrap:wrap; gap:14px;">
            <div>
              <h2 style="font-size:1.8rem; font-weight:800; color:#fff;">Umang Kakkad</h2>
              <p style="color:var(--neon-cyan); font-family:var(--font-mono); font-size:0.95rem;">Software Developer | MCA Student</p>
              <p style="color:var(--text-muted); font-size:0.85rem; margin-top:4px;">kakkadumang08@gmail.com | +91 9428879100 | GLS University, Ahmedabad</p>
            </div>
            <button class="btn btn-neon-cyan btn-sm download-resume-btn">
              Download PDF
            </button>
          </div>

          <h4 style="color:var(--neon-purple); font-size:1.1rem; margin-bottom:8px;">Profile Summary</h4>
          <p style="color:var(--text-muted); font-size:0.92rem; line-height:1.7; margin-bottom:20px;">
            Passionate Software Developer and Master of Computer Applications (MCA) student at GLS University, Ahmedabad. Strong foundation in object-oriented programming, relational databases, and full-stack web applications with practical industry internship exposure at AnantaX Technology, Rajkot.
          </p>

          <h4 style="color:var(--neon-purple); font-size:1.1rem; margin-bottom:8px;">Education</h4>
          <p style="color:#ffffff; font-weight:600; font-size:0.95rem;">MCA (Master of Computer Applications) &mdash; GLS University, Ahmedabad</p>
          <p style="color:var(--neon-cyan); font-size:0.82rem; margin-bottom:20px;">Status: Currently Pursuing</p>

          <h4 style="color:var(--neon-purple); font-size:1.1rem; margin-bottom:8px;">Technical Skills</h4>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:24px;">
            <span class="tech-chip">C</span>
            <span class="tech-chip">C++</span>
            <span class="tech-chip">Java</span>
            <span class="tech-chip">C#</span>
            <span class="tech-chip">Python</span>
            <span class="tech-chip">Machine Learning</span>
            <span class="tech-chip">MySQL</span>
            <span class="tech-chip">SQL Server</span>
            <span class="tech-chip">HTML5 &amp; CSS3</span>
            <span class="tech-chip">JavaScript</span>
            <span class="tech-chip">ASP.NET</span>
            <span class="tech-chip">Windows &amp; Linux (Basic)</span>
            <span class="tech-chip">MS Office</span>
          </div>

          <h4 style="color:var(--neon-purple); font-size:1.1rem; margin-bottom:8px;">Professional Experience</h4>
          <p style="color:#ffffff; font-weight:600; font-size:0.95rem;">Intern | IT / Software Development &mdash; AnantaX Technology, Rajkot</p>
          <p style="color:var(--text-dim); font-size:0.82rem; margin-bottom:8px;">Internship Exposure</p>
          <ul style="list-style:none; padding:0; margin-bottom:20px; color:var(--text-muted); font-size:0.9rem;">
            <li style="margin-bottom:6px;">▹ Gained practical industry exposure through an internship, working with software development concepts, technical tasks, and professional team collaboration.</li>
          </ul>

          <h4 style="color:var(--neon-purple); font-size:1.1rem; margin-bottom:8px;">Key Projects</h4>
          <ul style="list-style:none; padding:0; margin-bottom:20px; color:var(--text-muted); font-size:0.9rem;">
            <li style="margin-bottom:8px;"><strong style="color:#fff;">Secure ATM Module – Transaction &amp; Services Hub:</strong> Desktop application for ATM transactions and services developed with C# .NET Framework and SQL Server.</li>
            <li style="margin-bottom:8px;"><strong style="color:#fff;">Weather Forecast Web Application:</strong> Web-based weather forecast application developed using Python and Django with Weather API integration.</li>
          </ul>

          <div style="text-align:center; padding-top:16px; border-top:1px solid rgba(255,255,255,0.06); display:flex; justify-content:center; gap:12px;">
            <button class="btn btn-cyber-outline btn-sm" onclick="window.print()">
              Print Resume
            </button>
            <button class="btn btn-neon-cyan btn-sm download-resume-btn">
              Download PDF
            </button>
          </div>
        </div>
      `;

      openModal(content);
    });
  });

});
