import pino from 'pino';
import ws from 'uWebSockets.js';
import {Entity, input, BasePlayer} from 'shared';
import {Loop} from './loop';
import Vector from 'vector2d-extended';

const logger = pino({
  prettyPrint: true,
});

class Player extends BasePlayer {
  socket: ws.WebSocket;
  constructor(x: number, y: number, socket: ws.WebSocket) {
    super(x, y);
    this.socket = socket;

    const data = {
      id: this.id,
      type: 'player',
      action: 'create',
      x, y,
    };

    this.socket.send(JSON.stringify(data));
  }

  fixedUpdate(lastUpdate: number, delta: number): any {
    const newPos = this.playerController(lastUpdate, delta);
    return newPos;
  }
}

const HANDLERS = new Map<string, Map<string, Function>>();
let LOOP: Loop =  null;
let PLAYER: Player = null;

const enc = new TextDecoder('utf-8');

HANDLERS['ping'] = {
  /* eslint-disable */
  default: (): void => { },
  /* eslint-enable */
};

HANDLERS['input'] = {
  up: (data: any): void => {
    input.upListener(data.code);
  },
  down: (data: any): void => {
    input.downListener(data.code);
  },
};

HANDLERS['sync'] = {
  default: ({ socketData }): void => {
    socketData.websocket
      .send(JSON.stringify({ type: 'sync', timestamp: LOOP.lastUpdate }));
    PLAYER = new Player(50, 50, socketData.websocket);
  },
};

const app = ws.App();
app.ws('/*', {
  compression: 0,
  idleTimeout: 180,
  open: (ws, req) => {
    logger.info('open');
    const username = req.getQuery();
    ws.data = {
      username,
      websocket: ws,
    };

    ws.subscribe('/entitydata');
  },
  message: (ws, message) => {
    const data = JSON.parse(enc.decode(message));
    console.log('message', data);

    data.socketData = ws.data;
    const { type, action = 'default' } = data;
    HANDLERS[type][action](data);
  },
  drain: (ws) => {
    logger.info('drain');
    logger.info(ws.getBufferedAmount().toString());
  },
  close: (ws) => {
    logger.info('close');
    PLAYER.destruct();
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

  LOOP = new Loop(app);
});
