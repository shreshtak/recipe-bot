import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs/promises';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',  // Ensure the output is in the dist folder
    assetsDir: 'assets',  // Place all assets (JS, CSS, images) in the assets folder
    rollupOptions: {
      input: {
        main: 'index.html',  // Ensure index.html is the main entry point
      },
    },
  },
  esbuild: {
    loader: 'jsx',  // Enable JSX support for .js and .jsx files
    include: /src\/.*\.jsx?$/,  // Apply to both .js and .jsx files in the src folder
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: 'load-js-files-as-jsx',
          setup(build) {
            build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => ({
              loader: 'jsx',
              contents: await fs.readFile(args.path, 'utf8'),
            }));
          },
        },
      ],
    },
  },
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-macros'],
      },
    }),
  ],
});
