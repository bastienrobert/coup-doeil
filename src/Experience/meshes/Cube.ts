import { Vec3, Box, Camera, Mesh, OGLRenderingContext, Program } from 'ogl'

import vertex from '~/shaders/cube/vertex.glsl'
import fragment from '~/shaders/cube/fragment.glsl'
import { getWorldPositionFromViewportCoords } from '~/utils/maths'

interface CubeParams {
  mouse: Vec3
  camera: Camera
}

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

  /**
   * @todo
   * - add spring on move
   */
  update(_: number) {
    if (this._mouse.z === 1) {
      getWorldPositionFromViewportCoords(
        this._camera,
        this._mouse,
        this.position,
      )
    }
  }
}
