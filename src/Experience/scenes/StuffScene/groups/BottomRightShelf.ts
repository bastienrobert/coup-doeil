import { Camera, Transform, Vec2, Vec3 } from 'ogl'

import StaticPlane from '~/Experience/meshes/StaticPlane'
import RaycastableMesh, {
  RaycastableGroup,
} from '~/Experience/core/RaycastableMesh'
import { ColliderGroup, ColliderMesh } from '~/Experience/core/CollidableMesh'
import { DynamicPlaneParamsWithColliderCallback } from '~/Experience/meshes/DynamicPlane'
import bottomRightShelf from '~/assets/textures/stuffs/bottomRightShelf.png'

import Gears from '~/Experience/objects/Gears'
import PurpleBall from '~/Experience/objects/PurpleBall'

import {
  getScaleFromCameraDistance,
  getWorldMatrix,
  getWorldPositionFromViewportRectPerc,
} from '~/utils/maths'

const tmp_vec_3 = new Vec3()

const BG_POSITION = { top: 60, right: 17 }
const BG_SIZE = 0.25

export default class BottomRightShelf
  extends Transform
  implements RaycastableGroup, ColliderGroup {
  raycastables: RaycastableMesh[]
  colliders: ColliderMesh[]

  _background: StaticPlane
  _camera: Camera
  _resolution: Vec2

  _gears: Gears
  _purpleBall: PurpleBall

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

    this.raycastables = []
    this.colliders = []

    this._camera = camera
    this._resolution = resolution

    this._background = new StaticPlane(gl, {
      texture: bottomRightShelf,
      camera,
      resolution,
      depthWrite: false,
      depthTest: false,
      transparent: true,
    })
    this.addChild(this._background)

    this._gears = new Gears(gl, {
      camera,
      mouse,
      sizeOnScreen: 0.12,
      positionOnScreen: { top: 65, left: 85 },
      resolution,
      transparent: true,
      onCollide,
    })
    this._gears.name = 'gears'
    this.addChild(this._gears)

    this._purpleBall = new PurpleBall(gl, {
      camera,
      mouse,
      sizeOnScreen: 0.12,
      positionOnScreen: { top: 63, left: 79 },
      resolution,
      transparent: true,
    })
    this._purpleBall.name = 'purpleBall'
    this.addChild(this._purpleBall)

    this.raycastables.push(this._gears, this._purpleBall)
    this.colliders.push(this._gears, this._purpleBall)
  }

  resize = () => {
    getWorldPositionFromViewportRectPerc(
      this._camera,
      BG_POSITION,
      this._resolution,
      tmp_vec_3,
    )
    this._background.position.copy(tmp_vec_3)
    getWorldMatrix(this._background, tmp_vec_3)
    // tmp_vec_3.z = 0
    getScaleFromCameraDistance(this._camera, tmp_vec_3, tmp_vec_3)
    this._background.scale.set(tmp_vec_3.x)
    this._background.scale.multiply(BG_SIZE)
    this._background.position.z = 0.4

    this._gears.resize()
    this._purpleBall.resize()
  }

  update(t) {
    this._gears.update(t)
    this._purpleBall.update(t)
  }
}
