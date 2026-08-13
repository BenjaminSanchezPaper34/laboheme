/* ═══════════════════════════════════════════════════════════
   LA BOHÈME — Vos Avis
   ───────────────────────────────────────────────────────────
   ⚡ FICHIER À ÉDITER pour mettre en avant les avis Google
   4 et 5 étoiles — rien d'autre à toucher.

   AVIS_RESUME : la note globale de la fiche Google.
     note  : ex '4,9'  — laisser '' pour masquer la ligne
     total : ex 27     (nombre d'avis)

   AVIS : un avis = un bloc { etoiles, texte, auteur, date }
     etoiles : 4 ou 5
     texte   : le texte de l'avis (copié depuis Google)
     auteur  : 'Prénom N.' (comme affiché sur Google)
     date    : 'juillet 2026' (le mois affiché sur Google)

   S'il n'y a aucun avis dans la liste, seul le bloc
   « Votre avis compte » s'affiche (comme avant).
   ═══════════════════════════════════════════════════════════ */

var AVIS_RESUME = { note: '', total: '' };

var AVIS = [
];

/* ─── Rendu (ne pas modifier) ────────────────────────────── */
(function () {
  'use strict';

  var carrousel = document.getElementById('avisCarrousel');
  if (!carrousel) return;

  // Ligne de résumé « ★ 4,9/5 · 27 avis Google »
  var resume = document.getElementById('avisResume');
  if (resume && AVIS_RESUME.note) {
    resume.innerHTML = '<strong>★ ' + AVIS_RESUME.note + '/5</strong>' +
      (AVIS_RESUME.total ? ' · ' + AVIS_RESUME.total + ' avis Google' : '');
    resume.hidden = false;
  }

  if (!AVIS.length) { carrousel.remove(); return; }

  AVIS.forEach(function (a) {
    var card = document.createElement('article');
    card.className = 'avis-card reveal';

    var etoiles = '';
    for (var i = 0; i < 5; i++) {
      etoiles += (i < a.etoiles) ? '★' : '☆';
    }

    card.innerHTML =
      '<p class="avis-card__etoiles" aria-label="' + a.etoiles + ' étoiles sur 5">' + etoiles + '</p>' +
      '<p class="avis-card__texte">' + a.texte + '</p>' +
      '<p class="avis-card__auteur">' + a.auteur +
      (a.date ? ' <span>· ' + a.date + '</span>' : '') + '</p>';

    carrousel.appendChild(card);
  });
})();
