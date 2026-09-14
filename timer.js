/* The nag timer. Used on express checkout and on the address page.

   It is an overlay and nothing more: it never touches form fields, never
   reloads, never clears state. Dismissing it restarts the countdown. Enter
   and Escape both close it, so it stays one keystroke rather than a hunt
   for a button. */

function startNagTimer(options) {
  const seconds = options.seconds || 10;
  const message = options.message || 'need more time?';
  let timeoutId = null;

  function show() {
    if (document.querySelector('.nag-backdrop')) return;

    const backdrop = document.createElement('div');
    backdrop.className = 'nag-backdrop';
    backdrop.innerHTML =
      '<div class="nag" role="alertdialog" aria-labelledby="nag-msg">' +
        '<h2 id="nag-msg" class="impact">' + message + '</h2>' +
        '<button class="btn" id="nagOk">OK</button>' +
      '</div>';
    document.body.appendChild(backdrop);

    const ok = backdrop.querySelector('#nagOk');
    ok.focus();

    function dismiss() {
      document.removeEventListener('keydown', onKey);
      backdrop.remove();
      schedule();
    }
    function onKey(e) {
      if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); dismiss(); }
    }

    ok.addEventListener('click', dismiss);
    document.addEventListener('keydown', onKey);

    if (typeof options.onShow === 'function') options.onShow();

    if (typeof logEvent === 'function') {
      logEvent('NagShown', { page: options.page });
    }
  }

  function schedule() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(show, seconds * 1000);
  }

  schedule();
  return { stop: () => clearTimeout(timeoutId) };
}
