import entityManager from '../global/ecs';
import socket from '../global/socket';

export class NetworkSystem {
  fixedUpdate(lastUpdate: number, delta: number): void {
    const data = {
      type: 'ecs',
      action: 'update',
      data: entityManager.entities,
    };

    socket.publish('/ecs', JSON.stringify(data));
  }
}
