import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Use the base domain without /api since we keep the path
  const target = 'https://adminecommerce.waapcoders.in';
  
  return {
    plugins: [
      react(),
      tailwindcss()
    ],
    server: {
      proxy: {
        '/api': {
          target: target,
          changeOrigin: true,
          secure: false, // Disable SSL verification
          timeout: 60000, // 60 second timeout
          proxyTimeout: 60000, // 60 second proxy timeout
          // Keep the /api path instead of rewriting
          rewrite: (path) => path,
          configure: (proxy, _options) => {
            proxy.on('error', (err, req, _res) => {
              // console.error('[Proxy Error]', req.method, req.url, ':', err.message);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              // console.log('[Proxy Request]', req.method, req.url, '->', `${target}${req.url}`);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              // console.log('[Proxy Response]', req.method, req.url, '->', proxyRes.statusCode);
            });
          },
        },
      },
    },
  };
});