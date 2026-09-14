/* Translations for the one product page that is, for reasons nobody has
   explained, not in English.

   NOTE: these need a native speaker's eye before the site goes live. They are
   a best effort, not a verified translation. The joke is broken localisation,
   not broken Georgian. */

const TRANSLATIONS = {
  ka: {
    brand:    'უხერხულობის მაღაზია',
    store:    'მაღაზია',
    services: 'სერვისები',
    signup:   'რეგისტრაცია',
    basket:   'კალათა',
    back:     'მაღაზიაში დაბრუნება',
    add:      'კალათაში დამატება',
    notify:   'შემატყობინეთ',
    soldOut:  'გაყიდულია',
    names: {
      'scratched-dvd': 'დაკაწრული DVD'
    },
    blurb: 'ლორემ იფსუმ დოლორ სით ამეთ. ეს აღწერა რატომღაც ქართულადაა. ჩვენ არ ვიცით რატომ.'
  }
};

function translations(locale) {
  return (locale && TRANSLATIONS[locale]) || null;
}
