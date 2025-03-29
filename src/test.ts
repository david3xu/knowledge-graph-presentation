/**
 * Simple test TypeScript file
 */

// Log a message to the console
console.log('TypeScript is working!');

// Add a message to the document body
document.addEventListener('DOMContentLoaded', () => {
  const div = document.createElement('div');
  div.textContent = 'TypeScript content loaded!';
  div.style.padding = '20px';
  div.style.backgroundColor = '#f0f0f0';
  div.style.marginTop = '20px';
  document.body.appendChild(div);
});

export {}; 