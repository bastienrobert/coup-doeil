import { Camera, Transform, Vec2, Vec3 } from 'ogl'

import StaticPlane, { StaticPlaneParams } from '~/Experience/meshes/StaticPlane'
import bottomLeftShelf from '~/assets/textures/stuffs/bottomLeftShelf.png'

import RedBall from '../objects/RedBall'
import Keys from '../objects/Keys'
import Sextoy from '../objects/Sextoy'
import Bat from '../objects/Bat'

import {
  getScaleFromCameraDistance,
  getWorldMatrix,
  getWorldPositionFromViewportRectPerc,
} from '~/utils/maths'

const tmp_vec_3 = new Vec3()

const BG_POSITION = { top: 55, left: 25 }
const BG_SIZE = 0.5

export default class BottomLeftShelf extends Transform {
  _background: StaticPlane
  _camera: Camera
  _resolution: Vec2

  _redBall: RedBall
  _keys: Keys
  _sextoy: Sextoy
  _bat: Bat

  constructor(gl, { camera, resolution }: StaticPlaneParams) {
    super()

    this._camera = camera
    this._resolution = resolution

    this._background = new StaticPlane(gl, {
      texture: bottomLeftShelf,
      camera,
      depthWrite: false,
      depthTest: false,
      resolution,
      transparent: true,
    })
    this.addChild(this._background)

    this._redBall = new RedBall(gl, {
      texture: bottomLeftShelf,
      camera,
      resolution,
      transparent: true,
    })
    this.addChild(this._redBall)

    this._sextoy = new Sextoy(gl, {
      texture: bottomLeftShelf,
      camera,
      resolution,
      transparent: true,
    })
    this.addChild(this._sextoy)

    this._bat = new Bat(gl, {
      texture: bottomLeftShelf,
      camera,
      resolution,
      transparent: true,
    })
    this.addChild(this._bat)

    this._keys = new Keys(gl, {
      texture: bottomLeftShelf,
      camera,
      resolution,
      transparent: true,
    })
    this.addChild(this._keys)
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
    this._background.position.z = 1

    this._redBall.resize()
    this._keys.resize()
    this._sextoy.resize()
    this._bat.resize()
  }
}
