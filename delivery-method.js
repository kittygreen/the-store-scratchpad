requireRealBasket();
document.getElementById('head').innerHTML = stepHeader('delivery-method.html');

/* Three methods. One of them is available. */
const METHODS = [
  { label: 'Carrier pigeon', available: false },
  { label: 'With a cream pie', available: false },
  { label: 'Standard delivery', available: true }
];

const saved = readCheckout().method;

document.getElementById('options').innerHTML = METHODS.map(method => {
  const suffix = method.available ? '' : ' <span class="unavailable">(currently unavailable)</span>';
  const disabled = method.available ? '' : ' disabled';
  const checked = saved === method.label ? ' checked' : '';
  return '<p><label' + (method.available ? '' : ' class="dimmed"') + '>' +
    '<input type="radio" name="method" value="' + method.label + '"' + disabled + checked + '> ' +
    method.label + suffix + '</label></p>';
}).join('');

const next = document.getElementById('next');
if (saved) next.disabled = false;

document.querySelectorAll('input[name=method]').forEach(input => {
  input.addEventListener('change', () => {
    saveCheckout({ method: input.value });
    next.disabled = false;
  });
});

next.addEventListener('click', () => {
  window.location.href = nextStep('delivery-method.html');
});
