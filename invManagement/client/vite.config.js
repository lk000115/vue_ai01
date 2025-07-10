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
      }
    },
    port: '443',
    host:'127.0.0.1',
})
