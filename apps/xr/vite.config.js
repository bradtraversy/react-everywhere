import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // iwer ships its own three; without this the app loads two copies.
  resolve: { dedupe: ['three'] },
  // WebXR needs a secure context. localhost counts as secure; a headset on
  // the LAN does not, so use `npm run dev -- --host` behind https or a tunnel.
  server: { port: 5177, strictPort: true },
});
