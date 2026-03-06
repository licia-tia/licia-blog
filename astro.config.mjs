// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	output: 'static',
	site: 'https://licia-tia.github.io',
	base: '/licia-blog',
	integrations: [mdx(), sitemap()],
});
