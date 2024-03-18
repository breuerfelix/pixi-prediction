import entityManager from '../global/ecs'
import {Entity, Component} from '../global/ecs'

export class NetworkSystem {
  oldStateMap = new Map<string, Entity>()

  networkComponents: Array<Component> = [ 'position' ]

  fixedUpdate(lastUpdate: number, delta: number): void {
    // TODO check player positions and only publish this data

    const created = new Array<Entity>()
    const updated = new Array<Entity>()
    const deleted = new Array<Entity>()

    entityManager.entities.forEach(e => {
      const old = this.oldStateMap.get(e.ID)
      if (!old) {
        // this is a new entity
        const newE: Entity = { ID: e.ID }
        this.networkComponents.forEach(c => {
        })

        created.push(newE)
      }

    })

    const data = {
      type: 'ecs',
      action: 'update',
      created,
      updated,
      deleted,
    }

    const stringData = JSON.stringify(data)
    entityManager.getEntities('socket').forEach(e => e.socket.ws.send(stringData))
  }
}
