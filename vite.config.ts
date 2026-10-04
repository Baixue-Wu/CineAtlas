import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'distribute-licenses',
      generateBundle() {
        for (const [source, fileName] of [
          ['LICENSE', 'LICENSE.txt'],
          ['docs/LICENSE-upstream', 'LICENSE-upstream.txt'],
          ['THIRD_PARTY_NOTICES.md', 'THIRD_PARTY_NOTICES.txt'],
        ]) {
          this.emitFile({
            type: 'asset',
            fileName,
            source: readFileSync(new URL(source, import.meta.url), 'utf8'),
          });
        }
      },
    },
  ],
  base: './',
});
