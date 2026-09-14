/* The flashing carousel, shared by the Store and Services pages.

   The item list is rendered twice into one track. The animation shifts the
   track by exactly half its width, so the second copy is in the first copy's
   place at the moment it loops and the slide looks endless.

   Spacing is a margin on the card rather than a flex `gap`. With `gap`, half
   the track width lands half a gap short of where the second copy begins and
   the loop visibly jumps. */

const CYCLE_SECONDS = 180;

/* Each card flashes between its green and yellow shot on its own rhythm.
   Kept between 1.3s and 2.7s — well under three flashes a second, which is
   the rate above which flashing becomes a seizure risk. Derived from the
   item's position so a card and its duplicate always match. */
function flashSeconds(index) {
  return (1.3 + ((index * 0.37) % 1.4)).toFixed(2) + 's';
}

function carouselCard(item, index) {
  /* Services link straight to the sign-up flow; products get a product page;
     the Ryanair listing goes off-site. */
  const href = item.href || productHref(item);

  let flag = '';
  if (item.flag) flag = '<span class="flag">' + item.flag + '</span>';
  else if (!item.inStock) flag = '<span class="flag">SOLD OUT</span>';
  else if (item.offer === '2for3') flag = '<span class="flag offer">2 FOR 3!</span>';
  /* Cheque-only is deliberately not flagged. It is a surprise for the moment
     you try to add it to the basket. */

  const caption = item.caption
    || (item.externalUrl ? 'prices vary wildly' : formatPrice(item.price));

  /* rel=noopener stops the opened page getting a handle on ours. */
  const target = item.newTab ? ' target="_blank" rel="noopener noreferrer"' : '';

  /* Age-restricted products hide their name until you've been through. */
  const label = item.hiddenName ? displayName(item) : item.name;

  const style = 'style="--flash:' + flashSeconds(index) +
                ';--tilt:' + (item.tilt || 0) + 'deg"';

  return '<a class="card" href="' + href + '"' + target + ' ' + style + '>' +
           flag +
           '<span class="shot">' +
             '<img src="' + item.imgGreen + '" alt="' + label + '">' +
             '<img class="y" src="' + item.imgYellow + '" alt="" aria-hidden="true">' +
           '</span>' +
           '<span class="name">' + label + '</span>' +
           '<span class="price">' + caption + '</span>' +
         '</a>';
}

function renderCarousel(items) {
  const track = document.getElementById('track');
  const cards = items.map(carouselCard).join('');
  const dupe = items.map((item, i) =>
    carouselCard(item, i).replace('class="card"', 'class="card dupe"')).join('');

  track.innerHTML = cards + dupe;

  /* Start at a random point in the cycle so you don't land on the same three
     items every visit. A negative delay begins the animation part-way through
     rather than pausing it; because the track is two identical copies the
     loop stays seamless wherever it starts. */
  track.style.animationDelay = '-' + (Math.random() * CYCLE_SECONDS).toFixed(1) + 's';
}
