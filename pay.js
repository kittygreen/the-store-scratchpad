/* Placeholder for the webinar. Prints the exact line items Stripe needs, so
   the integration session starts from a known shape rather than a blank page. */
const lineItems = cartLines().map(line => ({
  description: line.name,
  quantity: line.qty,
  unit_amount_pence: line.unit
}));

document.getElementById('lineItems').textContent =
  JSON.stringify({ line_items: lineItems, total_pence: cartTotal() }, null, 2);
