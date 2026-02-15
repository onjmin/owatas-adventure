import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/scenes/main.ts'],
  bundle: true,
  outfile: 'public/main.js',
  format: 'iife',
  platform: 'browser',
  globalName: 'phina',
  define: {
    'phina.globalize': 'true',
  },
  external: [],
  sourcemap: true,
});

console.log('Build complete!');
