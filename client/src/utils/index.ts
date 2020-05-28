import Vector from 'vector2d-extended';

function VectorFrom(obj: { x: number; y: number }): Vector {
  return new Vector(obj.x, obj.y);
}

export {
  VectorFrom,
};
