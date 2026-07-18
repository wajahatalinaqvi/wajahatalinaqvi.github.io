/**
 * scrollable-layout.js
 * Manages header shadow on internal articles-container scroll,
 * and updates the header title when switching pages.
 */
document.addEventListener('DOMContentLoaded', function () {
  const headerContainer   = document.querySelector('.header-container');
  const headerTitle       = document.querySelector('.header-title');
  const articlesContainer = document.querySelector('.articles-container');
  const navLinks          = document.querySelectorAll('.navbar-link');

  if (!headerContainer || !articlesContainer || !navLinks.length) return;

  // Page title map
  const pageTitles = {
    about:     'About Me',
    resume:    'Resume',
    portfolio: 'Portfolio',
    blog:      'Blog',
    contact:   'Contact'
  };

  // Shadow on internal scroll (articles-container is the scroll pane on desktop)
  articlesContainer.addEventListener('scroll', function () {
    if (articlesContainer.scrollTop > 15) {
      headerContainer.classList.add('scrolled');
    } else {
      headerContainer.classList.remove('scrolled');
    }
  }, { passive: true });

  // Also listen on window for mobile (natural document scroll)
  window.addEventListener('scroll', function () {
    if (window.scrollY > 15) {
      headerContainer.classList.add('scrolled');
    } else {
      headerContainer.classList.remove('scrolled');
    }
  }, { passive: true });

  // Update header title and reset scroll when changing pages
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      const pageName = this.textContent.trim().toLowerCase();
      if (headerTitle && pageTitles[pageName]) {
        headerTitle.textContent = pageTitles[pageName];
      }
      // Scroll the internal pane back to top
      setTimeout(() => {
        articlesContainer.scrollTo({ top: 0, behavior: 'smooth' });
        window.scrollTo({ top: 0, behavior: 'instant' });
        headerContainer.classList.remove('scrolled');
      }, 50);
    });
  });

  // Set header title from active link on load
  const activeLink = document.querySelector('.navbar-link.active');
  if (activeLink && headerTitle) {
    const pageName = activeLink.textContent.trim().toLowerCase();
    if (pageTitles[pageName]) headerTitle.textContent = pageTitles[pageName];
  }
});
