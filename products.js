/* Product catalogue.
   Plain JS rather than JSON so the pages work over file:// as well as http.
   Prices are in pence — never floats, or the basket totals drift.

   Each product has a green and a yellow shot. The carousel flashes between
   them; the product page uses the green one. `tilt` is the angle the card
   crop is rotated by, so the subjects aren't all dead level. */

const PRODUCTS = [
  {
    id: 'stone',
    name: 'The Stone In Your Shoe',
    price: 201,
    inStock: true,
    offer: '2for3',            // buy two, get charged for a third
    tilt: -5
  },
  {
    id: 'garlic-mouthwash',
    name: 'Garlic Mouthwash',
    price: 201,
    inStock: false,
    tilt: 3
  },
  {
    id: 'bent-tent-peg',
    name: 'Bent Tent Peg',
    price: 301,
    inStock: true,
    tilt: 7
  },
  {
    id: 'sandpaper-dildo',
    name: 'Sandpaper Dildo',
    hiddenName: 'XXX Product',   // the real name is the reward for the age gate
    ageRestricted: true,
    pixelated: true,             // unreadable in the listing, resolves on the product page
    notice: 'Not for use',
    price: 9423,
    inStock: true,
    chequeOnly: true,          /* Never enters the basket and never reaches
                                  Stripe, which neatly sidesteps their rules on
                                  adult products. See BUILD-NOTES.md. */
    tilt: -2
  },
  {
    id: 'wet-rizzlas',
    name: 'Wet Rizzlas',
    price: 50,
    inStock: true,
    forced: true,              // one lands in every basket and will not leave
    tilt: 6
  },
  {
    id: 'used-napkin',
    name: 'Napkin (used)',
    price: 101,
    inStock: true,
    tilt: -8
  },
  {
    id: 'scratched-dvd',
    name: 'Scratched DVD',
    price: 101,
    inStock: true,
    locale: 'uk',              // ISO 639-1 for Ukrainian, not the United Kingdom
    tilt: 4
  },
  {
    id: 'waterproof-loo-roll',
    name: 'Waterproof Loo Roll',
    price: 301,
    inStock: false,
    tilt: -6
  },
  {
    id: 'single-sock',
    name: 'Single Sock With Hole',
    description: 'Socks may vary.',
    recommend: { label: 'Often bought with', ids: ['stone'] },
    price: 301,
    inStock: true,
    tilt: 9
  },
  {
    id: 'bucket-hat',
    name: 'Inconvenience Store Bucket Hat (Yellow)',
    recommend: { label: 'Complete the look with...', ids: ['wet-rizzlas'] },
    price: 2500,             // matches the £25 on the pop-up ad
    inStock: true,
    tilt: -3
  },
  {
    id: 'bucket-hat-2',
    name: 'Inconvenience Store Bucket Hat (Green)',
    recommend: { label: 'Complete the look with...', ids: ['wet-rizzlas'] },
    price: 2500,
    inStock: true,
    tilt: 5
  },
  {
    id: 'ryanair',
    name: 'A Ryanair Flight',
    externalUrl: 'https://www.ryanair.com/',
    inStock: true,
    pinLast: true,             // stays at the bottom even when sorted
    newTab: true,
    tilt: -7
  }
];

/* Every product has both shots, named consistently. Pixelated products get a
   deliberately tiny version in the listings — 20px wide, blown back up by the
   browser — so you genuinely cannot make out what it is. */
PRODUCTS.forEach(p => {
  p.imgGreen  = 'img/' + p.id + '-green.jpg';
  p.imgYellow = 'img/' + p.id + '-yellow.jpg';
  p.img = p.imgGreen;
  if (p.pixelated) {
    p.listGreen  = 'img/' + p.id + '-green-pixel.jpg';
    p.listYellow = 'img/' + p.id + '-yellow-pixel.jpg';
  }
});

const BLURB = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.';

/* Age verification state. Lives here rather than in cart.js because the
   listings need it too — an age-restricted product shows a placeholder name
   until someone has been through the gate. */
function agePassed() {
  return sessionStorage.getItem('ageVerified') === 'true';
}

function displayName(item) {
  return (item.hiddenName && !agePassed()) ? item.hiddenName : item.name;
}

/* Where a listing should send you: through the gate first if the product is
   age restricted and you haven't been. */
function productHref(item) {
  if (item.externalUrl) return item.externalUrl;
  const target = 'product.html?id=' + encodeURIComponent(item.id);
  if (item.ageRestricted && !agePassed()) {
    return 'age-gate.html?next=' + encodeURIComponent(target);
  }
  return target;
}

function findProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

function formatPrice(pence) {
  return pence < 100 ? pence + 'p' : '£' + (pence / 100).toFixed(2);
}

/* Where to post your cheque. The payee must match the bank account, so this
   is the registered brand name rather than any variation on it. */
const CHEQUE_ADDRESS = [
  'The Inconvenience Store',
  '99 Streety McStreetface',
  'Townsville',
  'SE00 0XX'
];
