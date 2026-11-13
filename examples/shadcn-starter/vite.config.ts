import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // shadcn/ui 의 기본 경로 별칭(@/components/ui/…)
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
});
