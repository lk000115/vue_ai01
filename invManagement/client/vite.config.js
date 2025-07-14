import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '192.168.1.190+3-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, '192.168.1.190+3.pem'))
    },
    host: '192.168.1.190',
    port: 443,
    proxy: {
      '/api': {
        target: 'http://192.168.1.190:3000',
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/inv/, ''),
        // configure: (proxy, options) => {
        //   proxy.on('proxyReq', (proxyReq, req, res) => {
        //     console.log('代理请求触发，目标路径:', proxyReq.path);
        //   });
        //   proxy.on('error', (err, req, res) => {
        //     console.error('代理出错:', err);
        //   });
        // }
      }
    }
  }
});