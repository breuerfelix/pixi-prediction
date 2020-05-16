interface KeyStatus {
  down: number;
  up?: number;
  fresh: boolean;
}

export class Input<T> {
  pressedKeys: Map<T, KeyStatus[]>;
  keycodeMap: Map<string, T>;
  disabled: boolean;

  boundDownListener: (event: KeyboardEvent) => void;
  boundUpListener: (event: KeyboardEvent) => void;

  constructor() {
    this.pressedKeys = new Map();
    this.keycodeMap = new Map();

    this.boundDownListener = this.downListener.bind(this);
    this.boundUpListener = this.upListener.bind(this);

    // activate via default
    this.disabled = false;
  }

  disable(): void {
    this.disabled = true;
    this.pressedKeys.clear();
  }

  enable(): void {
    this.disabled = false;
  }

  setKeybinding(keyCode: string, action: T): void {
    this.keycodeMap.set(keyCode, action);
  }

  subscribe(): void {
    window.addEventListener('keydown', this.boundDownListener);
    window.addEventListener('keyup', this.boundUpListener);
  }

  unsubscribe(): void {
    window.removeEventListener('keydown', this.boundDownListener);
    window.removeEventListener('keyup', this.boundUpListener);
  }

  downListener(event: KeyboardEvent): void {
    if (this.disabled) return;

    const code = event.code;
    if (!this.keycodeMap.has(code)) return;
    const action = this.keycodeMap.get(code);

    const history = this.pressedKeys.get(action) || [];

    // do not put another status if the last one is not finished
    if (
      history.length > 0 &&
      !history[history.length - 1].up
    ) return;

    const status: KeyStatus = {
      down: Date.now(),
      up: null,
      fresh: true,
    };

    this.pressedKeys.set(action, [...history, status]);
  }

  upListener(event: KeyboardEvent): void {
    if (this.disabled) return;

    const code = event.code;
    if (!this.keycodeMap.has(code)) return;
    const action = this.keycodeMap.get(code);

    const history = this.pressedKeys.get(action);
    const lastItem = history.pop();
    lastItem.up = Date.now();

    this.pressedKeys.set(action, [...history, lastItem]);
  }

  // IMPORTANT: has to be the LAST fixedUpdate call
  // TODO calculate NOW from timestamp and delta
  fixedUpdate(timestamp: number,): void {
    // clean up old key presses
    for (const [, history] of this.pressedKeys.entries()) {
      while (history.length > 0) {
        const firstItem = history[0];
        // earliest item is not even up again
        if (!firstItem.up) break;
        if (firstItem.up > timestamp) break;
        // up is smaller than timestamp
        // this event is already in the past
        history.shift();
      }

      // turning all fresh status to false
      for (const status of history) {
        // dont negotiate future events
        if (status.down > timestamp) break;
        if (!status.fresh) continue;
        status.fresh = false;
      }
    }
  }

  isPressed(timestamp: number, action: T, fresh = false): boolean {
    const history = this.pressedKeys.get(action);
    if (!history || !history.length) return false;

    for (const status of history) {
      // event is in the future
      if (status.down > timestamp) return false;

      // fire if the event is fresh event tho its too early
      if (status.fresh) return true;

      // the event is in the past, search next one
      if (status.up && timestamp > status.up) continue;

      // return if event is not fresh
      if (fresh && !status.fresh) return false;

      // lesser or equal to up
      // greater than down
      return true;
    }

    return false;
  }

  // return true only ONE time until release key
  gotPressed(timestamp: number, action: T): boolean {
    return this.isPressed(timestamp, action, true);
  }
}

export enum Action {
  moveUp,
  moveDown,
  moveRight,
  moveLeft,
}

export const input = new Input<Action>();

// default keybindings
input.setKeybinding('ArrowUp', Action.moveUp);
input.setKeybinding('KeyW', Action.moveUp);
input.setKeybinding('ArrowDown', Action.moveDown);
input.setKeybinding('KeyS', Action.moveDown);
input.setKeybinding('ArrowRight', Action.moveRight);
input.setKeybinding('KeyD', Action.moveRight);
input.setKeybinding('ArrowLeft', Action.moveLeft);
input.setKeybinding('KeyA', Action.moveLeft);

export default input;
