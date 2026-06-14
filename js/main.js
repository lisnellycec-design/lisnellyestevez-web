// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Animate stats counter
const counters = document.querySelectorAll('.stat-number');
const statsSection = document.querySelector('.stats');

const animateCounters = () => {
  counters.forEach(counter => {
    const target = +counter.dataset.target;
    if (target === 0) return;
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        counter.textContent = target;
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current);
      }
    }, 16);
  });
};

// Trigger counter on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      observer.disconnect();
    }
  });
}, { threshold: 0.4 });

if (statsSection) observer.observe(statsSection);

// Instagram carousel
(function () {
  const track = document.getElementById('ig-track');
  const carousel = document.getElementById('ig-carousel');
  const prevBtn = document.getElementById('ig-prev');
  const nextBtn = document.getElementById('ig-next');
  if (!track) return;

  const cards = track.querySelectorAll('.ig-card');
  const total = cards.length;
  let index = 0;
  let isDragging = false;
  let startX = 0;
  let startTranslate = 0;
  let currentTranslate = 0;

  function visibleCount() {
    const w = carousel.offsetWidth;
    if (w < 520) return 1;
    if (w < 800) return 2;
    return 3;
  }

  function cardWidth() {
    const gap = 16;
    return (carousel.offsetWidth - gap * (visibleCount() - 1)) / visibleCount();
  }

  function maxIndex() {
    return Math.max(0, total - visibleCount());
  }

  function goTo(i) {
    index = Math.max(0, Math.min(i, maxIndex()));
    currentTranslate = -(index * (cardWidth() + 16));
    track.style.transform = `translateX(${currentTranslate}px)`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index >= maxIndex();
  }

  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));

  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startTranslate = currentTranslate;
    track.classList.add('dragging');
    e.preventDefault();
  });
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    track.style.transform = `translateX(${startTranslate + e.clientX - startX}px)`;
  });
  document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove('dragging');
    const diff = e.clientX - startX;
    goTo(Math.abs(diff) > cardWidth() * 0.25 ? (diff < 0 ? index + 1 : index - 1) : index);
  });

  track.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    startTranslate = currentTranslate;
  }, { passive: true });
  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    track.style.transform = `translateX(${startTranslate + e.touches[0].clientX - startX}px)`;
  }, { passive: true });
  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diff = e.changedTouches[0].clientX - startX;
    goTo(Math.abs(diff) > cardWidth() * 0.25 ? (diff < 0 ? index + 1 : index - 1) : index);
  });

  window.addEventListener('resize', () => goTo(index));
  goTo(0);
})();

// Smooth reveal on scroll
const revealEls = document.querySelectorAll(
  '.service-card, .case-card, .testimonial-card, .value-item, .contact-method'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObserver.observe(el);
});
