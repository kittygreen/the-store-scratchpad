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

function setQuantity(id, qty) {
  const cart = ensureForcedItems(readCart());
  const product = findProduct(id);
  /* The compulsory rizzla can go up but never down to nothing. */
  const floor = (product && product.forced) ? 1 : 0;
  const next = Math.max(floor, Math.min(99, qty));
  if (next === 0) delete cart[id];
  else cart[id] = next;
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

   Only applies when the quantity is an exact multiple of two. Two stones are
   charged as three, four as six, six as nine — so the extra charged is half
   the quantity. An odd quantity gets no promotion at all.

   Calculated on the chosen quantity only, never on the running total, or each
   bonus stone would earn a bonus stone of its own, indefinitely. */
function bonusFor(qty) {
  if (qty <= 0 || qty % 2 !== 0) return 0;
  return (qty / 2) * 3 - qty;   // i.e. qty / 2
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
          name: 'promotion applied!',
          qty: bonus,
          unit: product.price,
          total: product.price * bonus,
          locked: true,
          promo: true
        });
      }
    }
  });

  return lines;
}

function cartTotal() {
  return cartLines().reduce((sum, line) => sum + line.total, 0);
}



