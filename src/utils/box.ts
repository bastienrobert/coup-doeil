import { Bounds, Mat4, Vec3 } from 'ogl'
import { maxVec3, minVec3 } from './vector'

const points = [
  new Vec3(),
  new Vec3(),
  new Vec3(),
  new Vec3(),
  new Vec3(),
  new Vec3(),
  new Vec3(),
  new Vec3(),
]

function expand(box: Bounds, point: Vec3) {
  minVec3(box.min, point, box.min)
  maxVec3(box.max, point, box.max)

  return box
}

function fromPoints(box: Bounds) {
  box.min.set(Infinity, Infinity, Infinity)
  box.max.set(-Infinity, -Infinity, -Infinity)

  for (let i = 0, l = points.length; i < l; i++) {
    expand(box, points[i])
  }

  return box
}

function isEmpty(box: Bounds) {
  return box.max.x < box.min.x || box.max.y < box.min.y || box.max.z < box.min.z
}

export function applyMatrix4(box: Bounds, matrix: Mat4) {
  if (isEmpty(box)) return box

  points[0].set(box.min.x, box.min.y, box.min.z).applyMatrix4(matrix)
  points[1].set(box.min.x, box.min.y, box.max.z).applyMatrix4(matrix)
  points[2].set(box.min.x, box.max.y, box.min.z).applyMatrix4(matrix)
  points[3].set(box.min.x, box.max.y, box.max.z).applyMatrix4(matrix)
  points[4].set(box.max.x, box.min.y, box.min.z).applyMatrix4(matrix)
  points[5].set(box.max.x, box.min.y, box.max.z).applyMatrix4(matrix)
  points[6].set(box.max.x, box.max.y, box.min.z).applyMatrix4(matrix)
  points[7].set(box.max.x, box.max.y, box.max.z).applyMatrix4(matrix)

  return fromPoints(box)
}

export function cloneBox(
  box: Bounds,
  out: Bounds = {
    min: new Vec3(),
    max: new Vec3(),
    center: new Vec3(),
    scale: new Vec3(),
    radius: Infinity,
  },
) {
  out.min.copy(box.min)
  out.max.copy(box.max)
  out.center.copy(box.center)
  out.scale.copy(box.scale)
  out.radius = box.radius

  return out
}

export function box(): Bounds {
  return {
    min: new Vec3(),
    max: new Vec3(),
    center: new Vec3(),
    scale: new Vec3(),
    radius: Infinity,
  }
}

export function getIsIntersectedBoundingBox(boxa: Bounds, boxb: Bounds) {
  // using 6 splitting planes to rule out intersections.
  return boxa.max.x < boxb.min.x ||
    boxa.min.x > boxb.max.x ||
    boxa.max.y < boxb.min.y ||
    boxa.min.y > boxb.max.y ||
    boxa.max.z < boxb.min.z ||
    boxa.min.z > boxb.max.z
    ? false
    : true
}
