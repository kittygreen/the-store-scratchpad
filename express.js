/* Alphabetical, except anything pinned stays at the bottom. */
const sorted = PRODUCTS.slice().sort((a, b) => {
  if (!!a.pinLast !== !!b.pinLast) return a.pinLast ? 1 : -1;
  return a.name.localeCompare(b.name);
});

document.getElementById('list').innerHTML = sorted.map(product => {
  const href = product.externalUrl
    ? product.externalUrl
    : 'product.html?id=' + encodeURIComponent(product.id);
  const price = product.externalUrl ? 'varies' : formatPrice(product.price);
  const cls = product.inStock ? '' : ' class="out"';
  const tag = product.inStock ? '' : ' (sold out)';   // cheque-only stays a surprise
  const target = product.newTab ? ' target="_blank" rel="noopener noreferrer"' : '';
  return '<li><a href="' + href + '"' + cls + target + '><span>' + product.name + tag +
         '</span><span>' + price + '</span></a></li>';
}).join('');

startNagTimer({ seconds: 10, message: 'need more time?', page: 'express' });
