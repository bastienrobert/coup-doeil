import { Camera, Transform, Vec2, Vec3 } from 'ogl'

import StaticPlane from '~/Experience/meshes/StaticPlane'
import RaycastableMesh, {
  RaycastableGroup,
} from '~/Experience/core/RaycastableMesh'
import { ColliderGroup, ColliderMesh } from '~/Experience/core/CollidableMesh'
import { DynamicPlaneParamsWithColliderCallback } from '~/Experience/meshes/DynamicPlane'
import middleShelf from '~/assets/textures/stuffs/middleShelf.png'

import Bottle from '~/Experience/objects/Bottle'
import Swat from '~/Experience/objects/Swat'
import Bulb from '~/Experience/objects/Bulb'

import {
  getScaleFromCameraDistance,
  getWorldMatrix,
  getWorldPositionFromViewportRectPerc,
} from '~/utils/maths'

const tmp_vec_3 = new Vec3()

const BG_POSITION = { top: 40, left: 60 }
const BG_SIZE = 0.6

export default class MiddleShelf
  extends Transform
  implements RaycastableGroup, ColliderGroup {
  raycastables: RaycastableMesh[]
  colliders: ColliderMesh[]

  _background: StaticPlane
  _camera: Camera
  _resolution: Vec2

  _bottle: Bottle
  _swat: Swat
  _bulb: Bulb

  constructor(
    gl,
    {
      camera,
      resolution,
      mouse,
      onCollide,
    }: DynamicPlaneParamsWithColliderCallback,
  ) {
    super()

    this._camera = camera
    this._resolution = resolution
    this.raycastables = []
    this.colliders = []

    this._background = new StaticPlane(gl, {
      texture: middleShelf,
      camera,
      resolution,
      depthWrite: false,
      transparent: true,
    })
    this.addChild(this._background)

    this._bottle = new Bottle(gl, {
      texture: middleShelf,
      camera,
      mouse,
      positionOnScreen: { top: 53, left: 54 },
      sizeOnScreen: 0.3,
      resolution,
      transparent: true,
    })
    this._bottle.name = 'bottle'
    this.addChild(this._bottle)

    this._swat = new Swat(gl, {
      texture: middleShelf,
      camera,
      mouse,
      positionOnScreen: { top: 52, left: 65 },
      sizeOnScreen: 0.3,
      resolution,
      transparent: true,
      onCollide,
    })
    this._swat.name = 'swat'
    this.addChild(this._swat)

    this._bulb = new Bulb(gl, {
      texture: middleShelf,
      camera,
      mouse,
      positionOnScreen: { top: 63, left: 60 },
      sizeOnScreen: 0.12,
      resolution,
      transparent: true,
      onCollide,
    })
    this._bulb.name = 'bulb'
    this.addChild(this._bulb)

    this.raycastables.push(this._bottle, this._swat, this._bulb)
    this.colliders.push(this._swat, this._bulb)
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
    this._background.position.z = 0.3

    this._bottle.resize()
    this._swat.resize()
    this._bulb.resize()
  }

  update(t) {
    this._bottle.update(t)
    this._swat.update(t)
    this._bulb.update(t)
  }
}
