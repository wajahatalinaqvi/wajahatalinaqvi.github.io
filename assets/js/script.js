'use strict';

// ===== ELEMENT TOGGLE =====
const elementToggleFunc = function(elem) { elem.classList.toggle("active"); };


// ===== SIDEBAR =====
const sidebar    = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

if (sidebarBtn) {
  sidebarBtn.addEventListener("click", function() { elementToggleFunc(sidebar); });
}


// ===== TESTIMONIALS MODAL =====
const testimonialsItem  = document.querySelectorAll("[data-testimonials-item]");
const modalContainer    = document.querySelector("[data-modal-container]");
const modalCloseBtn     = document.querySelector("[data-modal-close-btn]");
const overlay           = document.querySelector("[data-overlay]");
const modalImg          = document.querySelector("[data-modal-img]");
const modalTitle        = document.querySelector("[data-modal-title]");
const modalText         = document.querySelector("[data-modal-text]");

const testimonialsModalFunc = function() {
  if (modalContainer) modalContainer.classList.toggle("active");
  if (overlay) overlay.classList.toggle("active");
};

for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function() {
    const avatar = this.querySelector("[data-testimonials-avatar]");
    const title  = this.querySelector("[data-testimonials-title]");
    const text   = this.querySelector("[data-testimonials-text]");
    if (modalImg)   { modalImg.src = avatar.src; modalImg.alt = avatar.alt; }
    if (modalTitle) { modalTitle.innerHTML = title.innerHTML; }
    if (modalText)  { modalText.innerHTML  = text.innerHTML; }
    testimonialsModalFunc();
  });
}

if (modalCloseBtn) modalCloseBtn.addEventListener("click", testimonialsModalFunc);
if (overlay)       overlay.addEventListener("click", testimonialsModalFunc);


// ===== PROJECT IMAGE LOADING =====
document.addEventListener('DOMContentLoaded', function() {
  const projectImages = document.querySelectorAll('.project-img');
  projectImages.forEach(imgContainer => {
    const img = imgContainer.querySelector('img');
    if (!img) return;
    imgContainer.classList.add('loading');
    if (img.complete) {
      imgContainer.classList.remove('loading');
    } else {
      img.addEventListener('load',  () => imgContainer.classList.remove('loading'));
      img.addEventListener('error', () => imgContainer.classList.remove('loading'));
    }
  });
});


// ===== PORTFOLIO FILTER — CUSTOM SELECT =====
const select      = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn   = document.querySelectorAll("[data-filter-btn]");

if (select) {
  select.addEventListener("click", function() { elementToggleFunc(this); });
}

for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function() {
    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    if (select) elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function(selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
};

// Filter buttons (large screen)
let lastClickedBtn = filterBtn[0];
for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function() {
    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    filterFunc(selectedValue);
    if (lastClickedBtn) lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}


// ===== PAGE NAVIGATION =====
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages           = document.querySelectorAll("[data-page]");
const headerTitle     = document.querySelector(".header-title");

const pageTitlesMap = {
  'about':     'About Me',
  'resume':    'Resume',
  'portfolio': 'Portfolio',
  'contact':   'Contact'
};

let isTransitioning = false;

for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function() {
    if (isTransitioning) return;
    
    const clickedLabel = this.textContent.trim().toLowerCase();
    
    // Find active page and active link
    let activePage = null;
    let activeLink = null;
    for (let j = 0; j < pages.length; j++) {
      if (pages[j].classList.contains("active")) {
        activePage = pages[j];
      }
      if (navigationLinks[j].classList.contains("active")) {
        activeLink = navigationLinks[j];
      }
    }
    
    // Find target page
    let targetPage = null;
    let targetLink = navigationLinks[i];
    for (let j = 0; j < pages.length; j++) {
      if (pages[j].dataset.page === clickedLabel) {
        targetPage = pages[j];
      }
    }
    
    if (!targetPage || targetPage === activePage) return;
    
    isTransitioning = true;
    
    // Switch active states on links immediately so sliding indicator responds
    if (activeLink) activeLink.classList.remove("active");
    targetLink.classList.add("active");
    
    if (activePage) {
      // Add exiting class to fade out current page
      activePage.classList.add("exiting");
      
      // Wait for exit transition (250ms) before changing view
      setTimeout(() => {
        activePage.classList.remove("active", "exiting");
        
        // Render target page in entering state
        targetPage.classList.add("active", "entering");
        if (headerTitle) {
          headerTitle.textContent = pageTitlesMap[clickedLabel] || targetLink.textContent.trim();
        }
        
        // Reset scroll position to top
        window.scrollTo({ top: 0, behavior: 'instant' });
        
        // Force layout repaint
        void targetPage.offsetHeight;
        
        // Transition into place
        setTimeout(() => {
          targetPage.classList.remove("entering");
          isTransitioning = false;
          // Re-trigger reveal animations
          triggerScrollReveal();
        }, 50);
      }, 250);
    } else {
      targetPage.classList.add("active");
      isTransitioning = false;
      triggerScrollReveal();
    }
  });
}


// ===== SCROLL REVEAL RE-TRIGGER ON PAGE CHANGE =====
function triggerScrollReveal() {
  // Give the DOM a tick to show the new article, then observe
  setTimeout(() => {
    const cards = document.querySelectorAll(
      '.service-item:not(.three-animate-in), .project-item:not(.three-animate-in), .timeline-item:not(.three-animate-in)'
    );
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('three-animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
    cards.forEach((card, idx) => {
      card.style.transitionDelay = `${idx * 0.05}s`;
      observer.observe(card);
    });
  }, 100);
}

// Initial trigger on load
document.addEventListener('DOMContentLoaded', () => {
  // Small delay so CSS initial opacity:0 has been applied
  setTimeout(triggerScrollReveal, 200);
});


// ===== 3D TILT ON PROJECT CARDS =====
document.addEventListener('DOMContentLoaded', () => {
  const projectItems = document.querySelectorAll('.project-item');

  projectItems.forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width  / 2;
      const centerY = rect.height / 2;
      const rotateX =  ((y - centerY) / centerY) * -6;
      const rotateY =  ((x - centerX) / centerX) *  6;
      this.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
});