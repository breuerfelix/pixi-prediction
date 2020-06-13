import Store from 'singletons/store';
import {Container, Graphics} from 'pixi.js';
import loop from 'global/loop';
import entityManager from 'global/ecs';
import {eventSystem, Event} from 'global/event';
//import {Player} from './player';

let ping = 0;

// TODO recent pings as ringbuffer
//window.addEventListener('keyup', e => input.upListener(e.code, ping / 2));
//window.addEventListener('keydown', e => input.downListener(e.code, ping / 2));

//let player: Player = null;
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
    //input.on('up', (code: string) => {
      //const data = { type: 'input', action: 'up', code };
      //this.send(data);
    //});

    //input.on('down', (code: string) => {
      //const data = { type: 'input', action: 'down', code };
      //this.send(data);
    //});

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

  message(message: any): void {
    const data = JSON.parse(message.data);
    //console.log('message received', data)

    if (data.type == 'sync') {
      loop.sync(data.timestamp);
    }

    if (data.type == 'ecs') {
      const entities = data.data;
      for (const ent of entities) {
        const entity = entityManager.entityMap.get(ent.ID);

        if (!entity) {
          entityManager.add(ent);
          eventSystem.emit(Event.NewEntity, ent);
        } else {
          for (const key of Object.keys(ent)) {
            entity[key] = ent[key];
          }
        }

      }
    }

    if (data.type == 'serverUpdate') {
      const ping = Date.now() - data.now;
      this.pingTimers.push(ping);

      //Entity.serverUpdate(data.lastUpdate, data.delta, data.data);
      loop.rollback(data.lastUpdate + data.delta);
    }
  }
}

function init(): void {
  const socket = new Socket();
}

export default init;
