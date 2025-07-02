// Параллакс-эффект для фона Hero Section
window.addEventListener('scroll', function() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  let offset = window.scrollY;
  hero.style.backgroundPosition = `center ${offset * 0.2}px`;
});

// Анимация появления иконок поочередно
window.addEventListener('DOMContentLoaded', () => {
  const icons = document.querySelectorAll('.icon-card');
  icons.forEach((icon, i) => {
    icon.style.animationDelay = `${0.9 + i * 0.15}s`;
  });
}); 