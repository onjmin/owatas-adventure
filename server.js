import { serveStatic } from 'hono/bun';
import { Hono } from 'hono';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const app = new Hono();

app.get('/', () => {
  return new Response(readFileSync(join('./dist', 'index.html')), {
    headers: { 'Content-Type': 'text/html' },
  });
});

app.use('/*', serveStatic({ root: './dist/' }));

export default {
  port: 8080,
  fetch: app.fetch,
};
