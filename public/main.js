// Main JavaScript entry point
console.log('Main JavaScript loaded');

// We'll initialize our own reveal.js instance here 
// instead of importing the TypeScript file which might be causing problems
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM content loaded');
  
  // We already have reveal.js initialized in the HTML file
  // This file is just to verify that JavaScript is working
}); 