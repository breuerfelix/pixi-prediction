export class InputAction {
  active = true;
  pressedKeys = new Set<string>();

  constructor(
    public downActionMap: Map<string, Function>,
    public upActionMap: Map<string, Function>,
  ) {
    window.addEventListener('keydown', this.keyDownListener.bind(this));
    window.addEventListener('keyup', this.keyUpListener.bind(this));
  }

  keyDownListener(event: KeyboardEvent): void {
    if (!this.active) return;
    const code = event.code;

    if (!this.downActionMap.has(code)) return;
    if (this.pressedKeys.has(code)) return;

    this.downActionMap.get(code)();
    this.pressedKeys.add(code);
  }

  keyUpListener(event: KeyboardEvent): void {
    if (!this.active) return;
    const code = event.code;

    if (!this.upActionMap.has(code)) return;

    this.upActionMap.get(code)();
    this.pressedKeys.delete(code);
  }
}
