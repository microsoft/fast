/**
 * Navbar toggle functionality
 * Toggles the mobile sidebar when the navbar toggle button is clicked
 */
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.querySelector('.navbar__toggle');
    const body = document.body;

    if (!toggleButton) {
      return;
    }

    function toggleSidebar() {
      const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';

      // Toggle aria-expanded attribute
      toggleButton.setAttribute('aria-expanded', !isExpanded);

      // Toggle body class to show/hide sidebar
      body.classList.toggle('navbar-sidebar--show');
    }

    function closeSidebar() {
      toggleButton.setAttribute('aria-expanded', 'false');
      body.classList.remove('navbar-sidebar--show');
    }

    // Toggle sidebar when button is clicked
    toggleButton.addEventListener('click', toggleSidebar);

    // Close sidebar when Escape key is pressed
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && body.classList.contains('navbar-sidebar--show')) {
        closeSidebar();
      }
    });
  });
})();
