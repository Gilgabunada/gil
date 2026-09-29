
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