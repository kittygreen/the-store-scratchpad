/* Injects the navigation bar at the top of every page.

   Done in JS rather than copied into 17 files so there is one place to change
   it. Any existing .bar header is removed first, so pages never end up with
   two stacked headers. */

(function () {
  /* A page can declare a locale (see product.js) and the bar follows it. */
  const t = (typeof translations === 'function' && window.PAGE_LOCALE)
    ? translations(window.PAGE_LOCALE)
    : null;

  const LINKS = [
    { label: t ? t.store    : 'Store',    href: 'index.html' },
    { label: t ? t.services : 'Services', href: 'services.html' },
    { label: t ? t.signup   : 'Sign Up',  href: 'signup.html' },
    { label: t ? t.basket   : 'Basket',   href: 'cart.html' }
  ];

  const file = window.location.pathname.split('/').pop() || 'index.html';

  const links = LINKS.map(link => {
    const current = link.href === file ? ' class="here"' : '';
    return '<a href="' + link.href + '"' + current + '>' + link.label + '</a>';
  }).join('');

  const bar = document.createElement('div');
  bar.className = 'site-nav';
  bar.innerHTML =
    '<a class="brand" href="index.html">' +
      (t ? t.brand : 'The Inconvenience Store') + '</a>' +
    '<nav>' + links + '</nav>';

  function mount() {
    const existing = document.querySelector('.bar');
    if (existing) existing.remove();
    document.body.insertBefore(bar, document.body.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
