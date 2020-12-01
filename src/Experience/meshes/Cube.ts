import { Vec3, Box, Camera, OGLRenderingContext, Program, Vec2 } from 'ogl'

import RaycastableMesh from '../core/RaycastableMesh'

import vertex from '~/shaders/cube/vertex.glsl'
import fragment from '~/shaders/cube/fragment.glsl'

import { getWorldPositionFromViewportCoords } from '~/utils/maths'

interface CubeParams {
  mouse: Vec3
  camera: Camera
}

const WIDTH = 1
const HEIGHT = 1

export default class Cube extends RaycastableMesh {
  _gl: OGLRenderingContext
  _mouse: Vec3
  _positionOnDown: Vec3
  _camera: Camera

  isDown: Vec3

  constructor(gl, { mouse, camera }: CubeParams) {
    super(gl, {
      geometry: new Box(gl, { width: WIDTH, height: HEIGHT, depth: 1 }),
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
    this._positionOnDown = new Vec3()
    this._camera = camera

    this.isDown = new Vec3()

    this.onBeforeRender(this._updateHitUniform)

    this.geometry.computeBoundingBox()
  }

  _updateHitUniform = () => {
    this.program.uniforms.uHit.value = this.isHit ? 1 : 0
  }

  get width() {
    return WIDTH * 0.5 * this.scale.x
  }

  get height() {
    return HEIGHT * 0.5 * this.scale.y
  }

  /**
   * @todo
   * - add spring on move
   */
  update(_: number) {
    if (this.isDown.z) {
      getWorldPositionFromViewportCoords(
        this._camera,
        this._mouse,
        this.position,
      )
      this.position.sub(this._positionOnDown)
    } else {
      getWorldPositionFromViewportCoords(
        this._camera,
        this._mouse,
        this._positionOnDown,
      )
      this._positionOnDown.sub(this.position)
    }
  }
}
