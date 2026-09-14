requireRealBasket();
document.getElementById('head').innerHTML = stepHeader('confirm-2.html');

/* The double-check. It re-lists the basket rather than just asking, so the
   extra step is still telling the customer something true. */
const items = cartLines()
  .map(line => '<li>' + line.qty + ' &times; ' + line.name + '</li>')
  .join('');

document.getElementById('body').innerHTML =
  '<h2>Are you sure?</h2>' +
  '<p>You are about to pay <strong class="impact" style="font-size:22px">' +
    formatPrice(cartTotal()) + '</strong> for:</p>' +
  '<ul style="line-height:1.9">' + items + '</ul>' +
  '<p>Please confirm that these are, genuinely, the items you want.</p>' +
  '<p><button class="btn" id="next">YES. I AM SURE.</button></p>' +
  '<p><a href="confirm.html">&lsaquo; no, take me back</a></p>';

document.getElementById('next').addEventListener('click', () => {
  window.location.href = nextStep('confirm-2.html');
});
