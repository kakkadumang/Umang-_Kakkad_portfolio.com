/**
 * FUTURISTIC DEVELOPER PORTFOLIO - DYNAMIC ANIMATIONS
 * Typewriter, Scroll Reveals, Stats Counter, and Interactive Sound Synth
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. TYPEWRITER EFFECT
  const typewriterElement = document.getElementById('typewriter-text');
  if (typewriterElement) {
    const phrases = [
      'Software Developer',
      'MCA Student @ GLS University',
      'C# .NET & SQL Developer',
      'Python & Django Developer',
      'C, C++ & Java Programmer'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;

    function type() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeDelay = 40;
      } else {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeDelay = 90;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        // Pause at end of phrase
        typeDelay = 1800;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeDelay = 450;
      }

      setTimeout(type, typeDelay);
    }

    type();
  }

  // 2. SCROLL REVEAL OBSERVER
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Optional: keep observing or unobserve once revealed
          // observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealElements.forEach((el) => el.classList.add('active'));
  }

  // 3. STATS NUMBER COUNTER ANIMATION
  const statNumbers = document.querySelectorAll('.stat-number');
  let hasAnimatedStats = false;

  function animateCounters() {
    statNumbers.forEach((stat) => {
      const targetStr = stat.getAttribute('data-target') || stat.textContent;
      const hasPlus = targetStr.includes('+');
      const hasPercent = targetStr.includes('%');
      const targetVal = parseFloat(targetStr.replace(/[^0-9.]/g, ''));
      const isFloat = targetStr.includes('.');

      let start = 0;
      const duration = 1600;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (targetVal - start) * easeOut;

        stat.textContent = (isFloat ? current.toFixed(1) : Math.floor(current)) + (hasPlus ? '+' : '') + (hasPercent ? '%' : '');

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          stat.textContent = targetStr;
        }
      }

      requestAnimationFrame(update);
    });
  }

  const statsSection = document.querySelector('.hero-stats-bar');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimatedStats) {
          hasAnimatedStats = true;
          animateCounters();
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }

  // 4. RADIAL GLOW MOUSE TRACKING ON GLASS CARDS
  document.querySelectorAll('.glass-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 5. SCI-FI SOUND SYNTHESIZER (OPT-IN AUDIO FEEDBACK)
  let audioCtx = null;
  let soundEnabled = false;
  const soundToggleBtn = document.getElementById('sound-toggle-btn');

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
  }

  function playCyberTone(freq = 880, type = 'sine', duration = 0.08) {
    if (!soundEnabled || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback not permitted yet:', e);
    }
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      initAudio();
      soundEnabled = !soundEnabled;
      soundToggleBtn.setAttribute('aria-pressed', soundEnabled);
      soundToggleBtn.innerHTML = soundEnabled
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;

      if (soundEnabled) {
        playCyberTone(650, 'sine', 0.12);
        showToast('🔊 Cyber UI Sound Effects Enabled');
      } else {
        showToast('🔇 Cyber UI Sound Muted');
      }
    });

    // Attach click tone to buttons and links
    document.querySelectorAll('.btn, .nav-link, .filter-btn, .social-icon-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        playCyberTone(520, 'triangle', 0.06);
      });
    });
  }
});
