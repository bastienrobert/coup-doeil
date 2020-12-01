import { Vec3, Box, Camera, OGLRenderingContext, Program } from 'ogl'

import RaycastableMesh from '../core/RaycastableMesh'

import vertex from '~/shaders/cube/vertex.glsl'
import fragment from '~/shaders/cube/fragment.glsl'

import { getWorldPositionFromViewportCoords } from '~/utils/maths'

interface CubeParams {
  mouse: Vec3
  camera: Camera
}

export default class Cube extends RaycastableMesh {
  _gl: OGLRenderingContext
  _mouse: Vec3
  _camera: Camera

  constructor(gl, { mouse, camera }: CubeParams) {
    super(gl, {
      geometry: new Box(gl, { width: 1, height: 1, depth: 1 }),
      program: new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          uHit: { value: 0 },
        },
      }),
    })

    this._gl = gl

    this._mouse = mouse
    this._camera = camera

    this.onBeforeRender(this._updateHitUniform)
  }

  _updateHitUniform = () => {
    this.program.uniforms.uHit.value = this.isHit ? 1 : 0
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
