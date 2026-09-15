/* Renders the basket. Every line that is charged for appears here with its
   own price — including the compulsory rizzla and the promotion. The journey
   is the joke; what someone is paying is never obscured. */

function render() {
  const lines = cartLines();
  const rows = lines.map(line => {
    const qtyCell = line.promo || line.locked
      ? line.qty
      : '<span class="qty">' +
          '<button data-step="-1" data-id="' + line.id + '" aria-label="one fewer">&minus;</button>' +
          '<input type="number" min="0" max="99" value="' + line.qty + '" data-qty="' + line.id + '">' +
          '<button data-step="1" data-id="' + line.id + '" aria-label="one more">+</button>' +
        '</span>';

    return '<tr' + (line.promo ? ' class="promo-row"' : '') + '>' +
      '<td>' + line.name + '</td>' +
      '<td>' + qtyCell + '</td>' +
      '<td>' + formatPrice(line.total) + '</td>' +
      '<td>' + (line.locked ? '' :
        '<button data-remove="' + line.id + '">remove</button>') + '</td>' +
    '</tr>';
  }).join('');

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

  document.querySelectorAll('[data-step]').forEach(button => {
    button.addEventListener('click', () => {
      const current = readCart()[button.dataset.id] || 0;
      setQuantity(button.dataset.id, current + Number(button.dataset.step));
      render();
    });
  });

  document.querySelectorAll('[data-qty]').forEach(input => {
    input.addEventListener('change', () => {
      setQuantity(input.dataset.qty, parseInt(input.value, 10) || 0);
      render();
    });
  });
}

render();

/* Arrived here because checkout had nothing to work with. Say so, rather than
   silently dumping someone back at the start. */
if (new URLSearchParams(location.search).get('empty')) {
  const note = document.createElement('p');
  note.className = 'impact';
  note.style.color = '#C0122B';
  note.textContent = 'Put something in your basket first.';
  const table = document.getElementById('lines').closest('table');
  table.parentNode.insertBefore(note, table.nextSibling);
}

document.getElementById('checkout').addEventListener('click', () => {
  window.location.href = 'packaging.html';
});
