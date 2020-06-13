import {EntityManager} from 'lib';
import {Entity as BaseEntity} from 'shared';
import {AssetComponent} from 'components/asset';

export interface Entity extends BaseEntity {
  asset?: AssetComponent;
}

export const entityManager = new EntityManager<Entity>();
export default entityManager;
