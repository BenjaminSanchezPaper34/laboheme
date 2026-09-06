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
        annulations : (optionnel) dates où la séance N'A PAS lieu,
                  ex : ['2026-08-31'] — la carte reste affichée avec
                  la mention « pas de séance le … » ; le jour même,
                  badge « annulé aujourd'hui ». Les dates passées
                  sont ignorées automatiquement.
        titre / horaire / details / insta : comme ci-dessous

   2) AGENDA — les soirées ponctuelles (une date précise).
        date    : au format 'AAAA-MM-JJ'
                  — ou omise/vide : la carte affiche « Prochainement »,
                  reste visible jusqu'à ce qu'on lui donne une date
                  (ou qu'on la supprime), et se place après les datées
        titre   : le nom de la soirée
        horaire : texte libre ('21h — 1h', 'dès 21h'…)
        details : (optionnel) happy hour, infos pratiques…
        alaune  : (optionnel) true = carte mise en avant (fond teal,
                  badge « à ne pas manquer ») pour un temps fort
        insta   : (optionnel) handle Insta de l'artiste, SANS le @
                  ex : 'teusofficial' → lien cliquable @teusofficial
        lien    : (optionnel) lien externe quelconque, sous la forme
                  { url: 'https://…', texte: 'Texte affiché' }

   Le système fait le reste :
   • les soirées ponctuelles passées disparaissent toutes seules
   • badge « ce soir ! » / « c'est aujourd'hui ! » le jour même
   • s'il n'y a plus rien du tout, la section et son onglet
     se masquent entièrement
   ═══════════════════════════════════════════════════════════ */

/* ─── 1) Chaque semaine, tout l'été ──────────────────────── */
/* Vide depuis le 6 septembre 2026 (fin de saison) : les après-midi
   festifs du lundi (Zone V) et du vendredi (Uma) sont terminés.
   À la réouverture, remettre les cartes sur ce modèle :

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
*/
var RECURRENTS = [];

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
  {
    date: '2026-09-12',
    alaune: true,
    titre: 'Closing Party',
    horaire: 'à partir de 19h',
    details: 'La soirée de clôture de la saison, avec <strong>DJ Uma</strong> aux platines. <strong>Un cocktail offert</strong> à chacun, et la <strong>piscine accessible en soirée</strong> pour ceux qui le souhaitent. Côté restauration : planche de charcuterie et planche de tapas uniquement.',
    insta: 'uma.dj'
  }
];

/* ─── 3) Fin de saison ───────────────────────────────────────
   À partir de la date ci-dessous, le site bascule TOUT SEUL en
   mode hors-saison : message de clôture à la place de l'agenda,
   pastilles du hero remplacées. La carte reste consultable.
   Pour rouvrir la saison : remettre date à '' (ou la date de
   réouverture) et remettre à jour RECURRENTS / AGENDA.
   ─────────────────────────────────────────────────────────── */
