/* IFRAME HEIGHT ADJUSTMENT (shared) */
(function () {
  function getDocHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
  }

  function sendHeight() {
    try {
      const h = getDocHeight();
      parent.postMessage({ type: 'iframeHeight', height: h }, '*');
    } catch (e) {}
  }

  window.addEventListener('load', () => {
    const imgs = Array.from(document.images || []);
    if (imgs.length === 0) { sendHeight(); return; }
    let loaded = 0;
    imgs.forEach(img => {
      if (img.complete) loaded++;
      else {
        img.addEventListener('load', () => { loaded++; if (loaded === imgs.length) sendHeight(); });
        img.addEventListener('error', () => { loaded++; if (loaded === imgs.length) sendHeight(); });
      }
    });
    if (loaded === imgs.length) sendHeight();
  });

  window.addEventListener('message', (ev) => {
    const d = ev.data || {};
    if (d.type === 'requestHeight') sendHeight();
  });
})();

/* SLIDESHOW NAVIGATION (shared) */
document.addEventListener('DOMContentLoaded', () => {
  const slides = Array.from(document.querySelectorAll('.slideshow img'));
  const leftBtn = document.querySelector('.arrow.left');
  const rightBtn = document.querySelector('.arrow.right');
  let currentIndex = 0;

  if (!slides.length) return; // no slides on this page

  function showSlide(index) {
    slides.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });
    setTimeout(() => {
      try {
        const h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        parent.postMessage({ type: 'iframeHeight', height: h }, '*');
      } catch (e) {}
    }, 50);
  }

  leftBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  });

  rightBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') leftBtn.click();
    if (e.key === 'ArrowRight') rightBtn.click();
  });

  setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }, 3000);
});