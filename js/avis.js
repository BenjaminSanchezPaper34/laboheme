/* ═══════════════════════════════════════════════════════════
   LA BOHÈME — Vos Avis
   ───────────────────────────────────────────────────────────
   Les avis Google (note globale + avis 4-5 étoiles) sont
   récupérés AUTOMATIQUEMENT via /api/avis (API officielle
   Google Places, voir api/avis.js). Rien à maintenir ici.

   AVIS ci-dessous = mode manuel optionnel : si on y met des
   avis, ils remplacent la récupération automatique (utile
   pour choisir soi-même les avis affichés).
     { etoiles: 5, texte: '…', auteur: 'Prénom N.', date: 'août 2026' }

   S'il n'y a ni avis manuels ni API disponible, seul le bloc
   « Votre avis compte » s'affiche.
   ═══════════════════════════════════════════════════════════ */

var AVIS = [
];

/* ─── Rendu (ne pas modifier) ────────────────────────────── */
(function () {
  'use strict';

  var carrousel = document.getElementById('avisCarrousel');
  if (!carrousel) return;

  function afficherResume(note, total) {
    var resume = document.getElementById('avisResume');
    if (!resume || !note) return;
    var noteFr = String(note).replace('.', ',');
    resume.innerHTML = '<strong>★ ' + noteFr + '/5</strong>' +
      (total ? ' · ' + total + ' avis Google' : '');
    resume.hidden = false;
  }

  function afficherAvis(liste) {
    liste.forEach(function (a) {
      var card = document.createElement('article');
      card.className = 'avis-card';

      var etoiles = '';
      for (var i = 0; i < 5; i++) {
        etoiles += (i < a.etoiles) ? '★' : '☆';
      }

      // Texte inséré en textContent : aucun HTML externe ne passe
      var pEtoiles = '<p class="avis-card__etoiles" aria-label="' + a.etoiles + ' étoiles sur 5">' + etoiles + '</p>';
      card.innerHTML = pEtoiles +
        '<p class="avis-card__texte"></p>' +
        '<p class="avis-card__auteur"></p>';
      card.querySelector('.avis-card__texte').textContent = a.texte;
      card.querySelector('.avis-card__auteur').textContent =
        a.auteur + (a.date ? ' · ' + a.date : '');

      carrousel.appendChild(card);
    });
  }

  // Mode manuel prioritaire
  if (AVIS.length) {
    afficherAvis(AVIS);
    return;
  }

  // Sinon : récupération automatique via l'API
  fetch('api/avis')
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (d && d.ok && d.avis && d.avis.length) {
        afficherResume(d.note, d.total);
        afficherAvis(d.avis);
      } else {
        carrousel.remove();
      }
    })
    .catch(function () { carrousel.remove(); });
})();
