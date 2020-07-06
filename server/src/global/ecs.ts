import {EntityManager} from 'lib';
import {Entity as BaseEntity} from 'shared';
import {SocketComponent} from '../components/socket';

export interface Entity extends BaseEntity {
  socket?: SocketComponent;
}

export type Component = keyof Omit<Entity, 'ID'>;

export const entityManager = new EntityManager<Entity>();
export default entityManager;
