import {Container, TextStyle, Text,} from 'pixi.js';

// TODO add jsDocs for this module

export class Button extends Container {
  containerNormal: Container;
  containerPressed: Container;

  isPressed: boolean;
  movedValue: number;
  buttonDropPercent: number;

  constructor(
    text: string,
    callback: (btn: Button) => void,
    containerNormal: Container,
    containerPressed: Container,
    // TODO type this when PIXI exports the
    // TextStyle constructor type
    textStyleOptions: any = {},
    fontOffsetY = -3,
    buttonDropPercent = .1,
  ) {
    super();
    this.isPressed = false;
    this.buttonDropPercent = buttonDropPercent;

    this.containerNormal = containerNormal;
    this.containerPressed = containerPressed;

    this.addChild(this.containerNormal);

    // provide sensible defaults
    // override with textStyleOptions
    const style = new TextStyle({
      fontFamily: 'monospace',
      fontSize: 21,
      fill: 'white',
      ...textStyleOptions,
    });

    const textObject = new Text(text, style);
    textObject.x = this.containerNormal.width / 2 - textObject.width / 2;
    textObject.y =
      this.containerNormal.height / 2 -
      textObject.height / 2 +
      fontOffsetY;

    this.addChild(textObject);

    this.interactive = true;
    this.buttonMode = true;

    this.on('pointertap', () => {
      this.changeNormal();

      callback(this);
    });

    this.on('pointerdown', () => {
      this.changePressed();
    });

    this.on('pointerout', () => {
      if (!this.isPressed) return;
      this.changeNormal();
    });
  }

  changePressed(): void {
    this.isPressed = true;

    this.removeChildAt(0);
    this.addChildAt(this.containerPressed, 0);

    // drop the button by x percent of the height
    this.movedValue =
      this.containerPressed.height * this.buttonDropPercent;

    for (const child of this.children) {
      child.y += this.movedValue;
    }
  }

  changeNormal(): void {
    this.isPressed = false;

    for (const child of this.children) {
      child.y -= this.movedValue;
    }

    this.removeChildAt(0);
    this.addChildAt(this.containerNormal, 0);
  }
}

export default Button;
