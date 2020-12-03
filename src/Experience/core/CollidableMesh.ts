import { Bounds, Mesh, MeshOptions, OGLRenderingContext, Vec3 } from 'ogl'

export default class CollidableMesh extends Mesh {
  isCollide = false
  bounds: Bounds = {
    min: new Vec3(),
    max: new Vec3(),
    center: new Vec3(),
    scale: new Vec3(),
    radius: Infinity,
  }

  constructor(gl: OGLRenderingContext, options: Partial<MeshOptions>) {
    super(gl, options)
    this.geometry.computeBoundingBox()
  }
}
