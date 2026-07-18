'use strict';
/**
 * UX ENHANCEMENTS — Interactive Premium Design Layer
 * ====================================================
 * 1. Page Scroll Progress Bar (linked to document window scroll)
 * 2. Card Cursor Spotlight (service, project, timeline, contact, sidebar)
 * 3. Email Copy Action with visible "Copied!" bubble confirmation
 * 4. Micro-interactions: capped magnetic pull, sidebar hover portrait shift, custom cursor
 * 5. Respects prefers-reduced-motion and touch device overrides
 */

document.addEventListener('DOMContentLoaded', () => {

  const isMobile       = window.matchMedia('(max-width: 768px)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── 1. PAGE SCROLL PROGRESS BAR ──────────────────────
  const progressLine       = document.getElementById('navProgressBar');
  const articlesContainer  = document.querySelector('.articles-container');

  if (progressLine) {
    function updateProgress(scrollEl) {
      const scrollTop    = scrollEl.scrollTop    !== undefined ? scrollEl.scrollTop    : window.scrollY;
      const scrollHeight = scrollEl.scrollHeight !== undefined ? scrollEl.scrollHeight - scrollEl.clientHeight
                                                                : document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      progressLine.style.width = pct + '%';
    }

    if (articlesContainer) {
      articlesContainer.addEventListener('scroll', () => updateProgress(articlesContainer), { passive: true });
    }
    // Fallback for mobile (window scroll)
    window.addEventListener('scroll', () => updateProgress(window), { passive: true });
  }

  // ─── 2. CARD CURSOR SPOTLIGHT ─────────────────────────
  const targetCardsSelector = '.service-item, .timeline-item, .project-item > a, .contact-form, .sidebar';
  
  function attachSpotlight(selector) {
    if (isMobile || prefersReduced) return;
    
    document.querySelectorAll(selector).forEach(card => {
      // Clean up duplicates if re-attaching
      card.removeEventListener('mousemove', onCardMouseMove);
      card.removeEventListener('mouseleave', onCardMouseLeave);
      
      card.addEventListener('mousemove', onCardMouseMove, { passive: true });
      card.addEventListener('mouseleave', onCardMouseLeave);
    });
  }

  function onCardMouseMove(e) {
    const r = this.getBoundingClientRect();
    this.style.setProperty('--spot-x', (e.clientX - r.left) + 'px');
    this.style.setProperty('--spot-y', (e.clientY - r.top) + 'px');
    this.classList.add('spotlit');
  }

  function onCardMouseLeave() {
    this.classList.remove('spotlit');
  }

  attachSpotlight(targetSelectors());

  // Helper to re-query elements matching criteria
  function targetSelectors() {
    return targetCardsSelector;
  }

  // Re-attach spotlight when navigating pages
  document.querySelectorAll('[data-nav-link]').forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(() => {
        attachSpotlight(targetSelectors());
        attachCardTilt();
      }, 350); // delay to let entering page render
    });
  });

  // ─── 3. EMAIL COPY ACTION WITH TOOLTIP FEEDBACK ────────
  const emailBtn = document.getElementById('emailCopyBtn');
  const emailFeedback = document.getElementById('emailCopyFeedback');
  if (emailBtn && emailFeedback) {
    emailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const emailAddress = 'wajahatalinaqvi929@gmail.com';
      
      navigator.clipboard.writeText(emailAddress).then(() => {
        emailFeedback.classList.add('show');
        setTimeout(() => {
          emailFeedback.classList.remove('show');
        }, 1800);
      }).catch(err => {
        console.error('Could not copy text: ', err);
      });
    });
    
    // Support keyboard trigger
    emailBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        emailBtn.click();
      }
    });
  }

  // ─── 4. CARD TILT (RESTRICTED TO 0.5–1 DEGREE) ─────────
  function attachCardTilt() {
    if (isMobile || prefersReduced) return;

    // About/Expertise cards and Skills cards
    document.querySelectorAll('.service-item, .skills-item').forEach(card => {
      card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
        const y = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
        // Capped maximum tilt of 0.8 degree
        this.style.transform = `perspective(800px) rotateX(${-y * 0.8}deg) rotateY(${x * 0.8}deg) translateY(-2px)`;
      }, { passive: true });

      card.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
    });
  }
  attachCardTilt();

  // ─── 5. PORTRAIT MOTION AND ROTATING HALO INTERACTION ──
  const avatarBox = document.querySelector('.avatar-box');
  if (avatarBox && !isMobile && !prefersReduced) {
    const avatarImg = avatarBox.querySelector('img');
    if (avatarImg) {
      avatarBox.addEventListener('mousemove', (e) => {
        const rect = avatarBox.getBoundingClientRect();
        // Displace the image by maximum 3px from center
        const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2) * 3;
        const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2) * 3;
        avatarImg.style.transform = `translate(${dx}px, ${dy}px)`;
      }, { passive: true });

      avatarBox.addEventListener('mouseleave', () => {
        avatarImg.style.transform = '';
        avatarImg.style.transition = 'transform 0.4s ease';
        setTimeout(() => avatarImg.style.transition = '', 400);
      });
    }
  }

  // ─── 6. CAPPED MAGNETIC BUTTONS (CTA BUTTONS) ─────────
  if (!isMobile && !prefersReduced) {
    document.querySelectorAll('.cv-download-btn, .form-btn').forEach(btn => {
      btn.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        // Capped displacement between -4px and 4px
        const bx = Math.max(-4, Math.min(4, (e.clientX - rect.left - rect.width / 2) * 0.15));
        const by = Math.max(-4, Math.min(4, (e.clientY - rect.top - rect.height / 2) * 0.15));
        this.style.transform = `translate(${bx}px, ${by}px)`;
      }, { passive: true });

      btn.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
        setTimeout(() => this.style.transition = '', 500);
      });
    });
  }

  // ─── 7. CUSTOM CURSOR ──────────────────────────────────
  if (!isMobile && !prefersReduced) {
    const cursor = document.getElementById('custom-cursor');
    const cursorRing = document.getElementById('custom-cursor-ring');
    
    if (cursor && cursorRing) {
      let cx = -100, cy = -100;
      let rx = -100, ry = -100;
      let ringRafId;

      const moveCursor = e => {
        cx = e.clientX; cy = e.clientY;
        cursor.style.left = cx + 'px';
        cursor.style.top  = cy + 'px';
      };
      document.addEventListener('mousemove', moveCursor, { passive: true });

      const animateRing = () => {
        rx += (cx - rx) * 0.12;
        ry += (cy - ry) * 0.12;
        cursorRing.style.left = rx + 'px';
        cursorRing.style.top  = ry + 'px';
        ringRafId = requestAnimationFrame(animateRing);
      };
      animateRing();

      // Clean up custom cursor loop on page unload
      window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(ringRafId);
        document.removeEventListener('mousemove', moveCursor);
      });
    }
  }

});
