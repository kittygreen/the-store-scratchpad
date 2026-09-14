requireRealBasket();
document.getElementById('head').innerHTML = stepHeader('confirm.html');

/* The last honest page before the double-check. Everything being charged for
   is itemised, and the delivery line says what actually happens. */
const state = readCheckout();
const address = state.address || {};

const rows = cartLines().map(line =>
  '<tr><td>' + line.name + '</td><td>' + line.qty + '</td>' +
  '<td>' + formatPrice(line.total) + '</td></tr>'
).join('');

document.getElementById('body').innerHTML =
  '<h2>Check your order</h2>' +
  '<table class="basket"><tbody>' +
    '<tr><th>Item</th><th>Qty</th><th>Price</th></tr>' + rows +
    '<tr class="total"><td colspan="2">Total</td><td>' + formatPrice(cartTotal()) + '</td></tr>' +
  '</tbody></table>' +
  '<h3>Delivering to</h3>' +
  '<p style="font-family:\'Courier New\',monospace;line-height:1.7">' +
    [address.name, address.line1, address.line2, address.town, address.postcode]
      .filter(Boolean).join('<br>') +
  '</p>' +
  '<h3>Packaging</h3><p>' + (state.packaging || '—') + '</p>' +
  '<h3>Delivery</h3>' +
  '<p>You chose: ' + (state.slot || '—') + '<br>' +
  '<strong>It\'ll get there when it gets there.</strong></p>' +
  '<p><button class="btn" id="next">YES, THAT IS MY ORDER</button></p>' +
  '<p><a href="cart.html">&lsaquo; change something</a></p>';

document.getElementById('next').addEventListener('click', () => {
  window.location.href = nextStep('confirm.html');
});
