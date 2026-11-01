
  let lastScrollTop = 0;
  const navbar = document.getElementById('navbarhead');

  window.addEventListener('scroll', function() {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Do nothing on negative scroll (e.g. rubber-banding on iOS)
    if (currentScroll < 0) return;

    if (currentScroll > lastScrollTop && currentScroll > 80) {
      // Scrolling down & past navbar height -> Hide
      navbar.classList.add('navbar-hidden');
    } else {
      // Scrolling up -> Show
      navbar.classList.remove('navbar-hidden');
    }

    lastScrollTop = currentScroll;
  });

// ===== LAZY-LOAD BACKGROUND VIDEO =====
(() => {
  const video = document.getElementById('myVideo');
  if (!video) return;

  // Start loading video after page is interactive
  const loadVideo = () => {
    video.autoplay = true;
    video.load();
  };

  // Load video when page is ready (after critical resources)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadVideo);
  } else {
    loadVideo();
  }

  // Fallback: load on first scroll or after 2s timeout
  let videoLoaded = false;
  const ensureVideoLoad = () => {
    if (!videoLoaded) {
      videoLoaded = true;
      loadVideo();
      window.removeEventListener('scroll', ensureVideoLoad);
      clearTimeout(loadTimeout);
    }
  };
  window.addEventListener('scroll', ensureVideoLoad, { once: true });
  const loadTimeout = setTimeout(ensureVideoLoad, 2000);
})();

// ===== CONTACT FORM VALIDATION =====
(() => {
  const form = document.querySelector('.contact-form-box');
  if (!form) return;

  const nameInput = form.querySelector('input[placeholder*="Gil Gabunada"]');
  const emailInput = form.querySelector('input[placeholder*="alex@company.com"]');
  const messageInput = form.querySelector('textarea');
  const submitBtn = form.querySelector('.send-btn');

  if (!nameInput || !emailInput || !messageInput || !submitBtn) return;

  const showMessage = (type, text) => {
    let messageEl = form.querySelector('.form-message');
    if (!messageEl) {
      messageEl = document.createElement('div');
      messageEl.className = 'form-message';
      messageEl.style.cssText = `
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 12px;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s ease;
      `;
      form.insertBefore(messageEl, form.firstChild);
    }

    messageEl.className = `form-message form-message-${type}`;
    messageEl.textContent = text;
    messageEl.style.opacity = '1';
    messageEl.style.visibility = 'visible';

    if (type === 'success') {
      messageEl.style.backgroundColor = 'rgba(34, 197, 94, 0.15)';
      messageEl.style.borderLeft = '3px solid #22C55E';
      messageEl.style.color = '#86EFAC';
      setTimeout(() => {
        messageEl.style.opacity = '0';
        messageEl.style.visibility = 'hidden';
      }, 3500);
    } else if (type === 'error') {
      messageEl.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
      messageEl.style.borderLeft = '3px solid #EF4444';
      messageEl.style.color = '#FCA5A5';
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    // Validation
    if (!name) {
      showMessage('error', 'Please enter your name');
      nameInput.focus();
      return;
    }

    if (!email) {
      showMessage('error', 'Please enter your email or phone number');
      emailInput.focus();
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$|^\+?[\d\s\-()]{7,}$/;
    if (!emailRegex.test(email)) {
      showMessage('error', 'Please enter a valid email or phone number');
      emailInput.focus();
      return;
    }

    if (!message) {
      showMessage('error', 'Please enter a message');
      messageInput.focus();
      return;
    }

    if (message.length < 10) {
      showMessage('error', 'Message should be at least 10 characters');
      messageInput.focus();
      return;
    }

    // Save to localStorage for demo purposes
    const submission = {
      name,
      email,
      message,
      timestamp: new Date().toISOString()
    };

    try {
      let submissions = JSON.parse(localStorage.getItem('portfolioSubmissions') || '[]');
      submissions.push(submission);
      localStorage.setItem('portfolioSubmissions', JSON.stringify(submissions));
    } catch (err) {
      console.log('localStorage not available');
    }

    // Show success
    showMessage('success', '✓ Message received! I\'ll get back to you soon.');

    // Reset form
    form.reset();
    nameInput.focus();
  });

  // Clear error message on input
  [nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('focus', () => {
      const errorMsg = form.querySelector('.form-message-error');
      if (errorMsg) errorMsg.style.opacity = '0';
    });
  });
})();


document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.magnify').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';

    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'magnify-word';
      span.textContent = word;
      el.appendChild(span);

      // keep the normal space between words so wrapping/justify still work
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });
});


