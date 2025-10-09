type Bound = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function aabbIntersect(a: Bound, b: Bound) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
