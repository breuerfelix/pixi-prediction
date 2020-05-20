import {Container, Texture, NineSlicePlane} from 'pixi.js';
import TextInput from 'pixi-text-input';
import GlobalState from 'state';

export class Input extends TextInput {
  constructor(
    width: number,
    height: number,
    placeholder: string,
    borderTexture: Texture,

    inputOptions: any = {},
  ) {
    const generateBox = (
      width: number,
      height: number,
      state: string,
    ): Container => {
      const borderMargin = 20;
      const box = new NineSlicePlane(
        borderTexture, borderMargin, borderMargin, borderMargin, borderMargin
      );

      const margin = 15;

      box.width = width + 50;
      box.height = height + margin;
      box.x -= 25;
      box.y -= margin / 2;

      return box;
    };

    const options = {
      input: {
        fontSize: '22px',
        fontFamily: GlobalState.fontFamily,
        ...inputOptions,
      },
      box: generateBox,
    };

    // @ts-ignore
    super(options);

    // @ts-ignore
    this.placeholder = placeholder;
    this.width = width;
    this.height = height;
  }
}