var FIN_DE_SAISON = {
  date: '2026-09-13',
  pastille: 'Saison terminée — merci à tous !',
  titre: 'À l\'année prochaine',
  message: 'La saison est terminée à La Bohème. Merci à toutes celles et ceux qui sont passés cet été — on remet le sable, les transats et les cocktails en place au printemps prochain. Suivez-nous sur Instagram pour ne rien manquer de la réouverture.'
};

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

  /* ─── Mode hors-saison ─── */
  if (FIN_DE_SAISON.date && aujourdhui >= FIN_DE_SAISON.date) {
    document.documentElement.classList.add('hors-saison');

    // Le hero n'annonce plus qu'une chose : la saison est finie
    var infos = document.querySelector('.hero__infos');
    if (infos) {
      infos.innerHTML = '<span class="pill pill--fort">✳ ' +
        FIN_DE_SAISON.pastille + '</span>';
    }

    // L'Actu devient le mot de clôture
    var note = section.querySelector('.section__note');
    if (note) note.remove();
    var titreRec = listeRec.previousElementSibling;
    if (titreRec) titreRec.remove();
    var titreDates = document.getElementById('actuTitreDates');
    if (titreDates) titreDates.remove();
    listeDates.remove();

    var mot = document.createElement('li');
    mot.className = 'evenement evenement--alaune reveal';
    mot.innerHTML =
      '<h3 class="evenement__titre">' + FIN_DE_SAISON.titre + '</h3>' +
      '<p class="evenement__details">' + FIN_DE_SAISON.message + '</p>' +
      '<a class="evenement__insta" href="https://www.instagram.com/laboheme.capdagde/" ' +
      'target="_blank" rel="noopener">' + svgInsta + '@laboheme.capdagde</a>';
    listeRec.appendChild(mot);
    return;
  }

  function lienInsta(handle) {
    if (!handle) return '';
    return '<a class="evenement__insta" ' +
      'href="https://www.instagram.com/' + handle + '/" ' +
      'target="_blank" rel="noopener">' + svgInsta + '@' + handle + '</a>';
  }

  // Icône lien externe (pour les liens Facebook, sites, etc.)
  var svgLien = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
    'stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>' +
    '<polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

  function lienExterne(lien) {
    if (!lien || !lien.url) return '';
    return '<a class="evenement__insta" href="' + lien.url + '" ' +
      'target="_blank" rel="noopener">' + svgLien + (lien.texte || 'En savoir plus') + '</a>';
  }

  function carte(opts) {
    var li = document.createElement('li');
    li.className = 'evenement reveal' +
      (opts.recurrent ? ' evenement--recurrent' : '') +
      (opts.alaune ? ' evenement--alaune' : '');
    li.innerHTML =
      '<p class="evenement__date">' + opts.entete + opts.badge + '</p>' +
      '<h3 class="evenement__titre">' + opts.titre + '</h3>' +
      '<p class="evenement__horaire">' + opts.horaire + '</p>' +
      (opts.details ? '<p class="evenement__details">' + opts.details + '</p>' : '') +
      lienInsta(opts.insta) +
      lienExterne(opts.lien);
    return li;
  }

  // Date lisible en français : « lundi 31 août »
  function dateFr(iso) {
    return new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long'
    });
  }

  /* Rendez-vous hebdomadaires — le bloc se masque s'il est vide */
  if (!RECURRENTS.length) {
    var titreRecVide = listeRec.previousElementSibling;
    if (titreRecVide) titreRecVide.remove();
    listeRec.remove();
  }
  RECURRENTS.forEach(function (e) {
    // On ne garde que les annulations d'aujourd'hui et à venir
    var annulations = (e.annulations || [])
      .filter(function (date) { return date >= aujourdhui; })
      .sort();

    var annuleAujourdhui = annulations.indexOf(aujourdhui) !== -1;
    var aVenir = annulations.filter(function (date) { return date !== aujourdhui; });

    var badge = '';
    if (annuleAujourdhui) {
      badge = ' <span class="evenement__badge evenement__badge--annule">annulé aujourd\'hui</span>';
    } else if (e.jourNum === jourSemaine) {
      badge = ' <span class="evenement__badge">c\'est aujourd\'hui !</span>';
    }

    // Mention des séances annulées, sous les détails
    var details = e.details || '';
    if (annuleAujourdhui) {
      details += '<span class="evenement__annule">Séance annulée aujourd\'hui (météo)</span>';
    }
    if (aVenir.length) {
      details += '<span class="evenement__annule">Pas de séance le ' +
        aVenir.map(dateFr).join(', le ') + '</span>';
    }

    listeRec.appendChild(carte({
      recurrent: true,
      entete: 'Chaque ' + e.jour.toLowerCase(),
      badge: badge,
      titre: e.titre,
      horaire: e.horaire,
      details: details,
      insta: e.insta,
      lien: e.lien
    }));
  });

  /* Soirées ponctuelles — les datées à venir, puis les « Prochainement » */
  var aVenir = AGENDA
    .filter(function (e) { return !e.date || e.date >= aujourdhui; })
    .sort(function (a, b) {
      if (!a.date) return 1;   // sans date : en fin de liste
      if (!b.date) return -1;
      return a.date < b.date ? -1 : 1;
    });

  aVenir.forEach(function (e) {
    listeDates.appendChild(carte({
      entete: e.date ? dateFr(e.date) : 'Prochainement',
      badge: (e.date === aujourdhui)
        ? ' <span class="evenement__badge">ce soir !</span>'
        : (e.alaune ? ' <span class="evenement__badge">à ne pas manquer</span>' : ''),
      alaune: e.alaune,
      titre: e.titre,
      horaire: e.horaire,
      details: e.details,
      insta: e.insta,
      lien: e.lien
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
