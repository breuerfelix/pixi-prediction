import loop from 'global/loop';
import entityManager from 'global/ecs';
import {eventSystem, Event} from 'global/event';

export class Socket {
  websocket: WebSocket;
  pingInterval: number;

  ping = 0;
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
        this.ping = 0;
        return;
      }

      this.ping = this.pingTimers.reduce((a, b) => a + b, 0) / this.pingTimers.length * 2;
      this.pingTimers = [];

      console.log('ping', this.ping);
    }, 3000);
  }

  close(): void {
    console.log('socket closed');
    clearInterval(this.pingInterval);
    this.ping = 0;
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
    }, 150 * 1000) as unknown as number;

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
  }
}

export const socket = new Socket();
export default socket;