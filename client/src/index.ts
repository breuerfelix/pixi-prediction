import {Renderer, Ticker} from 'pixi.js';
import {MIN_WIDTH, MIN_HEIGHT} from 'config/constants';
import {PinnedContainer, resizeCallback} from 'gamixi/pinned-container';
import Store from 'singletons/store';
import {Event, Type} from 'singletons/event';

import proto from 'prototype';

//import LobbyScene from 'scenes/lobby';

const canvas = document.getElementById('root') as HTMLCanvasElement;
const renderer = new Renderer({
  view: canvas,
  antialias: true,
  autoDensity: true,
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: window.devicePixelRatio,
  backgroundColor: 0xD3D3D3,
});

const ticker = new Ticker();

Store.init(renderer, ticker);

PinnedContainer.subscribeResizeEvent =
  (fn: resizeCallback): (() => void) => {
    return Event.on(Type.Resized, fn);
  };

// Resize
function resize(): void {
  const targetWidth =
    window.innerWidth > MIN_WIDTH ? window.innerWidth : MIN_WIDTH;
  const targetHeight =
    window.innerHeight > MIN_HEIGHT ? window.innerHeight : MIN_HEIGHT;

  renderer.resize(targetWidth, targetHeight);
  Event.emit(Type.Resized);
}

window.addEventListener('resize', resize);
resize();
ticker.start();


//setTimeout(() => {
//GlobalState.UIScale = .7;
//GlobalEvent.emit(EventType.TriggerResize);
//}, 5000);

proto();
