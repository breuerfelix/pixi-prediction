// all available Components
export interface PositionComponent {
  x: number;
  y: number;
  z: number;
}

export interface Entity {
  ID: string;

  position?: PositionComponent;
  player?: true;
}

export type Component = keyof Omit<Entity, 'ID'>;
