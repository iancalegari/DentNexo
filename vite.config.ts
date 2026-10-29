import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { spawn, ChildProcess } from 'child_process';
import http from 'http';

/**
 * Inicia automaticamente o motor local Kokoro TTS (server_kokoro.py na porta 5005)
 * exclusivamente em ambiente de desenvolvimento (`npm run dev`).
 * Em `vite build` (ex: Netlify CI), este plugin é ignorado (`apply: 'serve'`).
 */
function kokoroAutoStartPlugin(): Plugin {
  let kokoroProc: ChildProcess | null = null;

  return {
    name: 'dentnexo-kokoro-autostart',
    apply: 'serve',
    configureServer(server) {
      const req = http.get('http://127.0.0.1:5005/health', { timeout: 800 }, (res) => {
        res.resume();
      });

      req.on('error', () => {
        const scriptPath = path.resolve(__dirname, 'server_kokoro.py');
        kokoroProc = spawn('python', [scriptPath], {
          cwd: __dirname,
          stdio: 'inherit',
          windowsHide: true,
        });
        kokoroProc.on('error', (err) => {
          console.warn('[Kokoro TTS] Não foi possível iniciar automaticamente server_kokoro.py:', err.message);
        });
      });

      server.httpServer?.once('close', () => {
        if (kokoroProc && !kokoroProc.killed) {
          kokoroProc.kill();
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), kokoroAutoStartPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) {
            return 'vendor-three';
          }
          if (id.includes('node_modules/@mui') || id.includes('node_modules/@emotion')) {
            return 'vendor-mui';
          }
          if (id.includes('node_modules/jspdf') || id.includes('node_modules/html2canvas')) {
            return 'vendor-pdf';
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api/tts': {
        target: 'http://127.0.0.1:5005',
        changeOrigin: true,
      },
    },
  },
});
