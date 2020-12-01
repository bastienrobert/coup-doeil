import {
  Vec3,
  Mat4,
  Box,
  Camera,
  Mesh,
  OGLRenderingContext,
  Program,
} from 'ogl'

import vertex from '~/shaders/cube/vertex.glsl'
import fragment from '~/shaders/cube/fragment.glsl'

interface CubeParams {
  mouse: Vec3
  camera: Camera
}

const tmp_vec_3 = new Vec3()
const tmp_mat_4 = new Mat4()

export default class Cube extends Mesh {
  _gl: OGLRenderingContext
  _mouse: Vec3
  _camera: Camera

  constructor(gl, { mouse, camera }: CubeParams) {
    super(gl, {
      geometry: new Box(gl, { width: 1, height: 1, depth: 1 }),
      program: new Program(gl, {
        vertex,
        fragment,
      }),
    })

    this._gl = gl

    this._mouse = mouse
    this._camera = camera
  }

  update(_: number) {
    if (this._mouse.z === 1) {
      tmp_mat_4.inverse(this._camera.projectionMatrix)
      tmp_vec_3.set(this._mouse.x, this._mouse.y, 0.5)
      tmp_vec_3.applyMatrix4(tmp_mat_4).applyMatrix4(this._camera.worldMatrix)
      tmp_vec_3.sub(this._camera.position).normalize()
      const distance = -this._camera.position.z / tmp_vec_3.z
      this.position
        .copy(this._camera.position)
        .add(tmp_vec_3.multiply(distance))
    }
  }
}
