import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Reveal.js
  const deck = new Reveal({
    hash: true,
    controls: true,
    progress: true,
    center: true,
    transition: 'slide'
  });
  
  deck.initialize();
});
