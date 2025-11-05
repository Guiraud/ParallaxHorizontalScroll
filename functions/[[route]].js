// Cloudflare Pages Function pour le routing dynamique
// Charge dynamiquement le fichier JSON en fonction de l'URL
// Ex: p.newsforge.app/grossophobie -> charge grossophobie.json

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Extraire le nom du theme depuis l'URL (ex: /grossophobie)
  const pathParts = url.pathname.split('/').filter(p => p);
  const themeName = pathParts[0] || 'grossophobie'; // Par défaut: grossophobie

  // Si c'est une requête pour un fichier statique, laisser passer
  if (themeName.includes('.')) {
    return context.next();
  }

  // Charger le fichier JSON correspondant
  const jsonFileName = `${themeName}.json`;

  try {
    // Récupérer le fichier JSON depuis le même domaine
    const jsonUrl = new URL(`/${jsonFileName}`, url.origin);
    const jsonResponse = await fetch(jsonUrl.toString());

    if (!jsonResponse.ok) {
      return new Response(`Theme "${themeName}" not found. Available themes: grossophobie, consentement`, {
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    const jsonData = await jsonResponse.json();

    // Charger le template HTML
    const htmlUrl = new URL('/template.html', url.origin);
    const htmlResponse = await fetch(htmlUrl.toString());
    let html = await htmlResponse.text();

    // Injecter les données JSON dans le HTML
    html = html.replace(
      '</head>',
      `<script>window.THEME_NAME = "${themeName}"; window.THEME_DATA = ${JSON.stringify(jsonData)};</script></head>`
    );

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (error) {
    return new Response(`Error loading theme: ${error.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
