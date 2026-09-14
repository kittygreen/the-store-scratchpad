/* Injects the navigation bar at the top of every page.

   Done in JS rather than copied into 17 files so there is one place to change
   it. Any existing .bar header is removed first, so pages never end up with
   two stacked headers. */

(function () {
  const LINKS = [
    { label: 'Store',    href: 'index.html' },
    { label: 'Services', href: 'services.html' },
    { label: 'Sign Up',  href: 'signup.html' },
    { label: 'Basket',   href: 'cart.html' }
  ];

  const file = window.location.pathname.split('/').pop() || 'index.html';

  const links = LINKS.map(link => {
    const current = link.href === file ? ' class="here"' : '';
    return '<a href="' + link.href + '"' + current + '>' + link.label + '</a>';
  }).join('');

  const bar = document.createElement('div');
  bar.className = 'site-nav';
  bar.innerHTML =
    '<a class="brand" href="index.html">The Inconvenience Store</a>' +
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
