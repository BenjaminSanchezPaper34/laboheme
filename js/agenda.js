/* ═══════════════════════════════════════════════════════════
   LA BOHÈME — L'Actu de la plage
   ───────────────────────────────────────────────────────────
   ⚡ FICHIER À ÉDITER CHAQUE SEMAINE — rien d'autre à toucher.

   Une soirée = une ligne dans la liste AGENDA ci-dessous :
     date    : au format 'AAAA-MM-JJ'
     titre   : le nom de la soirée
     horaire : texte libre ('21h — 1h', 'dès 21h'…)
     details : (optionnel) happy hour, infos pratiques…
     insta   : (optionnel) handle Insta de l'artiste, SANS le @
               ex : 'teusofficial' → lien cliquable @teusofficial

   Le système fait le reste :
   • les soirées passées disparaissent automatiquement
   • badge « ce soir ! » le jour même
   • s'il n'y a plus aucune soirée à venir, la section
     et son onglet se masquent entièrement
   ═══════════════════════════════════════════════════════════ */

var AGENDA = [
  {
    date: '2026-07-16',
    titre: 'DJ Teus',
    horaire: '21h — 1h',
    details: 'Happy hour de 19h à 21h : cocktails à 10€ (hors signatures)',
    insta: 'teusofficial'
  },
  {
    date: '2026-07-17',
    titre: 'Uma — DJ & Saxo live',
    horaire: '21h — 1h',
    details: 'DJ set accompagné au saxophone — comme à l\'inauguration !',
    insta: 'uma.dj'
  },
  {
    date: '2026-07-20',
    titre: 'Zone V — Après-midi festif',
    horaire: '15h — 19h',
    details: '',
    insta: 'z_o_n_e__v'
  }
];

/* ─── Rendu (ne pas modifier) ────────────────────────────── */
(function () {
  'use strict';

  var section = document.getElementById('actu');
  var liste = document.getElementById('actuListe');
  if (!section || !liste) return;

  // Date du jour au format AAAA-MM-JJ (heure locale)
  var d = new Date();
  var aujourdhui = d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');

  // On ne garde que les soirées d'aujourd'hui et à venir
  var aVenir = AGENDA
    .filter(function (e) { return e.date >= aujourdhui; })
    .sort(function (a, b) { return a.date < b.date ? -1 : 1; });

  // Rien à venir : on retire la section, son séparateur et l'onglet
  if (!aVenir.length) {
    var chip = document.querySelector('.nav__chip[href="#actu"]');
    var sep = document.getElementById('sepActu');
    if (chip) chip.remove();
    if (sep) sep.remove();
    section.remove();
    return;
  }

  aVenir.forEach(function (e) {
    var quand = new Date(e.date + 'T12:00:00');
    var dateFr = quand.toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long'
    });

    var li = document.createElement('li');
    li.className = 'evenement reveal';

    var badge = (e.date === aujourdhui)
      ? ' <span class="evenement__badge">ce soir !</span>'
      : '';

    // Lien Insta de l'artiste (optionnel)
    var insta = '';
    if (e.insta) {
      var svg = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" ' +
        'stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
        'stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" ' +
        'width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4.5"/>' +
        '<circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none"/></svg>';
      insta = '<a class="evenement__insta" ' +
        'href="https://www.instagram.com/' + e.insta + '/" ' +
        'target="_blank" rel="noopener">' + svg + '@' + e.insta + '</a>';
    }

    li.innerHTML =
      '<p class="evenement__date">' + dateFr + badge + '</p>' +
      '<h3 class="evenement__titre">' + e.titre + '</h3>' +
      '<p class="evenement__horaire">' + e.horaire + '</p>' +
      (e.details ? '<p class="evenement__details">' + e.details + '</p>' : '') +
      insta;

    liste.appendChild(li);
  });
})();
