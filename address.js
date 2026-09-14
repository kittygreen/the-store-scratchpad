requireRealBasket();
document.getElementById('head').innerHTML = stepHeader('address.html');

/* Every field is mandatory. Roughly half of them are none of our business. */
const FIELDS = [
  { key: 'name',      label: 'Full name' },
  { key: 'line1',     label: 'Address line 1' },
  { key: 'line2',     label: 'Address line 2' },
  { key: 'town',      label: 'Town' },
  { key: 'postcode',  label: 'Postcode' },
  { key: 'doorColour', label: 'What colour is your front door?' },
  { key: 'steps',     label: 'How many steps up to your front door?' },
  { key: 'dog',       label: 'Is there a dog? If so, what is its name?' },
  { key: 'vibe',      label: 'Describe the general vibe of your street' },
  { key: 'landmark',  label: 'Nearest landmark, in your own words' }
];

const RANDOM_ADDRESSES = [
  { name: 'Bartholomew Quince', line1: 'Flat 4, The Old Sausage Works', line2: '12 Gasket Row',
    town: 'Nether Wallop', postcode: 'PO7 4TT', doorColour: 'Beige', steps: '0',
    dog: 'No', vibe: 'Fine', landmark: 'A roundabout' },
  { name: 'Sandra Pomfrey', line1: '3 Lower Bottom Lane', line2: 'Behind the chippy',
    town: 'Gravesend', postcode: 'DA11 9QQ', doorColour: 'A sort of green',
    steps: '2', dog: 'Yes, Kevin', vibe: 'Tense', landmark: 'The big Tesco' },
  { name: 'Dev Achterberg', line1: 'The Annexe', line2: '81 Trumpington Mews',
    town: 'Skelmersdale', postcode: 'WN8 6AB', doorColour: 'Was red, now pink',
    steps: '11', dog: 'Two dogs. Both called Steve.', vibe: 'Windy',
    landmark: 'A postbox that has been hit by a car' }
];

const saved = readCheckout().address || {};

document.getElementById('form').innerHTML = FIELDS.map(field =>
  '<p><label for="' + field.key + '">' + field.label + ' *</label><br>' +
  '<input id="' + field.key + '" name="' + field.key + '" required ' +
  'value="' + (saved[field.key] || '').replace(/"/g, '&quot;') + '" ' +
  'style="width:100%;max-width:420px;padding:8px;border:3px solid #111;font-family:inherit"></p>'
).join('');

const next = document.getElementById('next');
const remaining = document.getElementById('remaining');

function currentValues() {
  const values = {};
  FIELDS.forEach(field => {
    values[field.key] = document.getElementById(field.key).value.trim();
  });
  return values;
}

/* Persisted on every keystroke. The nag timer is only an overlay and cannot
   clear these, but saving as we go means even a reload keeps the answers. */
function sync() {
  const values = currentValues();
  saveCheckout({ address: values });

  const missing = FIELDS.filter(field => !values[field.key]).length;
  next.disabled = missing > 0;
  remaining.textContent = missing
    ? missing + ' mandatory question' + (missing === 1 ? '' : 's') + ' remaining'
    : '';
}

/* Remembered so the timer knows which field to nibble. */
let lastEdited = null;

document.getElementById('form').addEventListener('input', event => {
  lastEdited = event.target.id;
  sync();
});

/* Autofill enters an address. It is not yours. */
document.getElementById('autofill').addEventListener('click', () => {
  const pick = RANDOM_ADDRESSES[Math.floor(Math.random() * RANDOM_ADDRESSES.length)];
  FIELDS.forEach(field => {
    document.getElementById(field.key).value = pick[field.key] || '';
  });
  sync();
});

next.addEventListener('click', () => {
  window.location.href = nextStep('address.html');
});

sync();

/* Ten seconds. Two steps forward, one step back: each time the timer fires it
   takes the last character off whichever field was most recently typed in.

   Deliberately one character from one field, not one from every field. Ten
   fields losing a character each per ten seconds erodes progress at roughly
   typing speed, which stops reading as a joke and starts reading as a form
   that cannot be completed. Nibbling the field in front of you is legible,
   obviously intentional, and always winnable. Change `nibble` below if you
   want it crueller. */
function nibble() {
  const field = lastEdited && document.getElementById(lastEdited);
  if (!field || !field.value) return;
  field.value = field.value.slice(0, -1);
  sync();
}

startNagTimer({
  seconds: 10,
  message: 'need more time?',
  page: 'address',
  onShow: nibble
});
