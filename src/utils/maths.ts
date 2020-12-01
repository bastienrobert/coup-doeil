import { Vec2, Vec3 } from 'ogl'

export function normalizeMouse(
  mouse: Vec3,
  resolution: Vec2,
  copy: Vec3 = new Vec3(),
) {
  return copy.set(
    (mouse.x / resolution.x) * 2 - 1,
    -(mouse.y / resolution.y) * 2 + 1,
    mouse.z,
  )
}
