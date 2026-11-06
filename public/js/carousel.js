(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var scrollBehavior = reduceMotion ? 'auto' : 'smooth';

  function setupCarousel(root) {
    var viewport = root.querySelector('[data-carousel-viewport]');
    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-carousel-slide]'));
    var prev = root.querySelector('[data-carousel-prev]');
    var next = root.querySelector('[data-carousel-next]');
    var dotsWrap = root.querySelector('[data-carousel-dots]');
    if (!viewport || slides.length < 2) return;

    var index = 0;
    var dots = [];
    var programmatic = false;
    var programmaticTimer;

    function slideWidth() {
      return slides[0].getBoundingClientRect().width;
    }

    function goTo(i) {
      index = Math.max(0, Math.min(slides.length - 1, i));
      // Suppress the scroll handler while we drive the animation ourselves,
      // otherwise intermediate scroll positions make the arrows/dots flicker.
      programmatic = true;
      clearTimeout(programmaticTimer);
      programmaticTimer = setTimeout(function () { programmatic = false; }, 600);
      viewport.scrollTo({ left: index * slideWidth(), behavior: scrollBehavior });
      update();
    }

    function update() {
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === slides.length - 1;
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
        dot.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
    }

    // Build dots once we know the slide count.
    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel__dot';
        dot.setAttribute('aria-label', 'Go to image ' + (i + 1));
        dot.addEventListener('click', function () { goTo(i); });
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });
    }

    if (prev) prev.addEventListener('click', function () { goTo(index - 1); });
    if (next) next.addEventListener('click', function () { goTo(index + 1); });

    // Keyboard support when the viewport has focus.
    viewport.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
    });

    // Keep the index in sync with native scrolling (drag, swipe, trackpad).
    var scrollTimer;
    viewport.addEventListener('scroll', function () {
      if (programmatic) return;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        var w = slideWidth();
        if (w > 0) {
          index = Math.max(0, Math.min(slides.length - 1, Math.round(viewport.scrollLeft / w)));
        }
        update();
      }, 100);
    }, { passive: true });

    // Re-align to the active slide after the layout changes size.
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        viewport.scrollTo({ left: index * slideWidth(), behavior: 'auto' });
      }, 150);
    });

    // Always open on the first image. Browsers restore the scroll offset of
    // overflow containers on reload, and keep it verbatim when a page is
    // revived from the back/forward cache, which would otherwise leave the
    // carousel parked on whatever image was last shown.
    function reset() {
      index = 0;
      programmatic = true;
      clearTimeout(programmaticTimer);
      viewport.scrollTo({ left: 0, behavior: 'auto' });
      update();
      programmaticTimer = setTimeout(function () { programmatic = false; }, 100);
    }

    window.addEventListener('pageshow', function (e) {
      if (e.persisted) reset();
    });

    reset();
  }

  function init() {
    var roots = document.querySelectorAll('[data-carousel]');
    Array.prototype.forEach.call(roots, setupCarousel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
