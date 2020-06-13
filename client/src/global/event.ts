import {EventSystem} from 'lib';

export enum Event {
  NewEntity,
}

export const eventSystem = new EventSystem<Event>();
export default eventSystem;
