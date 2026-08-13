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

  /* ─── Sections pliables (la carte en accordéon) ──────────── */
  var pliables = document.querySelectorAll('.section--pliable');

  // Les .reveal d'une section qu'on ouvre s'affichent immédiatement
  function revelerDans(racine) {
    enAttenteReveal = enAttenteReveal.filter(function (el) {
      if (racine.contains(el)) {
        el.classList.add('instant');
        el.classList.add('visible');
        return false;
      }
      return true;
    });
  }

  pliables.forEach(function (section) {
    var tete = section.querySelector('.section__head');
    if (!tete) return;

    tete.setAttribute('role', 'button');
    tete.setAttribute('tabindex', '0');
    tete.setAttribute('aria-expanded', 'false');

    function basculer(forcer) {
      var ouvert = (forcer === true) || (forcer !== false && !section.classList.contains('ouvert'));
      section.classList.toggle('ouvert', ouvert);
      tete.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
      if (ouvert) revelerDans(section);
    }

    tete.addEventListener('click', function () { basculer(); });
    tete.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); basculer(); }
    });

    section._basculerPliable = basculer;
  });

  // Une ancre (chip de nav, bouton…) qui vise une section pliée l'ouvre
  function ouvrirCible(hash) {
    if (!hash || hash.length < 2) return;
    var cible = document.querySelector(hash);
    if (cible && cible._basculerPliable) cible._basculerPliable(true);
  }

  document.addEventListener('click', function (ev) {
    var lien = ev.target.closest ? ev.target.closest('a[href^="#"]') : null;
    if (lien) ouvrirCible(lien.getAttribute('href'));
  });

  if (location.hash) ouvrirCible(location.hash);

  /* ─── Instagram flottant : visible une fois entré dans la carte ── */
  var fabInsta = document.getElementById('fabInsta');

  function majFab() {
    if (!fabInsta) return;
    fabInsta.classList.toggle('affiche', window.scrollY > window.innerHeight * 0.55);
  }

  /* ─── Boucle scroll unique (throttle rAF) ────────────────── */
  var enAttente = false;
  function surScroll() {
    if (enAttente) return;
    enAttente = true;
    requestAnimationFrame(function () {
      majReveals();
      majScrollspy();
      majFab();
      enAttente = false;
    });
  }

  window.addEventListener('scroll', surScroll, { passive: true });
  window.addEventListener('resize', surScroll, { passive: true });

  // État initial : ce qui est déjà à l'écran s'affiche immédiatement
  // (le reveal animé est réservé au contenu découvert en scrollant)
  majReveals(true);
  majScrollspy();
  majFab();
})();
