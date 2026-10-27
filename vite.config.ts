import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from 'vite-plugin-sitemap';
import {DEFAULT_ORIGIN} from './src/components/site/seo';
import pages from './src/data/seo-pages.json';
export default defineConfig({plugins:[react(),tailwindcss(),sitemap({hostname:DEFAULT_ORIGIN,dynamicRoutes:['/','/freelance-calculator','/ecom-calculator','/directory','/about','/contact','/privacy-policy','/terms-of-service',...pages.map(p=>p.path)]})]});
