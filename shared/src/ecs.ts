// all available Components
export interface PositionComponent {
  x: number;
  y: number;
}

export interface DestinationComponent {
  x: number;
  y: number;
}

export interface Entity {
  ID: string;

  position?: PositionComponent;
  destination?: DestinationComponent;
  player?: true;
}

export type Component = keyof Omit<Entity, 'ID'>;
