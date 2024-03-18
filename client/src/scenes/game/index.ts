import {Loader, Container, NineSlicePlane} from 'pixi.js'

class GameScene {
  async load(callback: Function): Promise<void> {
    Loader.shared.add('test', 'assets/tile-light.png').load(() => {

      const scene = new Container()

      const testtext = Loader.shared.resources['test'].texture
      console.log(testtext)
      const test = new NineSlicePlane(testtext, 20, 20, 20, 20)
      //test.scale.set(1);
      test.height = 50
      test.width = 200


      scene.addChild(test)

      callback(scene)
    })
  }
}

export default new GameScene()
