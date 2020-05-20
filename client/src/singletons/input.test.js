import {Input} from './input';

const input = new Input();
input.setKeybinding('KeyW', 'moveUp');
input.setKeybinding('KeyD', 'moveDown');

beforeEach(() => {
  input.subscribe();
  input.enable();
});

afterEach(() => {
  input.unsubscribe();
  input.disable();
});

function fireEvent(event, code) {
  window.dispatchEvent(new KeyboardEvent(event, { code }));
}

describe('keyboard events', () => {
  test('fresh keyboard event', () => {
    fireEvent('keydown', 'KeyW');
    const firstStatus = input.pressedKeys.get('moveUp')[0];
    expect(firstStatus.fresh).toBe(true);
  });

  test('non fresh keyboard event', () => {
    fireEvent('keydown', 'KeyW');
    input.fixedUpdate(Date.now());
    const firstStatus = input.pressedKeys.get('moveUp')[0];
    expect(firstStatus.fresh).toBe(false);
  });
});

describe('pressed function single input', () => {
  test('isPressed simple', () => {
    fireEvent('keydown', 'KeyW');
    expect(input.isPressed(Date.now(), 'moveUp')).toBe(true);
    expect(input.isPressed(Date.now(), 'moveDown')).toBe(false);
  });

  test('isPressed true after multiple fixed updates', () => {
    fireEvent('keydown', 'KeyW');
    const now = Date.now();

    input.fixedUpdate(now);
    input.fixedUpdate(now + 15);
    input.fixedUpdate(now + 30);

    expect(input.isPressed(now + 45, 'moveUp')).toBe(true);
    expect(input.isPressed(now, 'moveUp')).toBe(true);
  });

  test('isPressed true after up event because its still fresh', () => {
    fireEvent('keydown', 'KeyW');
    fireEvent('keyup', 'KeyW');

    expect(input.isPressed(Date.now() + 10, 'moveUp')).toBe(true);

    input.fixedUpdate(Date.now());
    expect(input.isPressed(Date.now() + 10, 'moveUp')).toBe(false);
  });

  test('gotPressed is true even tho it happened in the past', () => {
    fireEvent('keydown', 'KeyW');
    fireEvent('keyup', 'KeyW');

    expect(input.gotPressed(Date.now() + 10, 'moveUp')).toBe(true);
  });

  test('gotPressed after and before update', () => {
    fireEvent('keydown', 'KeyW');
    expect(input.gotPressed(Date.now(), 'moveUp')).toBe(true);
    input.fixedUpdate(Date.now());
    expect(input.gotPressed(Date.now(), 'moveUp')).toBe(false);
  });
});

describe('multiple key pressed', () => {
  test('simulating moving forward', () => {
    fireEvent('keydown', 'KeyW');
    fireEvent('keydown', 'KeyW');
    fireEvent('keydown', 'KeyW');
    fireEvent('keydown', 'KeyW');
    fireEvent('keydown', 'KeyW');
    fireEvent('keyup', 'KeyW');

    expect(input.pressedKeys.get('moveUp').length).toBe(1);

    fireEvent('keydown', 'KeyW');
    fireEvent('keydown', 'KeyW');
    fireEvent('keydown', 'KeyW');
    fireEvent('keydown', 'KeyW');
    fireEvent('keydown', 'KeyW');
    fireEvent('keyup', 'KeyW');

    expect(input.pressedKeys.get('moveUp').length).toBe(2);
  });
});

describe('fixed update loop', () => {
  test('cleans up past events', () => {
    fireEvent('keydown', 'KeyW');
    fireEvent('keyup', 'KeyW');

    fireEvent('keydown', 'KeyW');
    fireEvent('keyup', 'KeyW');

    fireEvent('keydown', 'KeyW');
    fireEvent('keyup', 'KeyW');

    input.fixedUpdate(Date.now());

    expect(input.pressedKeys.get('moveUp').length).toBe(0);

    fireEvent('keydown', 'KeyW');

    input.fixedUpdate(Date.now());
    expect(input.pressedKeys.get('moveUp').length).toBe(1);
  });
});
