/*
import Vector from 'vector2d-extended';
import Entity from './entity';
import {input, Action} from './input';
import {TimelineData} from './timeline';

export interface Position {
  posVec: Vector;
  destVec: Vector;
}

export abstract class BasePlayer extends Entity {
  speed = 20;
  positions = new TimelineData<Position>();

  constructor(
    x: number, y: number, id: string = null,
  ) {
    super(id);

    const data = {
      posVec: new Vector(x, y),
      destVec: new Vector(0, 0),
    };

    this.positions.set(1, data);
  }

  playerController(
    lastUpdate: number, delta: number,
  ): { position: Position } {
    const now = lastUpdate + delta;

    const lastPos = this.positions.get(lastUpdate);
    const posVec = Vector.add(lastPos.posVec, lastPos.destVec);
    const destVec = new Vector(0, 0);

    if (input.isPressed(now, Action.moveUp)) {
      destVec.add(new Vector(0, -1));
    }

    if (input.isPressed(now, Action.moveDown)) {
      destVec.add(new Vector(0, 1));
    }

    if (input.isPressed(now, Action.moveRight)) {
      destVec.add(new Vector(1, 0));
    }

    if (input.isPressed(now, Action.moveLeft)) {
      destVec.add(new Vector(-1, 0));
    }

    if (destVec.x != 0 || destVec.y != 0) {
      destVec.magnitude = this.speed;
    }

    const position = { posVec, destVec, };
    this.positions.set(now, position);

    return { position };
  }
}
*/
