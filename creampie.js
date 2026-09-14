/* The cream pie.

   Every now and again a cream pie flies out of the middle of the screen,
   growing from nothing and spinning hard, until it covers everything. Then
   "cream pie on the house!" and it's gone.

   The image has ragged transparent edges, so at rest it is sized well beyond
   the viewport and cropped to fill — otherwise the corners show through.

   Fires on a random interval averaging about three and a half minutes, so
   comfortably under once per two minutes. Call window.creamPie() to fire one
   on demand. */

(function () {
  const MIN_GAP = 120;   // seconds
  const MAX_GAP = 300;
  const HOLD = 1800;     // milliseconds the pie stays before fading

  const reduced = window.matchMedia &&
                  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fling() {
    if (document.querySelector('.pie-layer')) return;

    const layer = document.createElement('div');
    layer.className = 'pie-layer' + (reduced ? ' calm' : '');
    /* Blocks clicks on purpose: the screen is covered, and letting someone
       click a link they cannot see would be worse than the interruption. */
    layer.innerHTML =
      '<img class="pie" src="img/creampie.png" alt="">' +
      '<p class="pie-text impact">cream pie on the house!</p>';
    document.body.appendChild(layer);

    if (typeof logEvent === 'function') logEvent('CreamPie', { page: location.pathname });

    setTimeout(() => {
      layer.classList.add('going');
      setTimeout(() => layer.remove(), 600);
    }, HOLD);
  }

  function schedule() {
    const gap = (MIN_GAP + Math.random() * (MAX_GAP - MIN_GAP)) * 1000;
    setTimeout(() => { fling(); schedule(); }, gap);
  }

  window.creamPie = fling;
  schedule();
})();
