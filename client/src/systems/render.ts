import {eventSystem, Event} from 'global/event';
import {Entity} from 'global/ecs';
import engine from 'global/engine';
import {Mesh} from 'babylonjs';

export class RenderSystem {
  testmesh: Mesh;
  constructor() {
    eventSystem.on(Event.NewEntity, this.newEntity.bind(this));
  }

  newEntity(entity: Entity): void {
    if (entity.position) {
      const mesh = Mesh.CreateBox(entity.ID, 2, engine.scene);
      const { x, y, z } = entity.position;
      mesh.position.set(x, y, z);
      this.testmesh = mesh;

      entity.mesh = {
        mesh,
      };
    }
  }

  render(
    lastUpdate: number, delta: number, alpha: number,
  ): void {
    if (this.testmesh == null) return;
    const { x, y, z } = this.testmesh.position;
    this.testmesh.position.set(x + 0.01, y + 0.01, z + 0.01);
  }

}
