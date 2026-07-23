// Backward-compatible entry wrapper forwarding to js/config/config.js
if (typeof window !== 'undefined' && !window.UNIWEAR_CONFIG) {
  const s = document.createElement('script');
  s.src = 'js/config/config.js';
  document.head.appendChild(s);
}
