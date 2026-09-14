const params = new URLSearchParams(window.location.search);
const product = findProduct(params.get('id'));

if (!product) {
  window.location.href = 'index.html';
} else if (product.ageRestricted && !agePassed()) {
  /* Typing the URL straight in shouldn't skip the gate. */
  window.location.href = 'age-gate.html?next=' +
    encodeURIComponent('product.html?id=' + product.id);
} else {
  document.title = product.name + ' — The Inconvenience Store';

  /* The one product that is, for reasons nobody has explained, in Ukrainian. */
  const copy = product.locale === 'uk'
    ? {
        blurb: 'Лорем іпсум долор сіт амет. Цей опис товару чомусь українською. Ми не знаємо чому.',
        add: 'ДОДАТИ ДО КОШИКА',
        notify: 'ПОВІДОМТЕ МЕНЕ',
        soldOut: 'РОЗПРОДАНО'
      }
    : { blurb: product.description || BLURB, add: 'ADD TO BASKET', notify: 'NOTIFY ME', soldOut: 'SOLD OUT' };

  if (product.locale) document.documentElement.lang = product.locale;

  let action;
  if (product.externalUrl) {
    action = '<a class="btn" href="' + product.externalUrl +
             '" target="_blank" rel="noopener noreferrer">BOOK IT</a>';
  } else if (product.chequeOnly) {
    action = '<button class="btn" id="cheque">' + copy.add + '</button>';
  } else if (!product.inStock) {
    /* Sold out routes into the sign-up flow that is already live. */
    action = '<p class="impact" style="font-size:24px">' + copy.soldOut + '</p>' +
             '<a class="btn grey" href="signup.html">' + copy.notify + '</a>';
  } else {
    action = '<button class="btn" id="add">' + copy.add + '</button>';
  }

  const price = product.externalUrl ? 'prices vary wildly' : formatPrice(product.price);
  const offer = product.offer === '2for3'
    ? '<p class="impact" style="color:var(--green);font-size:20px">2 FOR 3 SPECIAL OFFER!</p>'
    : '';

  const notice = product.notice
    ? '<p class="notice impact">' + product.notice + '</p>'
    : '';

  /* A different terrible slide transition every time you land on a page —
     except on a pixelated product, which always resolves into focus instead. */
  const ENTRANCES = ['fly', 'spin', 'drop', 'swivel', 'zoom', 'wipe'];
  const entrance = product.pixelated
    ? ''
    : ENTRANCES[Math.floor(Math.random() * ENTRANCES.length)];

  document.getElementById('product').innerHTML =
    '<img class="anim ' + entrance + '" src="' + product.img + '" alt="' + product.name + '">' +
    '<div>' +
      '<h2>' + product.name + '</h2>' +
      '<p class="impact" style="font-size:26px">' + price + '</p>' +
      offer +
      notice +
      '<p>' + copy.blurb + '</p>' +
      action +
    '</div>';

  /* Recommendations. Reuses the carousel card so they look like the store. */
  if (product.recommend) {
    const picks = product.recommend.ids.map(findProduct).filter(Boolean);
    if (picks.length) {
      const recommend = document.createElement('div');
      recommend.className = 'recommend';
      recommend.innerHTML =
        '<h3 class="impact">' + product.recommend.label + '</h3>' +
        '<div class="recommend-cards">' +
          picks.map((pick, i) => carouselCard(pick, i)).join('') +
        '</div>';
      document.querySelector('.wrap').appendChild(recommend);
    }
  }

  if (product.pixelated) {
    pixelateIn(document.querySelector('.product img'), 3.5);
  }

  const addButton = document.getElementById('add');
  if (addButton) {
    addButton.addEventListener('click', () => {
      addToCart(product.id, 1);
      window.location.href = 'cart.html';
    });
  }
}

/* Cheque-only items explain themselves in a modal and are never added to the
   basket. Closing it leaves the basket exactly as it was. */
const chequeButton = document.getElementById('cheque');
if (chequeButton) {
  chequeButton.addEventListener('click', () => {
    const backdrop = document.createElement('div');
    backdrop.className = 'nag-backdrop';
    backdrop.innerHTML =
      '<div class="nag" role="alertdialog" aria-labelledby="cheque-title" style="text-align:left">' +
        '<h2 id="cheque-title" class="impact" style="text-align:center">CHEQUE ONLY</h2>' +
        '<p>This item cannot be bought online. Please post a cheque for <strong>' +
          formatPrice(product.price) + '</strong>, made payable to ' +
          '<strong>' + CHEQUE_ADDRESS[0] + '</strong>, to:</p>' +
        '<p style="font-family:\'Courier New\',monospace;line-height:1.7">' +
          CHEQUE_ADDRESS.join('<br>') + '</p>' +
        '<p style="text-align:center"><button class="btn" id="chequeOk">OK</button></p>' +
      '</div>';
    document.body.appendChild(backdrop);

    const ok = backdrop.querySelector('#chequeOk');
    ok.focus();

    function dismiss() {
      document.removeEventListener('keydown', onKey);
      backdrop.remove();
    }
    function onKey(e) {
      if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); dismiss(); }
    }
    ok.addEventListener('click', dismiss);
    document.addEventListener('keydown', onKey);
  });
}
