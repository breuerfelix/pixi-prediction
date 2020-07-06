import ws from 'uWebSockets.js';
import {generateID} from 'lib';
import loop from './loop';
import pino from 'pino';
import entityManager from './ecs';

const logger = pino({ prettyPrint: true });

const enc = new TextDecoder('utf-8');
const HANDLERS = new Map<string, Map<string, Function>>();

HANDLERS['ping'] = {
  /* eslint-disable */
  default: (): void => { },
  /* eslint-enable */
};

HANDLERS['input'] = {
  up: (data: any): void => {
    //input.upListener(data.code);
  },
  down: (data: any): void => {
    //input.downListener(data.code);
  },
};

HANDLERS['sync'] = {
  default: ({ socketData }): void => {
    socketData.websocket
      .send(JSON.stringify({ type: 'sync', timestamp: loop.lastUpdate }));
  },
};

const app = ws.App();
app.ws('/*', {
  compression: 0,
  idleTimeout: 180,
  open: (ws, req) => {
    logger.info('open socket');

    const username = req.getQuery();

    const ID = generateID();
    const player = {
      ID,
      position: { x: 0, y: 0, z: 0 },
      socket: { ws },
    };

    entityManager.add(player);

    ws.data = {
      ID,
      username,
      websocket: ws,
    };
  },
  message: (ws, message) => {
    const data = JSON.parse(enc.decode(message));
    console.log('message', data);

    data.socketData = ws.data;
    const { type, action = 'default' } = data;
    HANDLERS[type][action](data);
  },
  drain: (ws) => {
    logger.info('drain WHAT IS THIS');
    logger.info(ws.getBufferedAmount().toString());
  },
  close: (ws) => {
    logger.info('close socket');

    entityManager.delete(ws.data.ID);
  },
  ping: () => {
    logger.info('got ping');
  },
  pong: () => {
    logger.info('got pong');
  },
});

app.any('/*', (res, req) => {
  // TODO use http for some stuff
  res.end('HTTP disabled');
});

app.listen(9001, listenSocket => {
  if (listenSocket) {
    logger.info('Listening on port 9001');
  }
});

export default app;
