/* Basket state. Lives in sessionStorage, same as the tokens the sign-up
   flow already uses. Quantities only — unit prices are Stripe's business. */

const CART_KEY = 'shopCart';

function readCart() {
  try { return JSON.parse(sessionStorage.getItem(CART_KEY)) || {}; }
  catch (e) { return {}; }
}

function writeCart(cart) {
  sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/* One wet rizzla is placed in every basket and cannot be taken out. */
function ensureForcedItems(cart) {
  PRODUCTS.filter(p => p.forced).forEach(p => {
    if (!cart[p.id]) cart[p.id] = 1;
  });
  return cart;
}

function addToCart(id, qty) {
  const cart = ensureForcedItems(readCart());
  cart[id] = (cart[id] || 0) + (qty || 1);
  writeCart(cart);
  return cart;
}

function removeFromCart(id) {
  const product = findProduct(id);
  if (product && product.forced) return readCart();   // it stays
  const cart = readCart();
  delete cart[id];
  writeCart(cart);
  return cart;
}

/* Buy two, get charged for a third.
   Calculated on the chosen quantity only — never on the running total, or
   each bonus stone would earn a bonus stone of its own, indefinitely. */
function bonusFor(qty) {
  return Math.floor(qty / 2);
}

/* Expands the basket into the lines shown to the customer, which are the
   same lines handed to Stripe. Everything charged for is visible here. */
function cartLines() {
  const cart = ensureForcedItems(readCart());
  const lines = [];

  Object.keys(cart).forEach(id => {
    const product = findProduct(id);
    if (!product || !cart[id]) return;

    lines.push({
      id: product.id,
      name: product.name,
      qty: cart[id],
      unit: product.price,
      total: product.price * cart[id],
      locked: !!product.forced
    });

    if (product.offer === '2for3') {
      const bonus = bonusFor(cart[id]);
      if (bonus > 0) {
        lines.push({
          id: product.id + '-offer',
          name: '2 for 3 special offer!',
          qty: bonus,
          unit: product.price,
          total: product.price * bonus,
          locked: true
        });
      }
    }
  });

  return lines;
}

function cartTotal() {
  return cartLines().reduce((sum, line) => sum + line.total, 0);
}

function cartNeedsAgeCheck() {
  const cart = readCart();
  return PRODUCTS.some(p => p.ageRestricted && cart[p.id]);
}

function agePassed() {
  return sessionStorage.getItem('ageVerified') === 'true';
}
