import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Lets us `import shader from './x.glsl'` and receive the source as a string.
    // Also supports #include directives for sharing GLSL chunks.
    glsl({
      include: ['**/*.glsl', '**/*.vert', '**/*.frag'],
      warnDuplicatedImports: true,
    }),
  ],
  server: {
    port: 5173,
    open: true,
  },
});
