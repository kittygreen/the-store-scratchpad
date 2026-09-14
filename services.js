/* Services. None of them are available. All of them lead to the sign-up flow.

   Images are placeholders until the real shots land — drop replacements in
   at shop/img/<id>-green.jpg and <id>-yellow.jpg and change the two lines
   in the forEach below from .svg to .jpg. */

const SERVICES = [
  { id: 'clothes-shrinking', name: 'Clothes Shrinking', tilt: -6 },
  { id: 'car-scratching',    name: 'Car Scratching',    tilt: 4 },
  { id: 'drain-blocking',    name: 'Drain Blocking',    tilt: -3 },
  { id: 'screen-cracking',   name: 'Screen Cracking',   tilt: 7 }
];

SERVICES.forEach(s => {
  s.imgGreen  = 'img/' + s.id + '-green.svg';
  s.imgYellow = 'img/' + s.id + '-yellow.svg';
  s.flag = 'UNAVAILABLE';
  s.caption = 'Notify me';
  s.href = 'signup.html';
});
