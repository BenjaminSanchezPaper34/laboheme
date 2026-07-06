/* ═══════════════════════════════════════════════════════════
   LA BOHÈME — Carte digitale
   1. Reveal au scroll (stagger léger par section)
   2. Scrollspy : chip active dans la nav sticky
   Le tout dans un seul handler scroll throttlé par rAF,
   sans dépendance — fiable sur tous les mobiles.
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var reduitMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── 1. Reveal au scroll ────────────────────────────────── */
  var enAttenteReveal = []; // éléments pas encore révélés

  if (reduitMotion) {
    // Pas d'animation : tout est visible immédiatement
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  } else {
    // Stagger : délai croissant pour les éléments d'un même bloc
    // (réinitialisé par section pour ne pas cumuler à l'infini)
    document.querySelectorAll('section, .hero, .footer').forEach(function (bloc) {
      var i = 0;
      bloc.querySelectorAll('.reveal').forEach(function (el) {
        el.style.setProperty('--delai', (Math.min(i, 8) * 0.07) + 's');
        i++;
        enAttenteReveal.push(el);
      });
    });
  }

  function majReveals(immediat) {
    if (!enAttenteReveal.length) return;
    var seuil = window.innerHeight * 0.92; // révèle un peu avant le bas
    var restants = [];
    enAttenteReveal.forEach(function (el) {
      // Révélé dès qu'il passe le seuil bas — ou s'il est déjà
      // au-dessus du viewport (saut d'ancre depuis la nav)
      if (el.getBoundingClientRect().top < seuil) {
        // Au chargement : ce qui est à l'écran s'affiche sans fondu
        if (immediat) el.classList.add('instant');
        el.classList.add('visible');
      } else {
        restants.push(el);
      }
    });
    enAttenteReveal = restants;
  }

  /* ─── 2. Scrollspy sur la nav sticky ─────────────────────── */
  var chips = document.querySelectorAll('.nav__chip');
  var sections = [];

  chips.forEach(function (chip) {
    var section = document.querySelector(chip.getAttribute('href'));
    if (section) sections.push({ chip: chip, section: section });
  });

  var chipActive = null;
  var premierSpy = true; // au chargement : positionnement instantané

  function majScrollspy() {
    var repere = window.scrollY + window.innerHeight * 0.35;
    var courante = null;
    sections.forEach(function (s) {
      if (s.section.offsetTop <= repere) courante = s.chip;
    });
    if (courante === chipActive) { premierSpy = false; return; }
    chipActive = courante;

    chips.forEach(function (c) { c.classList.remove('actif'); });
    if (courante) {
      courante.classList.add('actif');
      // La chip active reste visible dans la barre horizontale
      var comportement = (premierSpy || reduitMotion) ? 'auto' : 'smooth';
      courante.scrollIntoView({ behavior: comportement, block: 'nearest', inline: 'center' });
    }
    premierSpy = false;
  }

  /* ─── Boucle scroll unique (throttle rAF) ────────────────── */
  var enAttente = false;
  function surScroll() {
    if (enAttente) return;
    enAttente = true;
    requestAnimationFrame(function () {
      majReveals();
      majScrollspy();
      enAttente = false;
    });
  }

  window.addEventListener('scroll', surScroll, { passive: true });
  window.addEventListener('resize', surScroll, { passive: true });

  // État initial : ce qui est déjà à l'écran s'affiche immédiatement
  // (le reveal animé est réservé au contenu découvert en scrollant)
  majReveals(true);
  majScrollspy();
})();
