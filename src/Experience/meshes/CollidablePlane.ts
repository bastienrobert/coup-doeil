import {
  Plane as OGLPlane,
  Camera,
  OGLRenderingContext,
  Program,
  Vec2,
  TextureLoader,
  Vec3,
  ProgramOptions,
} from 'ogl'

import CollidableMesh, {
  ColliderMesh,
  OnCollideParams,
} from '../core/CollidableMesh'

import vertex from '~/shaders/collidable/vertex.glsl'
import fragment from '~/shaders/collidable/fragment.glsl'

import {
  getWorldMatrix,
  getWorldPositionFromViewportRectPerc,
  Rect,
} from '~/utils/maths'
import {
  applyMatrix4,
  box,
  cloneBox,
  getIsIntersectedBoundingBox,
} from '~/utils/box'

const tmp_vec_3 = new Vec3()
const tmp_bounds = box()
const tmp_bounds_2 = box()

const WIDTH = 1
const HEIGHT = 1

export interface CollidablePlaneParams extends Partial<ProgramOptions> {
  camera: Camera
  resolution: Vec2
  texture?: string
  onCollide?: OnCollideParams
  colliders?: ColliderMesh[]
  positionOnScreen?: Rect
}

export default class CollidablePlane extends CollidableMesh {
  _gl: OGLRenderingContext
  _camera: Camera
  _resolution: Vec2
  _positionOnScreen: Rect
  _colliders: ColliderMesh[]
  _onCollide: OnCollideParams

  isCollide: boolean

  constructor(
    gl,
    {
      texture,
      camera,
      resolution,
      positionOnScreen,
      colliders = [],
      onCollide,
      transparent,
      ...program
    }: CollidablePlaneParams,
  ) {
    super(gl, {
      geometry: new OGLPlane(gl, { width: WIDTH, height: HEIGHT }),
      program: new Program(gl, {
        ...program,
        vertex,
        fragment,
        transparent,
        uniforms: {
          uTexture: {
            value: TextureLoader.load(gl, {
              src: texture,
              generateMipmaps: false,
            }),
          },
          uCollide: { value: 0 },
        },
      }),
    })

    this._gl = gl

    this._colliders = colliders
    this._onCollide = onCollide
    this._camera = camera
    this._resolution = resolution
    this._positionOnScreen = positionOnScreen

    this.isCollide = false

    this.onBeforeRender(this._updateCollideUniform)
  }

  _updateCollideUniform = () => {
    this.program.uniforms.uCollide.value = this.isCollide ? 1 : 0
  }

  get width() {
    return WIDTH * 0.5 * this.scale.x
  }

  get height() {
    return HEIGHT * 0.5 * this.scale.y
  }

  resize() {
    tmp_vec_3.set(0, 0, 0)
    getWorldPositionFromViewportRectPerc(
      this._camera,
      this._positionOnScreen,
      this._resolution,
      this.position,
    )
    getWorldMatrix(this, tmp_vec_3)
  }

  update() {
    cloneBox(this.geometry.bounds, tmp_bounds)
    applyMatrix4(tmp_bounds, this.worldMatrix)

    this._colliders.forEach((mesh: ColliderMesh) => {
      cloneBox(mesh.geometry.bounds, tmp_bounds_2)
      applyMatrix4(tmp_bounds_2, mesh.worldMatrix)

      if (getIsIntersectedBoundingBox(tmp_bounds, tmp_bounds_2)) {
        if (this._onCollide) this._onCollide(this.name, mesh.name)
        mesh.isInCollision(this)
      }
    })
  }
}
