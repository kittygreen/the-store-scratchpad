/* The age gate.

   Rolling papers are not actually age restricted in the UK, so none of this
   needs to exist. Better still, the question asks about the year the
   customer was born — which is precisely the one year an eighteen year old
   cannot possibly remember. The gate excludes exactly the people it claims
   to be checking for. That is the joke; do not fix it.

   The birth year is derived from today's date so the question never
   silently goes stale. */

const BIRTH_YEAR = new Date().getFullYear() - 18;

const CHRISTMAS_NUMBER_ONES = {
  2008: { answer: 'Alexandra Burke', wrong: ['Girls Aloud', 'Take That', 'Leona Lewis'] },
  2009: { answer: 'Rage Against the Machine', wrong: ['Joe McElderry', 'Lady Gaga', 'JLS'] },
  2010: { answer: 'Matt Cardle', wrong: ['Cee Lo Green', 'Rihanna', 'The Wanted'] },
  2011: { answer: 'Military Wives', wrong: ['Little Mix', 'Coldplay', 'Olly Murs'] },
  2012: { answer: 'The Justice Collective', wrong: ['James Arthur', 'Girls Aloud', 'Psy'] }
};

const quiz = CHRISTMAS_NUMBER_ONES[BIRTH_YEAR];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

if (!quiz) {
  /* Past the end of the lookup table. Let people through rather than
     locking the basket behind a question with no answer. */
  sessionStorage.setItem('ageVerified', 'true');
  window.location.href = 'packaging.html';
} else {
  document.getElementById('question').textContent =
    'To prove you are over 18, name the UK Christmas number one in ' +
    BIRTH_YEAR + ', the year you were born.';

  document.getElementById('options').innerHTML =
    shuffle(quiz.wrong.concat([quiz.answer]))
      .map(name => '<p><button class="btn" data-answer="' + name + '">' + name + '</button></p>')
      .join('');

  document.querySelectorAll('[data-answer]').forEach(button => {
    button.addEventListener('click', () => {
      if (button.dataset.answer === quiz.answer) {
        sessionStorage.setItem('ageVerified', 'true');
        window.location.href = 'packaging.html';
      } else {
        document.getElementById('feedback').textContent =
          'Incorrect. You were, admittedly, a baby at the time.';
      }
    });
  });
}

/* Browsers block autoplay audio until the user has interacted with the page,
   so the siren is behind a button. It is also therefore muteable, which
   matters more than the gag does. */
const sirenButton = document.getElementById('siren');
const sirenAudio = document.getElementById('sirenAudio');
sirenButton.addEventListener('click', () => {
  if (sirenAudio.paused) {
    sirenAudio.play();
    sirenButton.textContent = '🔇 SILENCE THE SIREN';
  } else {
    sirenAudio.pause();
    sirenButton.textContent = '🔊 ENABLE SIREN';
  }
});
