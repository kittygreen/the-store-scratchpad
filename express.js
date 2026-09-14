/* Express checkout.

   Every product, at speed. The tiles tear around the screen far too fast to
   read or click — express mode, optimised so aggressively it is useless.
   The nag timer still interrupts every five seconds on top.

   Each tile gets its own path, duration and delay so the whole thing looks
   like a swarm rather than a formation. */

const floor = document.getElementById('floor');

/* Alphabetical, except anything pinned stays at the bottom — not that anyone
   will be able to tell. */
const sorted = PRODUCTS.slice().sort((a, b) => {
  if (!!a.pinLast !== !!b.pinLast) return a.pinLast ? 1 : -1;
  return a.name.localeCompare(b.name);
});

floor.innerHTML = sorted.map((product, i) => {
  const card = carouselCard(product, i);
  /* Four paths, staggered speeds between 2.2s and 4.6s. */
  const path = 'zip' + ((i % 4) + 1);
  const duration = (2.2 + ((i * 0.53) % 2.4)).toFixed(2) + 's';
  const delay = (-(i * 0.71) % 3).toFixed(2) + 's';
  const top = (6 + ((i * 11) % 62)) + '%';

  return '<div class="zoomer ' + path + '" style="top:' + top +
         ';animation-duration:' + duration + ';animation-delay:' + delay + '">' +
         card + '</div>';
}).join('');

startNagTimer({ seconds: 3, message: 'need more time?', page: 'express' });
