import tailwindcss from '@tailwindcss/postcss';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  base: '/shiheng-industry-product-research/',
  resolve: { alias: { '@': path.resolve(import.meta.dirname) } },
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [react()],
});
