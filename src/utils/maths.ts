import { Camera, Mat4, Transform, Vec2, Vec3 } from 'ogl'

export function getResolutionNormalizedCoords(
  coords: Vec2 | Vec3,
  resolution: Vec2,
  out: Vec2 | Vec3,
) {
  out.copy(coords)
  out.x = (coords.x / resolution.x) * 2 - 1
  out.y = -(coords.y / resolution.y) * 2 + 1
  return out
}

const tmp_vec_3 = new Vec3()
const tmp_mat_4 = new Mat4()
export function getWorldPositionFromViewportCoords(
  camera: Camera,
  coords: Vec2 | Vec3,
  out = new Vec3(),
) {
  tmp_mat_4.copy(camera.projectionMatrix).inverse()
  tmp_vec_3.set(coords.x, coords.y, 0)
  tmp_vec_3.applyMatrix4(tmp_mat_4).applyMatrix4(camera.worldMatrix)
  tmp_vec_3.sub(camera.position).normalize()
  const distance = -camera.position.z / tmp_vec_3.z
  return out.copy(camera.position).add(tmp_vec_3.multiply(distance))
}

export interface Rect {
  top?: number
  bottom?: number
  left?: number
  right?: number
}

const tmp_vec_2 = new Vec2()
export function getWorldPositionFromViewportRectPx(
  camera: Camera,
  rect: Rect,
  resolution: Vec2,
  out: Vec3 = new Vec3(),
) {
  tmp_vec_2.set(
    rect.left ?? resolution.y - rect.right,
    rect.top ?? resolution.x - rect.bottom,
  )
  getResolutionNormalizedCoords(tmp_vec_2, resolution, tmp_vec_2)
  return getWorldPositionFromViewportCoords(camera, tmp_vec_2, out)
}

export function getPxFromPerc(value: Vec2, resolution: Vec2, out = new Vec2()) {
  return out.set((resolution.x / 100) * value.x, (resolution.y / 100) * value.y)
}

const tmp_vec_22 = new Vec2()
export function getWorldPositionFromViewportRectPerc(
  camera: Camera,
  rect: Rect,
  resolution: Vec2,
  out = new Vec3(),
) {
  getMouseNormCoordsFromRectPerc(rect, resolution, tmp_vec_22)
  getWorldPositionFromViewportCoords(camera, tmp_vec_22, out)
  return out
}

export function getScaleFromCameraDistance(
  camera: Camera,
  position: Vec3,
  out = new Vec3(),
) {
  const distance = Math.abs(camera.position.z - position.z)

  const t = Math.tan((camera.fov * Math.PI) / 180 / 2)
  out.y = t * 2 * distance
  out.x = out.y * camera.aspect

  return out
}

export function getWorldMatrix(object: Transform, out = new Vec3()) {
  object.updateMatrixWorld()
  return out.set(0, 0, 0).applyMatrix4(object.worldMatrix)
}

const tmp_vec_23 = new Vec2()
export function getMouseNormCoordsFromRectPerc(
  rect: Rect,
  resolution: Vec2,
  out: Vec2,
) {
  tmp_vec_23.set(rect.left ?? 100 - rect.right, rect.top ?? 100 - rect.bottom)
  getPxFromPerc(tmp_vec_23, resolution, tmp_vec_23)
  getResolutionNormalizedCoords(tmp_vec_23, resolution, out)
  return out
}
