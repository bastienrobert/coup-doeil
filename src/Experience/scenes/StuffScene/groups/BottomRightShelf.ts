import { Camera, Transform, Vec2, Vec3 } from 'ogl'

import StaticPlane, { StaticPlaneParams } from '~/Experience/meshes/StaticPlane'
import bottomRightShelf from '~/assets/textures/stuffs/bottomRightShelf.png'

import Gears from '../objects/Gears'
import PurpleBall from '../objects/PurpleBall'

import {
  getScaleFromCameraDistance,
  getWorldMatrix,
  getWorldPositionFromViewportRectPerc,
} from '~/utils/maths'

const tmp_vec_3 = new Vec3()

const BG_POSITION = { top: 60, right: 17 }
const BG_SIZE = 0.25

export default class BottomRightShelf extends Transform {
  _background: StaticPlane
  _camera: Camera
  _resolution: Vec2

  _gears: Gears
  _purpleBall: PurpleBall

  constructor(gl, { camera, resolution }: StaticPlaneParams) {
    super()

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
      texture: bottomRightShelf,
      camera,
      resolution,
      transparent: true,
    })
    this.addChild(this._gears)

    this._purpleBall = new PurpleBall(gl, {
      texture: bottomRightShelf,
      camera,
      resolution,
      transparent: true,
    })
    this.addChild(this._purpleBall)

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
}
