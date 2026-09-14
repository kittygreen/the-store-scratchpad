/* Builds the storefront carousel.

   The card list is rendered twice into one track. The animation shifts the
   track by exactly half its width, so the second copy is in the first copy's
   place at the moment it loops and the slide looks endless.

   Spacing is a margin on the card rather than a flex `gap`. With `gap`, half
   the track width lands half a gap short of where the second copy begins and
   the loop visibly jumps. */

const CYCLE_SECONDS = 180;

/* Each card flashes between its green and yellow shot on its own rhythm.
   Kept between 1.3s and 2.7s — well under three flashes a second, which is
   the rate above which flashing becomes a seizure risk. Derived from the
   product's position so a card and its duplicate always match. */
function flashSeconds(index) {
  return (1.3 + ((index * 0.37) % 1.4)).toFixed(2) + 's';
}

function cardHtml(product, index) {
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

  const style = 'style="--flash:' + flashSeconds(index) +
                ';--tilt:' + (product.tilt || 0) + 'deg"';

  return '<a class="card" href="' + href + '"' + target + ' ' + style + '>' +
           flag +
           '<span class="shot">' +
             '<img src="' + product.imgGreen + '" alt="' + product.name + '">' +
             '<img class="y" src="' + product.imgYellow + '" alt="" aria-hidden="true">' +
           '</span>' +
           '<span class="name">' + product.name + '</span>' +
           '<span class="price">' + price + '</span>' +
         '</a>';
}

const cards = PRODUCTS.map(cardHtml).join('');
const dupe = PRODUCTS.map((p, i) => cardHtml(p, i).replace('class="card"', 'class="card dupe"')).join('');

const track = document.getElementById('track');
track.innerHTML = cards + dupe;

/* Start the slide at a random point in its cycle, so you don't land on the
   same three products every visit. A negative animation-delay begins the
   animation part-way through rather than pausing it, and because the track
   is two identical copies the loop stays seamless wherever it starts. */
track.style.animationDelay = '-' + (Math.random() * CYCLE_SECONDS).toFixed(1) + 's';
