/* ============================================================
   Auto Logo LP — interaction layer
   ============================================================ */
(function () {
  'use strict';

  // ---------- Year in footer ----------
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Scroll progress + header state + back-to-top ----------
  var progressBar = document.getElementById('scrollProgressBar');
  var header = document.getElementById('siteHeader');
  var backToTop = document.getElementById('backToTop');

  function onScroll() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
    if (header) header.classList.toggle('is-scrolled', scrollTop > 12);
    if (backToTop) backToTop.classList.toggle('is-visible', scrollTop > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Mobile drawer ----------
  var menuBtn = document.getElementById('menuBtn');
  var drawer = document.getElementById('mobileDrawer');
  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', function () {
      drawer.classList.toggle('is-open');
      drawer.setAttribute('aria-hidden', drawer.classList.contains('is-open') ? 'false' : 'true');
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { drawer.classList.remove('is-open'); });
    });
  }

  // ---------- Smooth-scroll for anchors (in addition to CSS smooth) ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (href.length > 1) {
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var top = target.getBoundingClientRect().top + window.pageYOffset - 70;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
    });
  });

  // ---------- DataLayer events ----------
  function pushEvent(name, payload) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: name }, payload || {}));
  }

  document.querySelectorAll('[data-event]').forEach(function (el) {
    el.addEventListener('click', function () {
      var evt = el.getAttribute('data-event');
      var loc = el.getAttribute('data-loc') || 'unknown';
      pushEvent(evt, { location: loc });
    });
  });

  // ---------- Lead form submit ----------
  var leadForm = document.getElementById('leadForm');
  var leadSubmit = document.getElementById('leadSubmit');
  if (leadForm && leadSubmit) {
    leadForm.addEventListener('submit', function () {
      pushEvent('form_submit', { form_id: 'leadForm', form_name: 'Auto Logo — Google Ads LP' });
      leadSubmit.disabled = true;
      leadSubmit.textContent = 'שולח…';
    });
  }

  // ---------- Scroll reveal (IntersectionObserver) ----------
  if ('IntersectionObserver' in window) {
    var revealEls = document.querySelectorAll('.why-card, .what-item, .gallery-tile, .faq-item, .area-cities li, .pricing-card, .reviews-inner, .lead-form');
    revealEls.forEach(function (el) { el.classList.add('reveal'); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  }
})();
