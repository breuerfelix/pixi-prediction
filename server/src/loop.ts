import {Entity, BasicLoop} from 'shared';
import ws from 'uWebSockets.js';

export class Loop extends BasicLoop {
  websocket: ws.TemplatedApp;

  constructor(websocket: ws.TemplatedApp) {
    super();
    this.websocket = websocket;
    setTimeout(this.tick.bind(this));
  }

  fixedUpdate(lastUpdate: number, delta: number): void {
    // update all entity data
    const data = Entity.fixedUpdate(lastUpdate, delta);

    // gather entity data and send to the clients
    const networkData = {
      type: 'serverUpdate',
      lastUpdate,
      delta,
      data,
      now: Date.now(),
    };

    this.websocket.publish('/entitydata', JSON.stringify(networkData));
    // TODO clean input and clean timeline
  }

  alphaUpdate(
    lastUpdate: number, delta: number, alpha: number,
  ): void {
    setTimeout(this.tick.bind(this));
  }
}
