import { Mesh, Vec3 } from 'ogl'

export default class RaycastableMesh extends Mesh {
  isHit = false
  isDown = new Vec3()
}
