/**
 * PIXORA DIGITAL STUDIO — Official JavaScript
 * Modular, lightweight Motion UI & performant interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMotionUI();
  initPortfolio();
  initInquiryForm();
  initContactActions();
});

/* ==========================================================================
   Motion UI Engine (Scroll Reveal & Micro-Interactions)
   ========================================================================== */
function initMotionUI() {
  const animatedElements = document.querySelectorAll('.motion-fade-up, .motion-scale');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    };

    const motionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => motionObserver.observe(el));
  } else {
    // Fallback for older browsers
    animatedElements.forEach(el => el.classList.add('visible'));
  }

  // Interactive subtle 3D card tilt for desktop pointers
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const tiltCards = document.querySelectorAll('.hover-tilt');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const tiltX = (y / (rect.height / 2)) * -4;
        const tiltY = (x / (rect.width / 2)) * 4;
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }
}

/* ==========================================================================
   Navigation & Header Scroll
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Header scroll shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 25) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // ScrollSpy
    let currentSection = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile drawer toggle
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburgerBtn.classList.toggle('active', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburgerBtn.classList.remove('active');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        hamburgerBtn.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   Portfolio Data & Interactive Modal
   ========================================================================== */
const PORTFOLIO_PROJECTS = {
  'sialkot-sweets': {
    title: 'Sialkot Sweets & Bakers',
    category: 'E-Commerce & Food Ordering',
    tag: 'ecommerce',
    image: 'assets/images/sialkot-sweets-hero.jpg',
    summary: 'Official high-performance web portal and digital storefront for Gujranwala’s historic sweet & confectionery brand founded in 1951.',
    description: 'Sialkot Sweets & Bakers required a digital transformation to modernize their reach while honoring over 70 years of culinary heritage. Pixora Digital Studio designed and engineered an intuitive, ultra-responsive storefront covering traditional pure desi ghee mithai, Arabian sweets, bakery specialties, and fast-food menus with interactive product showcases.',
    highlights: [
      'Engineered a lightweight, mobile-first product directory with 100+ items across 12 distinct culinary categories.',
      'High-resolution visual product showcases with detailed dietary info and pricing tiers.',
      'Comprehensive Schema.org Restaurant structured data and technical SEO for local search prominence.',
      'Core Web Vitals optimized with zero layout shift and sub-second load times on mobile 4G networks.'
    ],
    techStack: ['Semantic HTML5', 'Modern CSS3', 'Vanilla JS', 'Schema.org SEO', 'Responsive UI', 'Core Web Vitals']
  },
  'bbq-today': {
    title: 'Bar B Q Today Online Portal',
    category: 'Restaurant Ordering Portal',
    tag: 'ecommerce',
    image: 'assets/images/bbqtoday-preview.jpg',
    summary: 'Dynamic brand experience and digital menu showcase designed for high customer conversion and fast takeout orders.',
    description: 'A vibrant, appetizing web portal engineered for Bar B Q Today. The platform presents flame-grilled specialties, combo platters, and specialty pizzas with high-impact visual hierarchy, interactive dietary tabs, and rapid customer order actions.',
    highlights: [
      'Interactive visual menu with instant category filtering without page reloads.',
      'Mobile-optimized touch carousels and conversion-focused call-to-action buttons.',
      'Optimized lightweight asset delivery ensuring crisp imagery on mobile devices.'
    ],
    techStack: ['Responsive Design', 'Modern CSS', 'JavaScript UI', 'Mobile-First', 'Fast Ordering UI']
  }
};

function initPortfolio() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const modalBackdrop = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  // Filter functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 180);
        }
      });
    });
  });

  // Open modal on project button click
  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      const data = PORTFOLIO_PROJECTS[projectId];
      if (data) {
        populateAndOpenModal(data);
      }
    });
  });

  // Close modal
  if (modalCloseBtn && modalBackdrop) {
    modalCloseBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
        closeModal();
      }
    });
  }

  function closeModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  function populateAndOpenModal(data) {
    document.getElementById('modalCategory').textContent = data.category;
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalDescription').textContent = data.description;
    document.getElementById('modalHeaderImg').src = data.image;
    document.getElementById('modalHeaderImg').alt = data.title;

    // Highlights
    const highlightsList = document.getElementById('modalHighlightsList');
    highlightsList.innerHTML = '';
    data.highlights.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${item}</span>`;
      highlightsList.appendChild(li);
    });

    // Tech stack badges
    const techStackRow = document.getElementById('modalTechStack');
    techStackRow.innerHTML = '';
    data.techStack.forEach(tech => {
      const badge = document.createElement('span');
      badge.className = 'project-tag-pill';
      badge.textContent = tech;
      techStackRow.appendChild(badge);
    });

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/* ==========================================================================
   Project Inquiry & WhatsApp Message Formulation
   ========================================================================== */
function initInquiryForm() {
  const form = document.getElementById('projectInquiryForm');
  const whatsappSendBtn = document.getElementById('inquiryWhatsappBtn');

  // WhatsApp phone configuration
  const STUDIO_WHATSAPP_NUMBER = '923061764247';

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('inqName').value.trim();
      const contact = document.getElementById('inqContact').value.trim();
      const service = document.getElementById('inqService').value;
      const budget = document.getElementById('inqBudget').value;
      const message = document.getElementById('inqMessage').value.trim();

      if (!name || !contact || !message) {
        showToast('Please complete all required fields.');
        return;
      }

      showToast('Thank you! Your project inquiry has been received.');
      form.reset();
    });
  }

  if (whatsappSendBtn) {
    whatsappSendBtn.addEventListener('click', () => {
      const name = document.getElementById('inqName').value.trim() || 'Client';
      const service = document.getElementById('inqService').value || 'Custom Web Development';
      const message = document.getElementById('inqMessage').value.trim() || 'I would like to discuss a new project.';

      const formattedMessage = `Hello Azan! 👋%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Interested Service:* ${encodeURIComponent(service)}%0A*Project Brief:* ${encodeURIComponent(message)}%0A%0AI would like to discuss building this digital experience with Pixora Digital Studio.`;

      const whatsappUrl = `https://wa.me/${STUDIO_WHATSAPP_NUMBER}?text=${formattedMessage}`;
      window.open(whatsappUrl, '_blank');
    });
  }
}

/* ==========================================================================
   Direct Contact Triggers & Copy Toast
   ========================================================================== */
function initContactActions() {
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'azanqasim39@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email address copied to clipboard!');
      }).catch(() => {
        showToast('Contact email: azanqasim39@gmail.com');
      });
    });
  }
}

// Toast notification helper
function showToast(msg) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${msg}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
