/* ═══════════════════════════════════════════════════════════
   LA BOHÈME — L'Actu de la plage
   ───────────────────────────────────────────────────────────
   ⚡ FICHIER À ÉDITER — rien d'autre à toucher.

   Deux listes :

   1) RECURRENTS — les rendez-vous de chaque semaine.
      Ces cartes restent affichées en permanence.
        jour    : 'Lundi', 'Vendredi'… (texte affiché)
        jourNum : 0=dimanche, 1=lundi, 2=mardi, 3=mercredi,
                  4=jeudi, 5=vendredi, 6=samedi
                  (sert au badge « c'est aujourd'hui ! »)
        titre / horaire / details / insta : comme ci-dessous

   2) AGENDA — les soirées ponctuelles (une date précise).
        date    : au format 'AAAA-MM-JJ'
        titre   : le nom de la soirée
        horaire : texte libre ('21h — 1h', 'dès 21h'…)
        details : (optionnel) happy hour, infos pratiques…
        insta   : (optionnel) handle Insta de l'artiste, SANS le @
                  ex : 'teusofficial' → lien cliquable @teusofficial

   Le système fait le reste :
   • les soirées ponctuelles passées disparaissent toutes seules
   • badge « ce soir ! » / « c'est aujourd'hui ! » le jour même
   • s'il n'y a plus rien du tout, la section et son onglet
     se masquent entièrement
   ═══════════════════════════════════════════════════════════ */

/* ─── 1) Chaque semaine, tout l'été ──────────────────────── */
var RECURRENTS = [
  {
    jour: 'Lundi',
    jourNum: 1,
    titre: 'Zone V',
    horaire: '15h — 19h',
    details: 'Après-midi festif, les pieds dans le sable',
    insta: 'z_o_n_e__v'
  },
  {
    jour: 'Vendredi',
    jourNum: 5,
    titre: 'Uma',
    horaire: '15h — 19h',
    details: 'Après-midi festif, DJ set face à la mer',
    insta: 'uma.dj'
  }
];

/* ─── 2) Les soirées ponctuelles ─────────────────────────── */
/* Vide pour l'instant : seules les cartes hebdomadaires
   s'affichent. Ajouter une soirée exceptionnelle sur ce modèle :

   {
     date: '2026-07-25',
     titre: 'DJ Teus',
     horaire: '21h — 1h',
     details: 'Happy hour de 19h à 21h : cocktails à 10€ (hors signatures)',
     insta: 'teusofficial'
   }
*/
var AGENDA = [
];

/* ─── Rendu (ne pas modifier) ────────────────────────────── */
(function () {
  'use strict';

  var section = document.getElementById('actu');
  var listeRec = document.getElementById('actuRecurrents');
  var listeDates = document.getElementById('actuListe');
  if (!section || !listeRec || !listeDates) return;

  var d = new Date();

  // Date du jour au format AAAA-MM-JJ (heure locale)
  var aujourdhui = d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0');

  var jourSemaine = d.getDay(); // 0=dimanche … 6=samedi

  // Icône Instagram (SVG inline, même tracé que le reste du site)
  var svgInsta = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
    'stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" ' +
    'width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4.5"/>' +
    '<circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none"/></svg>';

  function lienInsta(handle) {
    if (!handle) return '';
    return '<a class="evenement__insta" ' +
      'href="https://www.instagram.com/' + handle + '/" ' +
      'target="_blank" rel="noopener">' + svgInsta + '@' + handle + '</a>';
  }

  function carte(opts) {
    var li = document.createElement('li');
    li.className = 'evenement reveal' + (opts.recurrent ? ' evenement--recurrent' : '');
    li.innerHTML =
      '<p class="evenement__date">' + opts.entete + opts.badge + '</p>' +
      '<h3 class="evenement__titre">' + opts.titre + '</h3>' +
      '<p class="evenement__horaire">' + opts.horaire + '</p>' +
      (opts.details ? '<p class="evenement__details">' + opts.details + '</p>' : '') +
      lienInsta(opts.insta);
    return li;
  }

  /* Rendez-vous hebdomadaires — toujours affichés */
  RECURRENTS.forEach(function (e) {
    listeRec.appendChild(carte({
      recurrent: true,
      entete: 'Chaque ' + e.jour.toLowerCase(),
      badge: (e.jourNum === jourSemaine)
        ? ' <span class="evenement__badge">c\'est aujourd\'hui !</span>'
        : '',
      titre: e.titre,
      horaire: e.horaire,
      details: e.details,
      insta: e.insta
    }));
  });

  /* Soirées ponctuelles — on ne garde que celles à venir */
  var aVenir = AGENDA
    .filter(function (e) { return e.date >= aujourdhui; })
    .sort(function (a, b) { return a.date < b.date ? -1 : 1; });

  aVenir.forEach(function (e) {
    var quand = new Date(e.date + 'T12:00:00');
    listeDates.appendChild(carte({
      entete: quand.toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long'
      }),
      badge: (e.date === aujourdhui)
        ? ' <span class="evenement__badge">ce soir !</span>'
        : '',
      titre: e.titre,
      horaire: e.horaire,
      details: e.details,
      insta: e.insta
    }));
  });

  // Pas de soirée ponctuelle : on masque ce bloc, les cartes
  // hebdomadaires restent
  if (!aVenir.length) {
    var titreDates = document.getElementById('actuTitreDates');
    if (titreDates) titreDates.remove();
    listeDates.remove();
  }

  // Plus rien du tout : on retire la section, son séparateur et l'onglet
  if (!aVenir.length && !RECURRENTS.length) {
    var chip = document.querySelector('.nav__chip[href="#actu"]');
    var sep = document.getElementById('sepActu');
    if (chip) chip.remove();
    if (sep) sep.remove();
    section.remove();
  }
})();
