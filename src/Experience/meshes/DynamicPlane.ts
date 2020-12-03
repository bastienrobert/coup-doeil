import {
  Vec3,
  Camera,
  OGLRenderingContext,
  Program,
  Vec2,
  Plane as OGLPlane,
  TextureLoader,
} from 'ogl'

import RaycastableMesh from '../core/RaycastableMesh'

import vertex from '~/shaders/dynamic/vertex.glsl'
import fragment from '~/shaders/dynamic/fragment.glsl'

import {
  Rect,
  getScaleFromCameraDistance,
  getWorldMatrix,
  getWorldPositionFromViewportCoords,
  getWorldPositionFromViewportRectPerc,
} from '~/utils/maths'
import { mouseOffsetHandler, MouseOffsetHandler } from '~/utils/handler'
import spring, { Spring } from '~/utils/spring'
import timestamp, { Timestamp } from '~/utils/timestamp'

interface DynamicPlaneParams {
  mouse: Vec3
  resolution: Vec2
  camera: Camera
  texture?: string
  positionOnScreen?: Rect
}

const tmp_vec_3 = new Vec3()

const WIDTH = 1
const HEIGHT = 1

const DOWN_CONFIG = {
  friction: 9,
  rigidity: 0.05,
}
const UP_CONFIG = {
  friction: 30,
  rigidity: 0.15,
}

export default class DynamicPlane extends RaycastableMesh {
  _gl: OGLRenderingContext
  _resolution: Vec2
  _mouse: Vec3
  _moved: boolean
  _initial: Vec3
  _positionOnScreen: Rect
  _positionOnDown: Vec3
  _camera: Camera
  _mouseHandler: MouseOffsetHandler
  _mouseSpring: Spring
  _positionSpring: Spring
  _timestamp: Timestamp

  isDown: Vec3
  wasDown: boolean

  constructor(
    gl,
    {
      mouse,
      camera,
      resolution,
      texture,
      positionOnScreen,
    }: DynamicPlaneParams,
  ) {
    super(gl, {
      geometry: new OGLPlane(gl, { width: WIDTH, height: HEIGHT }),
      program: new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          uTexture: {
            value: TextureLoader.load(gl, {
              src: texture,
              generateMipmaps: false,
            }),
          },
          uHit: { value: 0 },
        },
      }),
    })

    this._gl = gl

    this._mouse = mouse
    this._resolution = resolution
    this._positionOnDown = new Vec3()
    this._initial = new Vec3()
    this._positionOnScreen = positionOnScreen
    this._camera = camera

    this._mouseSpring = spring({
      value: new Vec2(),
      config: UP_CONFIG,
    })
    this._positionSpring = spring({
      value: new Vec3(),
      config: UP_CONFIG,
    })

    this._timestamp = timestamp()
    this._mouseHandler = mouseOffsetHandler(this._mouseHandlerCallback)

    this.isDown = new Vec3()
    this.wasDown = false

    this.onBeforeRender(this._updateHitUniform)

    this._computeBoundingBox()
  }

  get width() {
    return WIDTH * 0.5 * this.scale.x
  }

  get height() {
    return HEIGHT * 0.5 * this.scale.y
  }

  _computeBoundingBox() {
    this.geometry.computeBoundingBox()
    this.geometry.bounds.max.z = 0.5
    this.geometry.bounds.min.z = -0.5
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
      this._mouseSpring.inrtia.value,
      this.position,
    )
    this.position.sub(init)
  }

  resize = () => {
    if (!this._moved) {
      if (this._positionOnScreen) {
        getWorldPositionFromViewportRectPerc(
          this._camera,
          this._positionOnScreen,
          this._resolution,
          this.position,
        )
      }
      this._initial.copy(this.position)
    }
  }

  update(t: number) {
    this._timestamp.update(t * 1000)
    this._mouseSpring.update(this._timestamp.delta)
    this._positionSpring.update(this._timestamp.delta)

    if (this.isDown.z && !this.wasDown) {
      this._mouseSpring.inrtia.value.set(this._mouse.x, this._mouse.y)
      getWorldPositionFromViewportCoords(
        this._camera,
        this._mouse,
        this._mouseHandler.init,
      )
      this._mouseHandler.init.sub(this.position)
    }

    if (this.isDown.z) {
      this._moved = true
      this._mouseSpring.set({
        value: [this._mouse.x, this._mouse.y],
        config: DOWN_CONFIG,
      })
    } else if (this.wasDown) {
      this._mouseSpring.set({
        value: [this._mouse.x, this._mouse.y],
        config: UP_CONFIG,
      })
    }

    if (!this._mouseSpring.inrtia.stopped) {
      this._mouseHandler.callback()
    }

    if (this._isOutViewport()) {
      this._positionSpring.set({
        value: [this._initial.x, this._initial.y, this._initial.z],
        config: DOWN_CONFIG,
      })
      this.updateMatrixWorld()
    } else {
      this._positionSpring.inrtia.value.copy(this.position)
    }

    this.position.copy(this._positionSpring.inrtia.value)
    this.wasDown = this.isDown.z ? true : false
  }
}
