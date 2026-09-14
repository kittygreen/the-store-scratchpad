requireRealBasket();
document.getElementById('head').innerHTML = stepHeader('delivery.html');

/* Every slot is dreadful. None of them mean anything: it goes by normal post. */
const SLOTS = [
  'Tuesday, 04:00 – 04:12',
  'Wednesday, 23:50 – 23:55',
  'Sunday, 05:15 – 05:20',
  'Thursday, 13:00 – 13:02',
  'A weekday, at some point, probably'
];

const saved = readCheckout().slot;

document.getElementById('options').innerHTML = SLOTS.map(slot =>
  '<p><label><input type="radio" name="slot" value="' + slot + '"' +
  (saved === slot ? ' checked' : '') + '> ' + slot + '</label></p>'
).join('');

const next = document.getElementById('next');
if (saved) next.disabled = false;

document.querySelectorAll('input[name=slot]').forEach(input => {
  input.addEventListener('change', () => {
    saveCheckout({ slot: input.value });
    next.disabled = false;
  });
});

next.addEventListener('click', () => {
  window.location.href = nextStep('delivery.html');
});
