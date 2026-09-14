/* The intro overlay, on the products page.

   Types each line then deletes it, four times over, ending on "you have been
   warned". Shown on every visit — not once per browser — and cleared with a
   tap anywhere.

   The tap works from the moment the page loads, so nobody has to sit through
   the typing. A key press clears it too: the overlay covers the whole screen
   and has nothing focusable in it, so without that a keyboard-only visitor
   would have no way past. */

const INTRO_LINES = [
  'welcome to the inconvenience store ',
  'the home of everything you never wanted ',
  'click to continue. no more help.',
  'you have been warned '
];

const overlay = document.getElementById('intro');
const line = overlay.querySelector('.introtext');

let dismissed = false;

function dismissIntro() {
  if (dismissed) return;
  dismissed = true;
  overlay.style.display = 'none';
  document.removeEventListener('keydown', dismissIntro);
  if (typeof logEvent === 'function') logEvent('IntroDismissed', { pageName: 'products' });
}

overlay.style.display = 'flex';
overlay.addEventListener('click', dismissIntro);
document.addEventListener('keydown', dismissIntro);
if (typeof logEvent === 'function') logEvent('IntroShown', { pageName: 'products' });

const TYPING = 50, DELETING = 25, PAUSE = 500;

let index = 0, position = 0, deleting = false;

function tick() {
  if (dismissed || index >= INTRO_LINES.length) return;
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
      /* The last line stays up — it's the one you tap through. */
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
