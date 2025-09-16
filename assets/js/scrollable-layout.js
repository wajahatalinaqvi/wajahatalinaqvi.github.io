/**
 * Enhance scrollable layout functionality
 * Manages scrolling behavior for the articles container
 */
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const headerContainer = document.querySelector('.header-container');
  const headerTitle = document.querySelector('.header-title');
  const articlesContainer = document.querySelector('.articles-container');
  const navLinks = document.querySelectorAll('.navbar-link');
  
  if (!headerContainer || !articlesContainer || !navLinks.length || !headerTitle) {
    return;
  }
  
  // Add shadow to header when scrolling
  articlesContainer.addEventListener('scroll', function() {
    if (articlesContainer.scrollTop > 10) {
      headerContainer.classList.add('scrolled');
    } else {
      headerContainer.classList.remove('scrolled');
    }
  });
  
  // Page titles mapping
  const pageTitles = {
    'about': 'About Me',
    'resume': 'Resume',
    'portfolio': 'Portfolio',
    'blog': 'Blog',
    'contact': 'Contact'
  };
  
  // Update header title and smooth scroll to top when changing pages
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      // Get the page name from the active link
      const pageName = this.textContent.toLowerCase();
      
      // Update the header title
      if (pageTitles[pageName]) {
        headerTitle.textContent = pageTitles[pageName];
      }
      
      // Reset scroll position when changing pages
      setTimeout(() => {
        articlesContainer.scrollTop = 0;
        headerContainer.classList.remove('scrolled');
      }, 100);
    });
  });
  
  // Handle window resize events
  window.addEventListener('resize', adjustLayout);
  
  // Initial layout adjustment
  adjustLayout();
  
  // Initialize header title based on active page
  function setInitialHeaderTitle() {
    const activeLink = document.querySelector('.navbar-link.active');
    if (activeLink) {
      const pageName = activeLink.textContent.toLowerCase();
      if (pageTitles[pageName]) {
        headerTitle.textContent = pageTitles[pageName];
      }
    }
  }
  
  // Set initial header title
  setInitialHeaderTitle();
  
  function adjustLayout() {
    // Adjust layout based on screen size
    if (window.innerWidth < 992) {
      // Mobile: disable special scrolling
      articlesContainer.style.overflow = 'visible';
    } else {
      // Desktop: ensure content is scrollable
      articlesContainer.style.overflowY = 'auto';
    }
  }
});
