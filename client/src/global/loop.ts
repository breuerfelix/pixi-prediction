import Store from 'singletons/store';
import {BasicLoop} from 'lib';
import Stats from 'stats.js';
import {Container} from 'pixi.js';
import entityManager from 'global/ecs';
import {RenderSystem} from 'systems/render';

const STAGE = new Container();

class Loop extends BasicLoop {
  fps = new Stats();
  ms = new Stats();

  renderSystem: RenderSystem;

  constructor() {
    super();
    this.renderSystem = new RenderSystem();

    // setup monitoring
    this.fps.showPanel(0);
    this.ms.showPanel(1);

    document.body.appendChild(this.fps.dom);
    //document.body.appendChild(this.ms.dom);

    requestAnimationFrame(this.tick.bind(this));
  }

  fixedUpdate(lastUpdate: number, delta: number): void {
    this.ms.begin();
    //Entity.fixedUpdate(lastUpdate, delta);
    //console.log(entityManager.entities);
    this.ms.end();
  }

  alphaUpdate(
    lastUpdate: number, delta: number, alpha: number,
  ): void {
    this.fps.update();

    // systems
    this.renderSystem.render(lastUpdate, delta, alpha);

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

export const loop = new Loop();
export default loop;
