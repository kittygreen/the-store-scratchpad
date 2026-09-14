/* Renders the basket. Every line that is charged for appears here with its
   own price — including the compulsory rizzla and the 2-for-3 bonus. The
   journey is the joke; what someone is paying is never obscured. */

function render() {
  const lines = cartLines();
  const rows = lines.map(line =>
    '<tr>' +
      '<td>' + line.name +
        (line.locked ? '<div class="locked">cannot be removed</div>' : '') +
      '</td>' +
      '<td>' + line.qty + '</td>' +
      '<td>' + formatPrice(line.total) + '</td>' +
      '<td>' + (line.locked ? '' :
        '<button data-remove="' + line.id + '">remove</button>') + '</td>' +
    '</tr>'
  ).join('');

  document.getElementById('lines').innerHTML =
    '<tr><th>Item</th><th>Qty</th><th>Price</th><th></th></tr>' +
    rows +
    '<tr class="total"><td colspan="2">Total</td>' +
      '<td colspan="2">' + formatPrice(cartTotal()) + '</td></tr>';

  document.querySelectorAll('[data-remove]').forEach(button => {
    button.addEventListener('click', () => {
      removeFromCart(button.dataset.remove);
      render();
    });
  });
}

render();

document.getElementById('checkout').addEventListener('click', () => {
  if (cartNeedsAgeCheck() && !agePassed()) {
    window.location.href = 'age-gate.html';
  } else {
    window.location.href = 'packaging.html';
  }
});
