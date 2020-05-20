import {Loader, Spritesheet} from 'pixi.js';

class SpritesheetLoader {
  loadedMap: Map<string, boolean>

  constructor() {
    this.loadedMap = new Map();
  }

  // const sheet = await load('ui/spritesheet.json');
  async load(path: string): Promise<Spritesheet> {
    if (this.loadedMap.has(path)) {
      const loaded = this.loadedMap.get(path);
      if (loaded) {
        return Loader.shared.resources[path].spritesheet;
      }

      // TODO while loop and wait until its loaded
      throw 'TODO handle that';
    }

    this.loadedMap.set(path, false);

    return new Promise(resolve => {
      Loader.shared.add(path).load(() => {
        this.loadedMap.set(path, true);
        resolve(Loader.shared.resources[path].spritesheet);
      });
    });
  }
}

export default new SpritesheetLoader();
