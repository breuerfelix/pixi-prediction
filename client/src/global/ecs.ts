import {EntityManager} from 'lib';
import {Entity as BaseEntity} from 'shared';
import {MeshComponent} from 'components/mesh';

export interface Entity extends BaseEntity {
  mesh?: MeshComponent;
}

export const entityManager = new EntityManager<Entity>();
export default entityManager;
