/* Classic, parser-blocking script: select the palette before body paint.
 * Kept external for the site's script-src 'self' Content Security Policy. */
(() => {
  const key = 'apart-hotel-theme';
  const root = document.documentElement;

  let preference = null;
  const validPreference = value => value === 'light' || value === 'dark' ? value : null;
  try {
    preference = validPreference(localStorage.getItem(key));
  } catch { /* Storage can be disabled; the light default and manual selection still work. */ }

  function apply() {
    root.dataset.theme = preference || 'light';
    const control = document.querySelector('[data-theme-toggle]');
    if (control) control.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
  }
  apply();

  window.addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    try {
      if (event.storageArea !== localStorage) return;
      preference = validPreference(event.newValue);
      apply();
    } catch { /* A blocked storage object must not interrupt the page. */ }
  });

  document.addEventListener('DOMContentLoaded', () => {
    const control = document.querySelector('[data-theme-toggle]');
    if (!control) return;
    apply();
    control.hidden = false;
    control.addEventListener('click', () => {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      apply();
      try { localStorage.setItem(key, preference); }
      catch { /* Keep the manual choice in memory for this document. */ }
    });
  }, { once: true });
})();
