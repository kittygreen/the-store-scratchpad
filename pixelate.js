/* Pixelate-in.

   Draws the image to a canvas at a very low resolution and steps the
   resolution up over a few seconds, so it resolves into focus in blocks.
   Smoothing is off, which is what makes it read as pixels rather than blur.

   Used on age-restricted products, where it always runs instead of one of
   the random slide transitions. */

function pixelateIn(img, seconds) {
  const canvas = document.createElement('canvas');
  canvas.className = img.className.replace(/\banim\b|\bfly\b|\bspin\b|\bdrop\b|\bswivel\b|\bzoom\b|\bwipe\b/g, '').trim();
  const context = canvas.getContext('2d');

  function run() {
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    canvas.width = width;
    canvas.height = height;
    img.replaceWith(canvas);

    const STEPS = [4, 6, 9, 13, 19, 28, 42, 64, 100, 160, 260, 420];
    const interval = (seconds * 1000) / STEPS.length;
    context.imageSmoothingEnabled = false;

    let step = 0;
    function draw() {
      if (step >= STEPS.length) {
        /* Final pass at full resolution, smoothing back on. */
        context.imageSmoothingEnabled = true;
        context.drawImage(img, 0, 0, width, height);
        return;
      }
      const w = STEPS[step];
      const h = Math.max(1, Math.round(w * height / width));
      context.clearRect(0, 0, width, height);
      context.drawImage(img, 0, 0, w, h);
      context.drawImage(canvas, 0, 0, w, h, 0, 0, width, height);
      step++;
      setTimeout(draw, interval);
    }
    draw();
  }

  if (img.complete && img.naturalWidth) run();
  else img.addEventListener('load', run, { once: true });
}
