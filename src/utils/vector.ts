import { Vec3 } from 'ogl'

export function minVec3(va: Vec3, vb: Vec3, out = new Vec3()) {
  out.x = Math.min(va.x, vb.x)
  out.y = Math.min(va.y, vb.y)
  out.z = Math.min(va.z, vb.z)
  return out
}

export function maxVec3(va: Vec3, vb: Vec3, out = new Vec3()) {
  out.x = Math.max(va.x, vb.x)
  out.y = Math.max(va.y, vb.y)
  out.z = Math.max(va.z, vb.z)
  return out
}
