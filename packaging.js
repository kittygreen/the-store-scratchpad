requireRealBasket();
document.getElementById('head').innerHTML = stepHeader('packaging.html');

/* There is one option. It is still mandatory to choose it. */
const PACKAGING = ['Packaging'];
const saved = readCheckout().packaging;

document.getElementById('options').innerHTML = PACKAGING.map((name, i) =>
  '<p><label><input type="radio" name="packaging" value="' + name + '"' +
  (saved === name ? ' checked' : '') + '> ' + name + '</label></p>'
).join('');

const next = document.getElementById('next');
if (saved) next.disabled = false;

document.querySelectorAll('input[name=packaging]').forEach(input => {
  input.addEventListener('change', () => {
    saveCheckout({ packaging: input.value });
    next.disabled = false;
  });
});

next.addEventListener('click', () => {
  window.location.href = nextStep('packaging.html');
});
