import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const src = fileURLToPath(new URL('../src/', import.meta.url));
// The harness renders stories straight from the source, so tests see what you just edited.
export default defineConfig({
  root: fileURLToPath(new URL('./harness/', import.meta.url)),
  plugins: [react()],
  resolve: { dedupe: ['react', 'react-dom'] },
  server: { fs: { allow: ['..', '../..'] }, port: 5199 },
  define: { __SRC__: JSON.stringify(src) },
});
