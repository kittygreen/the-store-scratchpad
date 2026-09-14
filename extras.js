requireRealBasket();
document.getElementById('head').innerHTML = stepHeader('extras.html');

document.getElementById('options').innerHTML =
  '<p><label><input type="checkbox" id="pie"> Deliver with a cream pie</label></p>';

/* Selecting it is possible. Having it is not. */
document.getElementById('pie').addEventListener('change', function () {
  if (!this.checked) return;
  this.checked = false;

  const backdrop = document.createElement('div');
  backdrop.className = 'nag-backdrop';
  backdrop.innerHTML =
    '<div class="nag" role="alertdialog" aria-labelledby="pie-msg">' +
      '<h2 id="pie-msg" class="impact">This isn\'t a service we currently offer</h2>' +
      '<button class="btn" id="pieOk">OK</button>' +
    '</div>';
  document.body.appendChild(backdrop);

  const ok = backdrop.querySelector('#pieOk');
  ok.focus();
  function dismiss() { document.removeEventListener('keydown', onKey); backdrop.remove(); }
  function onKey(e) { if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); dismiss(); } }
  ok.addEventListener('click', dismiss);
  document.addEventListener('keydown', onKey);
});

document.getElementById('next').addEventListener('click', () => {
  window.location.href = nextStep('extras.html');
});
