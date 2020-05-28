import EventSystem from './event-system';

interface KeyStatus {
  down: number;
  up?: number;
}

export class Input<T> extends EventSystem<string> {
  pressedKeys = new Map<T, KeyStatus[]>();
  keycodeMap = new Map<string, T>();

  setKeybinding(keyCode: string, action: T): void {
    this.keycodeMap.set(keyCode, action);
  }

  downListener(code: string, delay = 0): void {
    if (!this.keycodeMap.has(code)) return;
    const action = this.keycodeMap.get(code);

    const history = this.pressedKeys.get(action) || [];

    // do not put another status if the last one is not finished
    if (
      history.length > 0 &&
      !history[history.length - 1].up
    ) return;

    const status: KeyStatus = {
      down: Date.now() + delay,
      up: null,
    };

    this.pressedKeys.set(action, [...history, status]);
    this.emit('down', code);
  }

  upListener(code: string, delay = 0): void {
    if (!this.keycodeMap.has(code)) return;
    const action = this.keycodeMap.get(code);

    const history = this.pressedKeys.get(action);
    const lastItem = history.pop();
    lastItem.up = Date.now() + delay;

    this.pressedKeys.set(action, [...history, lastItem]);
    this.emit('up', code);
  }

  fixedUpdate(lastUpdate: number, delta: number): void {
    // clean up old key presses which are older than now
    const now = lastUpdate + delta;
    for (const [, history] of this.pressedKeys.entries()) {
      while (history.length > 0) {
        const firstItem = history[0];
        // earliest item is not even up again
        if (!firstItem.up) break;
        if (firstItem.up >= now) break;
        // up is smaller than timestamp
        // this event is already in the past
        history.shift();
      }
    }
  }

  isPressed(timestamp: number, action: T): boolean {
    const history = this.pressedKeys.get(action);
    if (!history || !history.length) return false;

    for (const status of history) {
      // event is in the future
      if (status.down > timestamp) return false;

      // the event is in the past, search next one
      if (status.up && timestamp > status.up) continue;

      // lesser or equal to up
      // greater than down
      return true;
    }

    return false;
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
