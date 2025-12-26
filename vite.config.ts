import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { readFileSync } from 'fs'

export default defineConfig({
	plugins: [sveltekit()],
  server: {
    https: {
      key: readFileSync('certs/localhost.key'),
      cert: readFileSync('certs/localhost.crt'),
    },
  }
});
