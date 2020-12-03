import { Mesh, Vec3 } from 'ogl'

export interface RaycastableGroup {
  raycastables: RaycastableMesh[]
}

export default class RaycastableMesh extends Mesh {
  isHit = false
  isDown = new Vec3()
}
