import Unique from './unique';

interface UpdateData {
  id: string;
  data: any;
}

abstract class Entity extends Unique {
  static entities = new Set<Entity>();
  static entityMap = new Map<string, Entity>();

  static fixedUpdate(lastUpdate: number, delta: number): UpdateData[] {
    const networkData: any[] = [];

    Entity.entities
      .forEach(ent => {
        const data = ent.fixedUpdate(lastUpdate, delta);
        networkData.push({ id: ent.id, data });
      });

    return networkData;
  }

  static alphaUpdate(
    lastUpdate: number, delta: number, alpha: number,
  ): void {
    Entity.entities
      .forEach(ent => ent.alphaUpdate(lastUpdate, delta, alpha));
  }

  static serverUpdate(
    lastUpdate: number, delta: number, data: any[],
  ): void {
    data.forEach(d => {
      if (!this.entityMap.has(d.id)) {
        throw 'cannt find id!!!';
      }

      this.entityMap.get(d.id).onServerUpdate(lastUpdate, delta, d.data);
    });
  }

  constructor(id: string = null) {
    super(id);
    Entity.entities.add(this);
    Entity.entityMap.set(this.id, this);
  }

  destruct(): void {
    Entity.entities.delete(this);
    Entity.entityMap.delete(this.id);
  }

  /* eslint-disable */
  fixedUpdate(lastUpdate: number, delta: number): any { }
  alphaUpdate(
    lastUpdate: number, delta: number, alpha: number,
  ): void { }
  onServerUpdate(lastUpdate: number, delta: number, data: any): void { }
  /* eslint-enable */
}

export default Entity;
