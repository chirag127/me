import type { APIRoute } from 'astro';

const pages = [
  '/',
  '/me',
  '/me/story',
  '/me/philosophy',
  '/me/journal',
  '/me/interests',
  '/me/gear',
  '/me/finance',
  '/work',
  '/work/career',
  '/work/skills',
  '/work/projects',
  '/work/education',
  '/work/certifications',
  '/code',
  '/code/repos',
  '/code/npm',
  '/code/stackoverflow',
  '/code/holopin',
  '/library',
  '/library/movies',
  '/library/movies-watched',
  '/library/movies-rated',
  '/library/movies-watchlist',
  '/library/anime',
  '/library/anime-completed',
  '/library/anime-plan-to-watch',
  '/library/manga',
  '/library/books',
  '/library/books-read',
  '/library/books-want-to-read',
  '/library/music',
  '/library/music-top-artists',
  '/library/music-top-tracks',
  '/library/music-recent',
  '/library/mixcloud',
  '/library/videos',
  '/gaming',
  '/connect',
  '/connect/contact',
  '/connect/mastodon',
  '/connect/reddit',
  '/connect/bluesky',
  '/connect/hackernews',
  '/connect/pixelfed',
  '/system',
  '/system/changelog',
  '/system/admin',
];

export const GET: APIRoute = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>https://me.oriz.in${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '/' ? '1.0' : page.split('/').length === 2 ? '0.8' : '0.6'}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
