import {NineSlicePlane, Container} from 'pixi.js';
import SpritesheetLoader from 'utils/spritesheet-loader';
import {PinnedContainer, Pin} from 'gamixi/pinned-container';
import {GlobalEvent, EventType} from 'utils/event';
import GlobalState from 'state';
import {Button} from 'gamixi/button';

import {Modal} from 'ui/modal';
import {Input} from 'ui/input';

import GameScene from 'scenes/game';

class LobbyScene {
  onClickLogin(): void {
    console.debug('LOGIN PRESSED');
    GameScene.load((scene: Container) =>  GlobalState.changeScene(scene));
  }

  async load(callback: Function): Promise<void> {
    // prefetch
    const sheet = await SpritesheetLoader.load('assets/rpgui.json');
    const borderSheet = await SpritesheetLoader.load('assets/borders.json');
    const textures = sheet.textures;
    const borderTextures = borderSheet.textures;

    // actual setup
    const loginModal = new PinnedContainer(Pin.Center);

    const margin = 10;
    const brownButton =
      new NineSlicePlane(textures['buttonLong_blue.png'], margin, margin, margin, margin);
    const brownButtonPressed =
      new NineSlicePlane(textures['buttonLong_blue_pressed.png'], margin, margin, margin, margin);
    const loginButton = new Button(
      'Login',
      this.onClickLogin.bind(this),
      brownButton,
      brownButtonPressed,
    );
    loginButton.scale.set(.7);
    loginButton.y = 245;
    loginButton.x = 110;

    const panelBrown = textures['panel_brown.png'];
    const panelInsetBeige = textures['panelInset_beige.png'];
    const loginBackgroundModal = new Modal(
      350,
      300,
      50,
      panelBrown,
      40,
      panelInsetBeige,
      40,
    );

    const usernameInput = new Input(200, 40, 'Username', borderTextures['full-dirt.png']);
    usernameInput.x = 80;
    usernameInput.y = 40;

    //const passwordInput = new Input(200, 40, 'Password', borderTextures['full-dirt.png']);
    //usernameInput.x = 75;
    //usernameInput.y = 150;

    loginModal.addChild(loginBackgroundModal);

    loginModal.addChild(usernameInput);
    //loginModal.addChild(passwordInput);

    loginModal.addChild(loginButton);

    // post effects
    GlobalEvent.emit(EventType.TriggerResize);
    callback(loginModal);
  }
}

const scene = new LobbyScene();
export default scene;
