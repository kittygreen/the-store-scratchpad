/* Builds the storefront carousel.

   The card list is rendered twice into one track. The animation shifts the
   track by exactly half its width, so the second copy is in the first
   copy's place at the moment it loops and the slide looks endless. */

function cardHtml(product) {
  const href = product.externalUrl
    ? product.externalUrl
    : 'product.html?id=' + encodeURIComponent(product.id);

  let flag = '';
  /* Cheque-only is deliberately not flagged here. It is a surprise for the
     moment you try to add it to the basket. */
  if (!product.inStock) flag = '<span class="flag">SOLD OUT</span>';
  else if (product.offer === '2for3') flag = '<span class="flag offer">2 FOR 3!</span>';

  const price = product.externalUrl ? 'prices vary wildly' : formatPrice(product.price);

  /* rel=noopener stops the opened page getting a handle on ours. */
  const target = product.newTab ? ' target="_blank" rel="noopener noreferrer"' : '';

  return '<a class="card" href="' + href + '"' + target + '>' +
           flag +
           '<img src="' + product.img + '" alt="' + product.name + '">' +
           '<div class="name">' + product.name + '</div>' +
           '<div class="price">' + price + '</div>' +
         '</a>';
}

const cards = PRODUCTS.map(cardHtml).join('');
const dupe = PRODUCTS.map(p => cardHtml(p).replace('class="card"', 'class="card dupe"')).join('');

const track = document.getElementById('track');
track.innerHTML = cards + dupe;

/* Start the slide at a random point in its cycle, so you don't land on the
   same three products every visit. A negative animation-delay begins the
   animation part-way through rather than pausing it, and because the track
   is two identical copies the loop stays seamless wherever it starts. */
const CYCLE_SECONDS = 90;
track.style.animationDelay = '-' + (Math.random() * CYCLE_SECONDS).toFixed(1) + 's';
