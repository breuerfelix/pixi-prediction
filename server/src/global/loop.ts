import {BasicLoop} from 'lib'
import {NetworkSystem} from '../systems/network'

export class Loop extends BasicLoop {
  networkSystem: NetworkSystem

  constructor() {
    super()
    this.networkSystem = new NetworkSystem()
    setTimeout(this.tick.bind(this))
  }

  fixedUpdate(lastUpdate: number, delta: number): void {
    this.networkSystem.fixedUpdate(lastUpdate, delta)
  }

  alphaUpdate(
    lastUpdate: number, delta: number, alpha: number,
  ): void {
    setTimeout(this.tick.bind(this))
  }
}

export const loop = new Loop()
export default loop
