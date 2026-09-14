/* Product catalogue.
   Plain JS rather than JSON so the pages work over file:// as well as http.
   Prices are in pence — never floats, or the basket totals drift. */

const PRODUCTS = [
  {
    id: 'stone',
    name: 'The Stone In Your Shoe',
    price: 201,
    inStock: true,
    offer: '2for3',            // buy two, get charged for a third
    img: 'img/stone.svg'
  },
  {
    id: 'garlic-mouthwash',
    name: 'Garlic Mouthwash',
    price: 201,
    inStock: false,
    img: 'img/garlic-mouthwash.svg'
  },
  {
    id: 'bent-tent-peg',
    name: 'Bent Tent Peg',
    price: 301,
    inStock: true,
    img: 'img/bent-tent-peg.svg'
  },
  {
    id: 'sandpaper-dildo',
    name: 'Sandpaper Dildo',
    notice: 'Not for use',
    price: 9423,
    inStock: true,
    chequeOnly: true,          /* Never enters the basket and never reaches
                                  Stripe, which neatly sidesteps their rules on
                                  adult products. See BUILD-NOTES.md. */
    img: 'img/sandpaper-dildo.svg'
  },
  {
    id: 'wet-rizzlas',
    name: 'Wet Rizzlas',
    price: 50,
    inStock: true,
    ageRestricted: true,       // triggers the (entirely unnecessary) age gate
    forced: true,              // one lands in every basket and will not leave
    img: 'img/wet-rizzlas.svg'
  },
  {
    id: 'used-napkin',
    name: 'Napkin (used)',
    price: 101,
    inStock: true,
    img: 'img/used-napkin.svg'
  },
  {
    id: 'scratched-dvd',
    name: 'Scratched DVD',
    price: 101,
    inStock: true,
    locale: 'uk',              // ISO 639-1 for Ukrainian, not the United Kingdom
    img: 'img/scratched-dvd.svg'
  },
  {
    id: 'waterproof-loo-roll',
    name: 'Waterproof Loo Roll',
    price: 301,
    inStock: false,
    img: 'img/waterproof-loo-roll.svg'
  },
  {
    id: 'single-sock',
    name: 'Single Sock With Hole (used)',
    price: 301,
    inStock: true,
    img: 'img/single-sock.svg'
  },
  {
    id: 'bucket-hat',
    name: 'Inconvenience Store Bucket Hat',
    price: 2500,             // matches the £25 on the pop-up ad
    inStock: true,
    img: 'img/bucket-hat.svg'
  },
  {
    id: 'ryanair',
    name: 'A Ryanair Flight',
    externalUrl: 'https://www.ryanair.com/',
    inStock: true,
    pinLast: true,             // stays at the bottom even when sorted
    newTab: true,
    img: 'img/ryanair.svg'
  }
];

const BLURB = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.';

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
