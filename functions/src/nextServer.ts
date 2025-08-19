import * as functions from 'firebase-functions';
import next from 'next';

const dev = false;
const app = next({ dev, conf: { distDir: 'gettiks-web/.next' } as any });
const handle = app.getRequestHandler();

export const nextServer = functions.https.onRequest(async (req, res) => {
  await app.prepare();
  return handle(req, res);
});

