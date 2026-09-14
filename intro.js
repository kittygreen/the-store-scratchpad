/* The intro overlay, on the products page.

   Types each line then deletes it, four times over, ending on "you have been
   warned". Click anywhere to dismiss and you're on the products page beneath.
   Shown once per browser, same as before. */

const INTRO_LINES = [
  'welcome to the inconvenience store ',
  'the home of everything you never wanted ',
  'click to continue. no more help.',
  'you have been warned '
];

const overlay = document.getElementById('intro');

function dismissIntro() {
  overlay.style.display = 'none';
  localStorage.setItem('hasSeenIntro', 'true');
  if (typeof logEvent === 'function') logEvent('IntroDismissed', { pageName: 'products' });
}

if (localStorage.getItem('hasSeenIntro')) {
  overlay.style.display = 'none';
} else {
  overlay.style.display = 'flex';
  overlay.addEventListener('click', dismissIntro);
  if (typeof logEvent === 'function') logEvent('IntroShown', { pageName: 'products' });

  const line = overlay.querySelector('.introtext');
  const TYPING = 50, DELETING = 25, PAUSE = 500;

  let index = 0, position = 0, deleting = false;

  function tick() {
    if (index >= INTRO_LINES.length) return;
    const full = INTRO_LINES[index];

    if (deleting) {
      position--;
      line.textContent = full.substring(0, position);
      if (position <= 0) {
        deleting = false;
        index++;
        position = 0;
        setTimeout(tick, PAUSE);
        return;
      }
    } else {
      position++;
      line.textContent = full.substring(0, position);
      if (position >= full.length) {
        /* The last line stays up — it's the one you click through. */
        if (index === INTRO_LINES.length - 1) {
          line.classList.add('grow');
          return;
        }
        deleting = true;
        setTimeout(tick, PAUSE);
        return;
      }
    }
    setTimeout(tick, deleting ? DELETING : TYPING);
  }

  tick();
}
