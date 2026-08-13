/* ═══════════════════════════════════════════════════════════
   LA BOHÈME — Récupération automatique des avis Google
   ───────────────────────────────────────────────────────────
   Fonction serverless Vercel : interroge l'API officielle
   Google Places (Place Details) côté serveur, filtre les avis
   4-5 étoiles et renvoie le tout au site.

   Nécessite la variable d'environnement GOOGLE_PLACES_KEY
   (Vercel → Settings → Environment Variables).
   Sans clé, renvoie { ok: false } et le site masque simplement
   le carrousel — aucune erreur visible.

   Le cache CDN (6 h) fait qu'on n'appelle Google que ~4 fois
   par jour, quel que soit le trafic : gratuit à vie.
   ═══════════════════════════════════════════════════════════ */

const PLACE_ID = 'ChIJk0Vyo1QjsRIRF0AlzDlZqn4'; // fiche La Bohème - Cap d'Agde

export default async function handler(req, res) {
  const cle = process.env.GOOGLE_PLACES_KEY;

  // Cache CDN : 6 h de fraîcheur, 24 h de tolérance
  res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400');

  if (!cle) {
    return res.status(200).json({ ok: false, raison: 'cle absente' });
  }

  try {
    const reponse = await fetch(
      'https://places.googleapis.com/v1/places/' + PLACE_ID +
      '?fields=rating,userRatingCount,reviews&languageCode=fr',
      { headers: { 'X-Goog-Api-Key': cle } }
    );

    if (!reponse.ok) {
      return res.status(200).json({ ok: false, raison: 'api ' + reponse.status });
    }

    const donnees = await reponse.json();

    // On ne garde que les avis 4 et 5 étoiles, avec du texte
    const avis = (donnees.reviews || [])
      .filter(function (a) { return a.rating >= 4 && a.text && a.text.text; })
      .map(function (a) {
        return {
          etoiles: a.rating,
          texte: a.text.text,
          auteur: (a.authorAttribution && a.authorAttribution.displayName) || 'Client Google',
          date: a.relativePublishTimeDescription || ''
        };
      });

    return res.status(200).json({
      ok: true,
      note: donnees.rating || null,
      total: donnees.userRatingCount || null,
      avis: avis
    });
  } catch (e) {
    return res.status(200).json({ ok: false, raison: 'erreur reseau' });
  }
}
