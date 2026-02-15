import * as esbuild from 'esbuild';
import { rmSync, cpSync, mkdirSync, readFileSync, writeFileSync } from 'fs';

rmSync('dist', { force: true, recursive: true });

await esbuild.build({
  entryPoints: ['src/objects/AAObject.ts', 'src/objects/Scaffold.ts', 'src/objects/Owata.ts', 'src/objects/Bullet.ts', 'src/scenes/main.ts'],
  bundle: false,
  outdir: 'dist',
  format: 'iife',
  platform: 'browser',
  sourcemap: true,
  outExtension: { '.js': '.js' },
});

cpSync('static/index.html', 'dist/index.html');
cpSync('static/owata1.wav', 'dist/owata1.wav');

console.log('Build complete!');
