# pixi.js client side prediction

this is an example project to experiement with [pixi.js](https://github.com/pixijs) and client side prediction.

communication is done via websocket. the inputs get immediatly sent to the server and also stored on the client.  
next `fixed_update` call these are processed on the client and on the server. when the servers sends the response position to the client, it will snap to the correct position if the client position was wrong.

since this repository is just for me testing stuff out, most of the client side code is in [prototype.ts](https://github.com/breuerfelix/archaac/blob/master/client/src/prototype.ts).  

if you got any questions to one of these topics, just contact me, i would love to have a chat with you about this topic!

## PixiJS Best Practices

I missed a `what you should know about ...` when starting with [PixiJS](https://www.pixijs.com/).  
That's why I will share my personal `way of doing things` with this awesome framework.

You figured out some better ways? Let me and all others know by providing a Pull Request!

### Sprites

#### Sprite size

When creating Sprites with [Aseprite](https://www.aseprite.org) use 240x240px to get a decent looking Button.  
That means just export a 120x120px Image with 200% to expect the same results.

#### Sprite instantiation

According to [this #6599](https://github.com/pixijs/pixi.js/issues/6599) issue you should never use `.from()` to construct sprites.  
Use the `PIXI.Loader` to preload resources and when this is done, instantiate your sprites with the `new` keyword.

The static `.from()` method is able to handle multiple different input types but is therefore not that performant. If you wanna do it the correct way, do it with `new`.
```javascript
const loader = PIXI.Loader.shared;

loader
  .add('button_brown', 'assets/images/button_brown.png')
  .add('button_light', 'assets/images/button_light.png')
  .load(() => {
    const texture = loader.resources['button_brown'].texture;
    const sprite = new PIXI.Sprite(texture);
  });
```

### Promises

If you wanna use `async / await` in your application you have to convert Pixi's callbacks to promises.  
You can read [here #2538](https://github.com/pixijs/pixi.js/issues/2538) why Pixi is not using promises in their core library.

```javascript
function load(loader, alias, path) {
  return new Promise(
    (resolve, reject) => {
      loader.add(alias, path).load(() => resolve(loader.resources[path]));
    }
  );
}

const resource = await load(
  PIXI.Loader.shared,
  'button_brown',
  'assets/images/button_brown.png'
);

// do anything with your loaded texture
```
