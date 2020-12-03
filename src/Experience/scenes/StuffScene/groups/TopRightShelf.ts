import { Camera, Transform, Vec2, Vec3 } from 'ogl'

import StaticPlane from '~/Experience/meshes/StaticPlane'
import RaycastableMesh, {
  RaycastableGroup,
} from '~/Experience/core/RaycastableMesh'
import { ColliderGroup, ColliderMesh } from '~/Experience/core/CollidableMesh'
import { DynamicPlaneParams } from '~/Experience/meshes/DynamicPlane'
import topRightShelf from '~/assets/textures/stuffs/topRightShelf.png'

import Bolt from '../objects/Bolt'
import Clock from '../objects/Clock'
import Pan from '../objects/Pan'

import {
  getScaleFromCameraDistance,
  getWorldMatrix,
  getWorldPositionFromViewportRectPerc,
} from '~/utils/maths'

const tmp_vec_3 = new Vec3()

const BG_POSITION = { top: 20, right: 10 }
const BG_SIZE = 0.35

export default class TopRightShelf
  extends Transform
  implements RaycastableGroup, ColliderGroup {
  raycastables: RaycastableMesh[]
  colliders: ColliderMesh[]

  _background: StaticPlane
  _camera: Camera
  _resolution: Vec2

  _clock: Clock
  _bolt: Bolt
  _pan: Pan

  constructor(gl, { camera, resolution, mouse }: DynamicPlaneParams) {
    super()

    this.raycastables = []
    this.colliders = []

    this._camera = camera
    this._resolution = resolution

    this._background = new StaticPlane(gl, {
      texture: topRightShelf,
      camera,
      depthWrite: false,
      depthTest: false,
      resolution,
      transparent: true,
    })
    this.addChild(this._background)

    this._clock = new Clock(gl, {
      texture: topRightShelf,
      camera,
      mouse,
      resolution,
      transparent: true,
    })
    this._clock.name = 'clock'
    this.addChild(this._clock)

    this._bolt = new Bolt(gl, {
      texture: topRightShelf,
      camera,
      mouse,
      resolution,
      transparent: true,
    })
    this._bolt.name = 'bolt'
    this.addChild(this._bolt)

    this._pan = new Pan(gl, {
      texture: topRightShelf,
      camera,
      mouse,
      resolution,
      transparent: true,
    })
    this._pan.name = 'pan'
    this.addChild(this._pan)

    this.raycastables.push(this._clock, this._bolt, this._pan)
    this.colliders.push(this._clock, this._bolt, this._pan)
  }

  resize = () => {
    getWorldPositionFromViewportRectPerc(
      this._camera,
      BG_POSITION,
      this._resolution,
      this._background.position,
    )
    getWorldMatrix(this._background, tmp_vec_3)
    // tmp_vec_3.z = 0
    getScaleFromCameraDistance(this._camera, tmp_vec_3, tmp_vec_3)
    this._background.scale.set(tmp_vec_3.x)
    this._background.scale.multiply(BG_SIZE)
    this._background.position.z = 0.5

    this._pan.resize()
    this._bolt.resize()
    this._clock.resize()
  }

  update(t) {
    this._pan.update(t)
    this._bolt.update(t)
    this._clock.update(t)
  }
}
