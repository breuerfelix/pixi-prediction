import {Container, NineSlicePlane, Texture} from 'pixi.js';

export class Modal extends Container {
  constructor(
    width: number,
    height: number,
    offsetBottom: number,
    backgroundTexture: Texture,
    backgroundMargin: number,
    foregroundTexture: Texture,
    foregroundMargin: number,
  ) {
    super();

    const backgroundPlane = new NineSlicePlane(
      backgroundTexture,
      backgroundMargin,
      backgroundMargin,
      backgroundMargin,
      backgroundMargin,
    );

    const foregroundPlane = new NineSlicePlane(
      foregroundTexture,
      foregroundMargin,
      foregroundMargin,
      foregroundMargin,
      foregroundMargin,
    );

    backgroundPlane.width = width;
    backgroundPlane.height = height;

    const foregroundPadding = 20;
    foregroundPlane.width = width - foregroundPadding  * 2;
    foregroundPlane.height = height - foregroundPadding  * 2 - offsetBottom;

    foregroundPlane.position.set(foregroundPadding);

    this.addChild(backgroundPlane, foregroundPlane);
  }
}
