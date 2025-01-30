import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';

export default defineConfig({
    plugins: [vue()],
    server: {
        port: 3008, // or any port you prefer
    },
    optimizeDeps: {
        include: ['vue', 'vuetify'],
    }
});
