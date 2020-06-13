import Store from 'singletons/store';
import {Container} from 'pixi.js';
import {eventSystem, Event} from 'global/event';
import {Entity} from 'global/ecs';
import {Graphics} from 'pixi.js';

export class RenderSystem {
  scene: Container;

  constructor() {
    this.scene = new Container();

    eventSystem.on(Event.NewEntity, this.newEntity.bind(this));
  }

  newEntity(entity: Entity): void {
    if (entity.position) {
      const sprite = new Graphics();
      sprite
        .beginFill(0xDE3249)
        .drawRect(entity.position.x, entity.position.y, 100, 100)
        .endFill();

      this.scene.addChild(sprite);
      entity.asset = {
        sprite,
      };

    }
  }

  render(
    lastUpdate: number, delta: number, alpha: number,
  ): void {
    Store.renderer.render(this.scene);
  }

}
