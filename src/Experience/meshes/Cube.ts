import { Vec3, Box, Camera, OGLRenderingContext, Program, Vec2 } from 'ogl'

import RaycastableMesh from '../core/RaycastableMesh'

import vertex from '~/shaders/cube/vertex.glsl'
import fragment from '~/shaders/cube/fragment.glsl'

import {
  getScaleFromCameraDistance,
  getWorldMatrix,
  getWorldPositionFromViewportCoords,
  getResolutionNormalizedCoords,
  getWorldPositionFromViewportRectPerc,
} from '~/utils/maths'
import { mouseOffsetHandler, MouseOffsetHandler } from '~/utils/handler'
import spring, { Spring } from '~/utils/spring'
import timestamp, { Timestamp } from '~/utils/timestamp'

interface CubeParams {
  mouse: Vec3
  resolution: Vec2
  camera: Camera
}

const tmp_vec_2 = new Vec2()
const tmp_vec_3 = new Vec3()

const WIDTH = 1
const HEIGHT = 1

const UP_CONFIG = {
  friction: 9,
  rigidity: 0.05,
}
const DOWN_CONFIG = {
  friction: 30,
  rigidity: 0.15,
}

export default class Cube extends RaycastableMesh {
  _gl: OGLRenderingContext
  _resolution: Vec2
  _mouse: Vec3
  _moved: boolean
  _initial: Vec3
  _positionOnDown: Vec3
  _camera: Camera
  _mouseHandler: MouseOffsetHandler
  _spring: Spring
  _timestamp: Timestamp

  isDown: Vec3
  wasDown: boolean

  constructor(gl, { mouse, camera, resolution }: CubeParams) {
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
    this._resolution = resolution
    this._positionOnDown = new Vec3()
    this._initial = new Vec3()
    this._camera = camera

    this._spring = spring({
      value: new Vec2(),
      config: UP_CONFIG,
    })

    this._timestamp = timestamp()
    this._mouseHandler = mouseOffsetHandler(this._mouseHandlerCallback)

    this.isDown = new Vec3()
    this.wasDown = false

    this.onBeforeRender(this._updateHitUniform)

    this.geometry.computeBoundingBox()
  }

  get width() {
    return WIDTH * 0.5 * this.scale.x
  }

  get height() {
    return HEIGHT * 0.5 * this.scale.y
  }

  _isOutViewport() {
    getWorldPositionFromViewportRectPerc(
      this._camera,
      { top: 0, left: 0 },
      this._resolution,
      tmp_vec_3,
    )
    getWorldMatrix(this, tmp_vec_3)
    getScaleFromCameraDistance(this._camera, tmp_vec_3, tmp_vec_3)
    return (
      this.position.x > tmp_vec_3.x * 0.5 ||
      this.position.x < -tmp_vec_3.x * 0.5 ||
      this.position.y > tmp_vec_3.y * 0.5 ||
      this.position.y < -tmp_vec_3.y * 0.5
    )
  }

  _updateHitUniform = () => {
    this.program.uniforms.uHit.value = this.isHit ? 1 : 0
  }

  _mouseHandlerCallback = (init) => {
    getWorldPositionFromViewportCoords(
      this._camera,
      this._spring.inrtia.value,
      this.position,
    )
    this.position.sub(init)
  }

  resize = () => {
    if (!this._moved) {
      getWorldPositionFromViewportRectPerc(
        this._camera,
        { top: 50, left: (1 / 6) * 100 },
        this._resolution,
        this.position,
      )
      this._initial.copy(this.position)
    }
  }

  /**
   * @todo
   * - add spring on move
   */
  update(t: number) {
    this._timestamp.update(t * 1000)
    this._spring.update(this._timestamp.delta)

    if (this.isDown.z) {
      this._moved = true
      this._spring.set({
        value: [this._mouse.x, this._mouse.y],
        config: DOWN_CONFIG,
      })
      this._mouseHandler.callback()
    } else if (this.wasDown) {
      this._spring.set({
        value: [this._mouse.x, this._mouse.y],
        config: UP_CONFIG,
      })
      this._mouseHandler.callback()
    } else if (this._spring.inrtia.stopped) {
      this._spring.inrtia.value.set(this._mouse.x, this._mouse.y)
      getWorldPositionFromViewportCoords(
        this._camera,
        this._mouse,
        this._mouseHandler.init,
      )
      this._mouseHandler.init.sub(this.position)
    }

    this._mouseHandler.callback()

    if (this._isOutViewport()) {
      tmp_vec_2.set((1 / 6) * this._resolution.x, 0.5 * this._resolution.y)
      getResolutionNormalizedCoords(tmp_vec_2, this._resolution, tmp_vec_2)
      this._mouseHandler.init.set(0, 0, 0)
      this._spring.set({
        value: [tmp_vec_2.x, tmp_vec_2.y],
        config: UP_CONFIG,
      })
      this.updateMatrixWorld()
    }
    this.wasDown = this.isDown.z ? true : false
  }
}
