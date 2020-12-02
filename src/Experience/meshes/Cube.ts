import { Vec3, Box, Camera, OGLRenderingContext, Program } from 'ogl'

import RaycastableMesh from '../core/RaycastableMesh'

import vertex from '~/shaders/cube/vertex.glsl'
import fragment from '~/shaders/cube/fragment.glsl'

import { getWorldPositionFromViewportCoords } from '~/utils/maths'
import { mouseOffsetHandler, MouseOffsetHandler } from '~/utils/handler'

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
  _mouseHandler: MouseOffsetHandler

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

    this._mouseHandler = mouseOffsetHandler(this._mouseHandlerCallback)

    this.isDown = new Vec3()

    this.onBeforeRender(this._updateHitUniform)

    this.geometry.computeBoundingBox()
  }

  get width() {
    return WIDTH * 0.5 * this.scale.x
  }

  get height() {
    return HEIGHT * 0.5 * this.scale.y
  }

  _updateHitUniform = () => {
    this.program.uniforms.uHit.value = this.isHit ? 1 : 0
  }

  _mouseHandlerCallback = (init) => {
    getWorldPositionFromViewportCoords(this._camera, this._mouse, this.position)
    this.position.sub(init)
  }

  /**
   * @todo
   * - add spring on move
   */
  update(_: number) {
    if (this.isDown.z) {
      this._mouseHandler.callback()
    } else {
      getWorldPositionFromViewportCoords(
        this._camera,
        this._mouse,
        this._mouseHandler.init,
      )
      this._mouseHandler.init.sub(this.position)
    }
  }
}
