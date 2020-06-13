export class EntityManager<E extends { ID: string }> {
  entities = new Array<E>();
  entityMap = new Map<string, E>();

  getEntities(...components: Array<keyof Omit<E, 'ID'>>): Array<E> {
    return this.entities.filter(ent => !components.some(comp => !ent[comp]));
  }

  add(entity: E): void {
    // TODO check if is exists
    this.entityMap.set(entity.ID, entity);
    this.entities.push(entity);
  }

  delete(ID: string): void {
    this.entityMap.delete(ID);
    this.entities = this.entities.filter(e => e.ID != ID);
  }
}
