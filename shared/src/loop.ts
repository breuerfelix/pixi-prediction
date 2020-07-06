abstract class BasicLoop {
  delta: number;
  accumulator = 0;
  maxLag = 10000;

  lastLoop: number;
  lastUpdate: number;

  constructor(hz = 20) {
    const now = Date.now();
    this.lastLoop = now;
    this.lastUpdate = now;

    this.delta = 1000 / hz;
  }

  abstract fixedUpdate(lastUpdate: number, delta: number): void;
  abstract alphaUpdate(
    lastUpdate: number, delta: number, alpha: number,
  ): void;

  tick(): void {
    const now = Date.now();
    let frameTime = now - this.lastLoop;

    // reset when idle time is too long
    if (frameTime > this.maxLag) {
      this.lastUpdate = this.lastUpdate +
        Math.floor((now - this.lastUpdate) / this.delta) * this.delta;

      frameTime = now - this.lastUpdate;
      this.accumulator = 0;
    }

    this.accumulator += frameTime;
    this.lastLoop = now;

    while (this.accumulator >= this.delta) {
      this.fixedUpdate(this.lastUpdate, this.delta);

      this.lastUpdate += this.delta;
      this.accumulator -= this.delta;
    }

    this.alphaUpdate(
      this.lastUpdate - this.delta, this.delta, this.accumulator / this.delta,
    );
  }

  sync(otherTickTime: number): void {
    // sync fixupdate loop with another one
    // TODO could be done cleaner but it works
    this.accumulator = 0;
    this.lastUpdate = otherTickTime;
    this.lastLoop = otherTickTime;
  }
}

export default BasicLoop;
