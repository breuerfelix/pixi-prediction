import Store from 'singletons/store';
import {Container, Graphics} from 'pixi.js';
import {input, Action} from 'singletons/input';
import Vector from 'vector2d-extended';

class State {
  entities: any[];

  constructor() {
    this.entities = [];
  }

  fixUpdate(lastUpdate: number, delta: number): void {
    for (const ent of this.entities) {
      ent.fixUpdate(lastUpdate, delta);
    }
  }

  postFixUpdate(lastUpdate: number, delta: number): void {
    for (const ent of this.entities) {
      ent.postFixUpdate(lastUpdate, delta);
    }
  }

  renderUpdate(alpha: number): void {
    for (const ent of this.entities) {
      ent.renderUpdate(alpha);
    }
  }
}

class Player {
  sprite: Graphics;
  speed: number;

  posVec: Vector;
  destVec: Vector;

  constructor() {
    this.speed = 25;

    this.sprite = new Graphics();
    this.sprite
      .beginFill(0xDE3249)
      .drawRect(50, 50, 100, 100)
      .endFill();

    this.posVec = new Vector(50, 50);
    this.destVec = new Vector(0, 0);
  }

  fixUpdate(lastUpdate: number, delta: number): void {
    const now = lastUpdate + delta;
    this.posVec.add(this.destVec);
    this.destVec = new Vector(0, 0);

    if (input.isPressed(now, Action.moveUp)) {
      this.destVec.add(new Vector(0, -1));
    }

    if (input.isPressed(now, Action.moveDown)) {
      this.destVec.add(new Vector(0, 1));
    }

    if (input.isPressed(now, Action.moveRight)) {
      this.destVec.add(new Vector(1, 0));
    }

    if (input.isPressed(now, Action.moveLeft)) {
      this.destVec.add(new Vector(-1, 0));
    }

    //this.destVec.magnitude = this.speed;
    if (this.destVec.x == 0 && this.destVec.y == 0) return;

    this.destVec.magnitude = this.speed;
  }

  postFixUpdate(lastUpdate: number, delta: number): void { }

  renderUpdate(alpha: number): void {
    // TODO calculate with vectors here
    // last x + alpha * vektor = destination
    //const x = this.currentX * alpha + this.lastX * (1 - alpha);
    //const y = this.currentY * alpha + this.lastY * (1 - alpha);
    //
    const stepVec = Vector.add(this.posVec, Vector.multiply(this.destVec, alpha));
    this.sprite.position.set(stepVec.x, stepVec.y);
  }

}

class Prototype {
  dt: number;
  acc: number;

  lastRenderUpdate: number;
  lastFixUpdate: number;

  state: State;

  constructor() {
    const container = new Container();
    Store.changeScene(container);

    this.lastRenderUpdate = Date.now();
    this.lastFixUpdate = Date.now();
    this.acc = 0;
    const hz = 15;
    this.dt = 1 / hz * 1000; // 15hz


    this.state = new State();

    const player = new Player();
    this.state.entities.push(player);

    container.addChild(player.sprite);

    Store.ticker.add(this.fixed.bind(this));
  }

  fixed(): void {
    const now = Date.now();
    const frameTime = now - this.lastRenderUpdate;
    this.lastRenderUpdate = now;

    this.acc += frameTime;

    while (this.acc >= this.dt) {
      this.state.fixUpdate(this.lastFixUpdate, this.dt);
      this.state.postFixUpdate(this.lastFixUpdate, this.dt);

      // TODO remove this
      input.fixedUpdate(this.lastFixUpdate + this.dt);

      this.lastFixUpdate += this.dt;
      this.acc -= this.dt;
    }

    const alpha = this.acc / this.dt;
    this.state.renderUpdate(alpha);

    Store.renderer.render(Store.activeScene);
  }
}

function init() {
  const proto = new Prototype();
}

export default init;
