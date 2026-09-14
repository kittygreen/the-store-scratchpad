/* The age gate. Two checks, neither of which verifies anybody's age.

   Rolling papers aren't age restricted in the UK and neither is a novelty
   sanding implement, so none of this needs to exist. Better still, check two
   asks about 2008 — the year an eighteen year old was born, and therefore the
   one year they cannot possibly remember. The gate excludes exactly the people
   it claims to be checking for. That is the joke; do not fix it.

   Passing sets a session flag, which also reveals the real product name in
   the listings. */

const params = new URLSearchParams(window.location.search);
const next = params.get('next') || 'packaging.html';

/* --- Check 1: select Tinky-Winky ---------------------------------------- */

const TINKY_OPTIONS = [
  { id: 'tinky-winky', label: 'Tinky-Winky', correct: true },
  { id: 'dipsy',       label: 'Dipsy' },
  { id: 'laa-laa',     label: 'Laa-Laa' },
  { id: 'po',          label: 'Po' }
];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

document.getElementById('tinkyGrid').innerHTML =
  shuffle(TINKY_OPTIONS.slice()).map(option =>
    '<button class="tinky" data-correct="' + (option.correct ? 'yes' : 'no') + '">' +
      '<img src="img/' + option.id + '.jpg" alt="' + option.label + '">' +
    '</button>'
  ).join('');

document.querySelectorAll('.tinky').forEach(button => {
  button.addEventListener('click', () => {
    if (button.dataset.correct === 'yes') {
      document.getElementById('step1').style.display = 'none';
      document.getElementById('step2').style.display = 'block';
    } else {
      document.getElementById('tinkyFeedback').textContent =
        'That is not Tinky-Winky. Look at the bag.';
    }
  });
});

/* --- Check 2: what is this? ---------------------------------------------
   A floppy disc. Anyone young enough to need an age check has only ever seen
   it as the save icon, which is the first option on the list. */

const EURO_ANSWER = 'a floppy disc';
const EURO_OPTIONS = ['the save icon', 'a flippy disc', 'a flappy disc', 'a floppy disc'];

/* Fixed order, deliberately — "the save icon" first is the trap, and the
   correct answer last. Not shuffled. */
document.getElementById('euroForm').innerHTML =
  EURO_OPTIONS.map(option =>
    '<p><label><input type="radio" name="euro" value="' + option + '"> ' + option + '</label></p>'
  ).join('');

document.getElementById('euroSubmit').addEventListener('click', () => {
  const picked = document.querySelector('input[name=euro]:checked');
  if (!picked) {
    document.getElementById('euroFeedback').textContent = 'Choose one.';
    return;
  }
  if (picked.value === EURO_ANSWER) {
    sessionStorage.setItem('ageVerified', 'true');
    if (typeof logEvent === 'function') logEvent('AgeVerified', { next: next });
    window.location.href = next;
  } else {
    document.getElementById('euroFeedback').textContent =
      'Incorrect. It is a floppy disc. You have never saved anything to one.';
  }
});

/* The alarm. No control, by design.

   Browsers block autoplay until the page has been interacted with, and how
   strictly varies. So: try immediately, and if the browser refuses, start on
   the first click or key press instead. Either way it arrives on its own and
   there is nothing on screen to turn it off. */
const alarm = document.getElementById('alarm');

function startAlarm() {
  const attempt = alarm.play();
  if (attempt && typeof attempt.catch === 'function') {
    attempt.catch(() => {
      /* Refused. Wait for any interaction, then go. */
      const onFirstInteraction = () => {
        alarm.play().catch(() => {});
        document.removeEventListener('pointerdown', onFirstInteraction);
        document.removeEventListener('keydown', onFirstInteraction);
      };
      document.addEventListener('pointerdown', onFirstInteraction);
      document.addEventListener('keydown', onFirstInteraction);
    });
  }
}

startAlarm();
