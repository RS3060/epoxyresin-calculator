import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = site ? new URL('sitemap-index.xml', site).href : 'https://epoxyresin-calculator.com/sitemap-index.xml';
  
  const content = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
