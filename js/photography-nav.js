// Match the other pages' overflow navigation, including keyboard dismissal.
(() => {
  const button = document.querySelector('.more-btn');
  const dropdown = document.getElementById('more-dropdown');
  if (!button || !dropdown) return;

  button.setAttribute('aria-label', 'More navigation');
  button.setAttribute('aria-controls', dropdown.id);
  button.setAttribute('aria-expanded', 'false');

  function closeMenu() {
    dropdown.classList.add('hidden');
    button.setAttribute('aria-expanded', 'false');
  }

  window.toggleDropdown = () => {
    const open = dropdown.classList.toggle('hidden') === false;
    button.setAttribute('aria-expanded', String(open));
  };

  document.addEventListener('click', (event) => {
    if (!button.contains(event.target) && !dropdown.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !dropdown.classList.contains('hidden')) {
      closeMenu();
      button.focus();
    }
  });
})();