(() => {
  const wrapper = document.querySelector('.photo-wrapper');
  const img = document.getElementById('mephoto');
  if (!wrapper || !img) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  let ready = false;

  function prepare() {
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    ready = true;
  }

  if (img.complete && img.naturalWidth) prepare();
  else img.addEventListener('load', prepare);

  wrapper.addEventListener('mousemove', e => {
    if (!ready) return;

    // use the wrapper's box: it never scales, so the hit area doesn't flicker
    const rect = wrapper.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));

    try {
      const alpha = ctx.getImageData(x, y, 1, 1).data[3];
      wrapper.classList.toggle('is-hovered', alpha > 20);
      wrapper.style.cursor = alpha > 20 ? 'pointer' : 'default';
    } catch (err) {
      // canvas is blocked (see note below): fall back to the normal hover
      wrapper.classList.add('is-hovered');
    }
  });

  wrapper.addEventListener('mouseleave', () => wrapper.classList.remove('is-hovered'));
})();

(() => {
  const DURATION = 800;                       // ms, raise for slower glide
  const sections = [...document.querySelectorAll('.section')];
  const desktop = window.matchMedia('(min-width: 992px) and (hover: hover)');
  let animating = false;

  const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function glideTo(y) {
    const start = window.scrollY;
    const dist = y - start;
    if (Math.abs(dist) < 2) return;
    animating = true;
    const t0 = performance.now();

    (function step(now) {
      const p = Math.min((now - t0) / DURATION, 1);
      window.scrollTo(0, start + dist * ease(p));
      if (p < 1) requestAnimationFrame(step);
      else setTimeout(() => (animating = false), 80); // absorbs trackpad momentum
    })(t0);
  }

  function currentIndex() {
    let idx = 0;
    sections.forEach((s, i) => { if (s.offsetTop <= window.scrollY + 2) idx = i; });
    return idx;
  }

  function go(dir) {
    const i = currentIndex();
    const sec = sections[i];
    const bottom = sec.offsetTop + sec.offsetHeight;

    // Section taller than the screen: scroll normally until its edge is reached
    if (dir > 0 && window.scrollY + window.innerHeight < bottom - 2) return false;
    if (dir < 0 && window.scrollY > sec.offsetTop + 2) return false;

    const next = sections[i + dir];
    if (!next) return true;                   // first/last section: do nothing
    glideTo(next.offsetTop);
    return true;
  }

  window.addEventListener('wheel', e => {
    if (!desktop.matches || Math.abs(e.deltaY) < 4) return;
    if (animating) { e.preventDefault(); return; }
    if (go(Math.sign(e.deltaY))) e.preventDefault();
  }, { passive: false });

  window.addEventListener('keydown', e => {
    if (!desktop.matches || /input|textarea|select/i.test(e.target.tagName)) return;
    const down = ['ArrowDown', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.shiftKey);
    const up = ['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey);
    if (!down && !up) return;
    if (animating) { e.preventDefault(); return; }
    if (go(down ? 1 : -1)) e.preventDefault();
  });

  // Navbar links glide with the same easing
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target || !desktop.matches) return;
      e.preventDefault();
      glideTo(target.offsetTop);
    });
  });

  // Turn off native snapping while the script is in charge (desktop only)
  const sync = () => document.documentElement.classList.toggle('js-snap', desktop.matches);
  desktop.addEventListener('change', sync);
  sync();
})();

// Slow-motion background video
(() => {
  const video = document.getElementById('myVideo');
  if (!video) return;
  const RATE = 0.3;                                  // 0.5 = half speed
  const apply = () => { video.playbackRate = RATE; };
  apply();
  // some browsers reset the speed when the file loads, so set it again
  video.addEventListener('loadedmetadata', apply);
  video.addEventListener('play', apply);
})();
// ===== VUE.JS PROJECT MODAL =====
const { createApp } = Vue;

createApp({
  data() {
    return {
      projects: [],
      selectedProject: null
    };
  },
  methods: {
    async loadProjects() {
      try {
        const response = await fetch('./projects.json');
        this.projects = await response.json();
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    },
    openProject(project) {
      this.selectedProject = project;
      document.body.style.overflow = 'hidden';
    },
    closeProject() {
      this.selectedProject = null;
      document.body.style.overflow = 'auto';
    },
    getCardClasses(index) {
      const classes = ['col-12'];
      
      // First card (CLEARSPEAK) - featured
      if (index === 0) {
        return [...classes, 'col-md-6', 'col-lg-6'];
      }
      
      // Cards 2-7 (mid-sized cards)
      if (index >= 1 && index <= 6) {
        return [...classes, 'col-md-6', 'col-lg-3'];
      }
      
      // Card 8 (wide)
      if (index === 7) {
        return [...classes, 'col-md-6', 'col-lg-6'];
      }
      
      // Cards 9-10 (half width)
      return [...classes, 'col-md-6'];
    }
  },
  mounted() {
    this.loadProjects();
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeProject();
      }
    });
  }
}).mount('#projectApp');
