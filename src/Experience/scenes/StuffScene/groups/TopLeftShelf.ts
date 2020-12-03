import { Camera, Transform, Vec2, Vec3 } from 'ogl'

import StaticPlane, { StaticPlaneParams } from '~/Experience/meshes/StaticPlane'
import topLeftShelf from '~/assets/textures/stuffs/topLeftShelf.png'

import Boot from '../objects/Boot'
import Bone from '../objects/Bone'

import {
  getScaleFromCameraDistance,
  getWorldMatrix,
  getWorldPositionFromViewportRectPerc,
} from '~/utils/maths'

const tmp_vec_3 = new Vec3()

const BG_POSITION = { top: 30, left: 7 }
const BG_SIZE = 0.7

export default class TopLeftShelf extends Transform {
  _background: StaticPlane
  _camera: Camera
  _resolution: Vec2

  _boot: Boot
  _bone: Bone

  constructor(gl, { camera, resolution }: StaticPlaneParams) {
    super()

    this._camera = camera
    this._resolution = resolution

    this._background = new StaticPlane(gl, {
      texture: topLeftShelf,
      camera,
      resolution,
      transparent: true,
    })
    this.addChild(this._background)

    this._boot = new Boot(gl, {
      texture: topLeftShelf,
      camera,
      resolution,
      transparent: true,
    })
    this.addChild(this._boot)

    this._bone = new Bone(gl, {
      texture: topLeftShelf,
      camera,
      resolution,
      transparent: true,
    })
    this.addChild(this._bone)
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
    this._background.position.z = 0.1

    this._boot.resize()
    this._bone.resize()
  }
}
