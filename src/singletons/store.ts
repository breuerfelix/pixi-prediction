import {Renderer, Container, Ticker} from 'pixi.js';

class Store {
  renderer: Renderer;
  ticker: Ticker;
  activeScene: Container;

  fontFamily: string;
  UIScale: number;

  init(renderer: Renderer, ticker: Ticker, UIScale = 1): void {
    this.renderer = renderer;
    this.ticker = ticker;
    this.activeScene = new Container();

    this.UIScale = UIScale;
    this.fontFamily = 'monospace';

    //this.ticker.add(this.render.bind(this));
  }

  render(): void {
    this.renderer.render(this.activeScene);
  }

  changeScene(newScene: Container): void {
    this.activeScene = newScene;
    // TODO maybe fire change scene event
  }
}

export default new Store();
