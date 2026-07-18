/**
 * Scroll Animations & Timeline Revealer
 * =====================================
 * Handles viewport scroll trigger reveals:
 * - IntersectionObserver triggers timeline line drawing on scroll entry
 * - Sequential stagger reveal for timeline item cards and nodes
 * - Observer reveals for service, project, and skill cards
 * - Respects prefers-reduced-motion preferences
 */
'use strict';

class ScrollRevealManager {
  constructor() {
    this.prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.initScrollReveal();
    this.initTimelineObservers();
  }

  initScrollReveal() {
    // Select cards to reveal (excluding timeline items which are handled separately)
    const cards = document.querySelectorAll(
      '.service-item, .project-item, .skills-item, .contact-form, .about-text'
    );

    if (this.prefersReduced) {
      cards.forEach(card => card.classList.add('three-animate-in'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('three-animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    cards.forEach((card, i) => {
      card.style.transitionDelay = `${(i % 4) * 0.05}s`;
      observer.observe(card);
    });
  }

  initTimelineObservers() {
    const timelines = document.querySelectorAll('.timeline');
    
    if (this.prefersReduced) {
      timelines.forEach(t => {
        t.classList.add('drawn');
        t.querySelectorAll('.timeline-item').forEach(item => {
          item.classList.add('revealed');
        });
      });
      return;
    }

    timelines.forEach(timeline => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Draw the line down
            timeline.classList.add('drawn');
            
            // Stagger reveal timeline cards
            const items = timeline.querySelectorAll('.timeline-item');
            items.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('revealed');
              }, 300 + index * 180); // Stagger cards sequentially after line starts drawing
            });
            
            observer.unobserve(timeline);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

      observer.observe(timeline);
    });

    // Node highlight on hover
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.classList.add('highlight-node');
      });
      item.addEventListener('mouseleave', () => {
        item.classList.remove('highlight-node');
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window._scrollReveal = new ScrollRevealManager();
});
