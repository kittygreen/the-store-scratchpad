/* Splats.

   Every so often something flies out of the middle of the screen, growing
   from nothing and spinning hard, until it covers everything. Then a line of
   text, and it's gone.

   Both images have ragged transparent edges, so at rest each is sized well
   beyond the viewport and cropped to fill — otherwise the corners show
   through.

   window.splat('pie') / window.splat('beans') fires one on demand. */

(function () {
  const SPLATS = {
    pie: {
      img: 'img/creampie.png',
      text: 'cream pie on the house!',
      tone: 'on-light',   // green on white-ish cream
      mean: 40            // seconds between, on average
    },
    beans: {
      img: 'img/beans.png',
      text: 'bean facial on the house!',
      tone: 'on-dark',    // white on orange, or it disappears into the sauce
      mean: 120
    }
  };

  const HOLD = 1800;      // milliseconds it stays before fading

  const reduced = window.matchMedia &&
                  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fling(key) {
    const splat = SPLATS[key];
    if (!splat) return;
    /* One at a time. Two at once is just a mess. */
    if (document.querySelector('.pie-layer')) return;

    const layer = document.createElement('div');
    layer.className = 'pie-layer' + (reduced ? ' calm' : '');
    /* Blocks clicks on purpose: the screen is covered, and letting someone
       click a link they cannot see would be worse than the interruption. */
    layer.innerHTML =
      '<img class="pie" src="' + splat.img + '" alt="">' +
      '<p class="pie-text impact ' + splat.tone + '">' + splat.text + '</p>';
    document.body.appendChild(layer);

    if (typeof logEvent === 'function') logEvent('Splat', { kind: key, page: location.pathname });

    setTimeout(() => {
      layer.classList.add('going');
      setTimeout(() => layer.remove(), 600);
    }, HOLD);
  }

  /* Spread around the mean rather than firing like a metronome. */
  function gap(mean) {
    return (mean * (0.4 + Math.random() * 1.2)) * 1000;
  }

  /* The first one is pulled anywhere into the window, so it can land early in
     a session rather than always making you wait a full interval for it. */
  function firstGap(mean) {
    return Math.max(5, Math.random() * mean) * 1000;
  }

  function schedule(key, delay) {
    setTimeout(() => {
      fling(key);
      schedule(key, gap(SPLATS[key].mean));
    }, delay);
  }

  window.splat = fling;

  Object.keys(SPLATS).forEach(key => schedule(key, firstGap(SPLATS[key].mean)));
})();
