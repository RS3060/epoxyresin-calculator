// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://epoxyresin-calculator.com',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'de', 'fr', 'id', 'it', 'pt', 'pl', 'ru', 'bg'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  build: {
    inlineStylesheets: 'always'
  },
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404') && !page.includes('/500')
    })
  ]
});