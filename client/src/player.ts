//import {BasePlayer, Position} from 'shared';
//import {Graphics} from 'pixi.js';
//import Vector from 'vector2d-extended';
//import {VectorFrom} from 'utils';

//export class Player extends BasePlayer {
//sprite: Graphics;

//constructor(
//x: number, y: number, id: string,
//) {
//super(x, y, id);
//this.sprite = new Graphics();
//this.sprite
//.beginFill(0xDE3249)
//.drawRect(x, y, 100, 100)
//.endFill();
//}

//fixedUpdate(lastUpdate: number, delta: number): void {
//// TODO check if next timestamp is muteable
//// if no, return
//this.playerController(lastUpdate, delta);
//}

//alphaUpdate(lastUpdate: number, delta: number, alpha: number): void {
//const nextTick = lastUpdate + delta;
//const pos = this.positions.get(nextTick);
//const stepVec = Vector.add(pos.posVec, Vector.multiply(pos.destVec, alpha));
//this.sprite.position.set(stepVec.x, stepVec.y);
//}

//onServerUpdate(
//lastUpdate: number, delta: number, data: { position: Position },
//): void {
//const pos = data.position;
//const newPos = {
//posVec: VectorFrom(pos.posVec),
//destVec: VectorFrom(pos.destVec),
//};

//this.positions.set(lastUpdate + delta, newPos, false);
//}
//}
