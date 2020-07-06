import {
  Engine as BabylonEngine,
  Scene, Vector3,
  FreeCamera, Mesh,
  HemisphericLight
} from 'babylonjs';

class Engine {
  engine: BabylonEngine;
  scene: Scene;
  canvas: HTMLCanvasElement;

  constructor() {
    this.canvas = document.getElementById('root') as HTMLCanvasElement;
    this.engine = new BabylonEngine(this.canvas, true, {preserveDrawingBuffer: true, stencil: true});
    this.createScene();

    // the canvas/window resize event handler
    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }

  // CreateScene function that creates and return the scene
  createScene(): void {
    // Create a basic BJS Scene object
    this.scene = new Scene(this.engine);

    const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), this.scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(this.canvas, false);
    const light = new HemisphericLight('light1', new Vector3(0, 1, 0), this.scene);
    const ground = Mesh.CreateGround('ground1', 10, 10, 0, this.scene, false);
  }
}

const engine = new Engine();
export default engine;
