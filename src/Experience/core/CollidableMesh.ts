import { Mesh, MeshOptions, OGLRenderingContext } from 'ogl'

export type OnCollideParams = (from: string, on: string) => void

export interface ColliderGroup {
  colliders: ColliderMesh[]
  onCollide?: OnCollideParams
}

export interface ColliderMesh extends Mesh {
  isInCollision: (mesh: Mesh) => void
  onCollide?: OnCollideParams
}

export default class CollidableMesh extends Mesh {
  constructor(gl: OGLRenderingContext, options: Partial<MeshOptions>) {
    super(gl, options)
    this.geometry.computeBoundingBox()
  }
}
