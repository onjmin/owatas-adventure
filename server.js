import { serveStatic } from 'hono/bun';
import { Hono } from 'hono';

const app = new Hono();

app.use('/*', serveStatic({ root: './' }));

export default {
  port: 3000,
  fetch: app.fetch,
};
