/* Shared checkout state and step furniture.

   Every step writes into one sessionStorage object, so going back and forth
   never loses an answer. The nag timers are overlays and never touch this. */

const CHECKOUT_KEY = 'checkoutState';

function readCheckout() {
  try { return JSON.parse(sessionStorage.getItem(CHECKOUT_KEY)) || {}; }
  catch (e) { return {}; }
}

function saveCheckout(patch) {
  const state = Object.assign(readCheckout(), patch);
  sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify(state));
  return state;
}

/* Each step is on its own page, because one page would be convenient. */
const STEPS = [
  { file: 'packaging.html',       label: 'Packaging' },
  { file: 'delivery-method.html', label: 'Delivery method' },
  { file: 'delivery.html',        label: 'Delivery time' },
  { file: 'extras.html',     label: 'Extras' },
  { file: 'address.html',    label: 'Address' },
  { file: 'confirm.html',    label: 'Confirm' },
  { file: 'confirm-2.html',  label: 'Confirm again' }
];

function stepHeader(currentFile) {
  const index = STEPS.findIndex(s => s.file === currentFile);
  /* A thin strip under the nav, not a second header bar. */
  return '<p class="stepline impact">Checkout &mdash; step ' +
         (index + 1) + ' of ' + STEPS.length + '</p>';
}

function nextStep(currentFile) {
  const index = STEPS.findIndex(s => s.file === currentFile);
  return STEPS[index + 1] ? STEPS[index + 1].file : 'pay.html';
}

/* A basket with nothing chosen in it should not be able to reach checkout.
   The forced rizzla means the basket is never technically empty, so this
   checks for something the customer actually picked.

   Bounces to the basket, not the storefront. Sending someone back to
   index.html threw them into the typewriter intro with no explanation, which
   reads as the site having crashed. */
function requireRealBasket() {
  const cart = readCart();
  const chosen = Object.keys(cart).filter(id => {
    const product = findProduct(id);
    return product && !product.forced && cart[id] > 0;
  });
  if (chosen.length === 0) window.location.href = 'cart.html?empty=1';
}
