import {EventSystem} from 'gamixi/event-system';

export enum Type {
  Resized,
}

export const Event = new EventSystem<Type>();
export default Event;
