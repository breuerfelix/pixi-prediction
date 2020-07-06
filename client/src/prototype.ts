import Store from 'singletons/store';
import {Container, Graphics} from 'pixi.js';
import {input} from 'shared';
import {BasicLoop, Entity} from 'shared';
import {Player} from './player';
import Vector from 'vector2d-extended';

let LOOP: Loop =  null;
const STAGE = new Container();
let ping = 0;

window.addEventListener('keyup', e => input.upListener(e.code, ping / 2));
window.addEventListener('keydown', e => input.downListener(e.code, ping / 2));

class Loop extends BasicLoop {
  constructor() {
    super();
    requestAnimationFrame(this.tick.bind(this));
  }

  fixedUpdate(lastUpdate: number, delta: number): void {
    Entity.fixedUpdate(lastUpdate, delta);
  }

  alphaUpdate(
    lastUpdate: number, delta: number, alpha: number,
  ): void {
    Entity.alphaUpdate(lastUpdate, delta, alpha);
    Store.renderer.render(STAGE);
    requestAnimationFrame(this.tick.bind(this));
  }

  rollback(timestamp: number): void {
    // return if the server timestamp is ahead
    if (timestamp >= this.lastUpdate) return;

    this.lastUpdate = timestamp;
    this.lastLoop = timestamp;
    this.accumulator = 0;
    // TODO clean input after timestamp
    // TODO clean timelines after timestamp
  }
}

let player: Player = null;
class Socket {
  websocket: WebSocket;
  pingInterval: number;

  pingTimers: number[];

  constructor() {
    const username = 'player1';
    this.pingTimers = [];

    this.websocket = new WebSocket(`ws://localhost:9001/?${username}`);

    this.websocket.onmessage = this.message.bind(this);
    this.websocket.onclose = this.close.bind(this);
    this.websocket.onopen = this.open.bind(this);

    // TODO
    // some sort of clean correction from client -- maybe use the ping as indicator ?
    input.on('up', (code: string) => {
      const data = { type: 'input', action: 'up', code };
      this.send(data);
    });

    input.on('down', (code: string) => {
      const data = { type: 'input', action: 'down', code };
      this.send(data);
    });

    setInterval(() => {
      if (this.pingTimers.length < 1) {
        ping = 0;
        return;
      }

      ping = this.pingTimers.reduce((a, b) => a + b, 0) / this.pingTimers.length * 2;
      this.pingTimers = [];

      console.log('ping', ping);
    }, 3000);
  }

  close(): void {
    console.log('socket closed');
    clearInterval(this.pingInterval);
    ping = 0;
    this.pingTimers = [];
  }

  send(obj): void {
    if (this.websocket.readyState != this.websocket.OPEN) {
      console.log('not open', this.websocket.readyState);
      return;
    }

    // TODO use flatbuffers
    this.websocket.send(JSON.stringify(obj));
  }

  open(): void {
    console.log('socket opened');
    this.pingInterval = setInterval(() => {
      this.send({ type:'ping' });
    }, 150 * 1000);

    const sync = {
      type: 'sync',
    };

    this.send(sync);
  }

  message(message): void {
    const data = JSON.parse(message.data);
    if (data.type == 'sync') {
      LOOP.sync(data.timestamp);

      //const player = new Player(50, 50);
      //STAGE.addChild(player.sprite);
    }

    if (data.type == 'serverUpdate') {
      const ping = Date.now() - data.now;
      this.pingTimers.push(ping);

      Entity.serverUpdate(data.lastUpdate, data.delta, data.data);
      LOOP.rollback(data.lastUpdate + data.delta);
    }

    if (data.type == 'player') {
      if (data.action == 'create') {
        player = new Player(data.x, data.y, data.id);
        STAGE.addChild(player.sprite);
      }
    }
  }
}

function init(): void {
  LOOP = new Loop();
  const socket = new Socket();
}

export default init;
