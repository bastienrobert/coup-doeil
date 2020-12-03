import { Camera, Transform, Vec2, Vec3 } from 'ogl'

import StaticPlane from '~/Experience/meshes/StaticPlane'
import { CollidablePlaneParams } from '~/Experience/meshes/CollidablePlane'
import floor from '~/assets/textures/stuffs/floor.png'

import Bulb from '../objects/BulbShadow'
import Clock from '../objects/ClockShadow'
import Swat from '../objects/SwatShadow'
import Gears from '../objects/GearsShadow'
import Boot from '../objects/BootShadow'

import {
  getScaleFromCameraDistance,
  getWorldMatrix,
  getWorldPositionFromViewportRectPerc,
} from '~/utils/maths'
import { OnCollideParams } from '~/Experience/core/CollidableMesh'

const tmp_vec_3 = new Vec3()

const BG_POSITION = { top: 80, right: 50 }
const BG_SIZE = 1.2

interface FloorParams extends CollidablePlaneParams {
  onCollide?: OnCollideParams
}

export default class Floor extends Transform {
  _background: StaticPlane
  _camera: Camera
  _resolution: Vec2

  _bulb: Bulb
  _clock: Clock
  _gears: Gears
  _swat: Swat
  _boot: Boot

  constructor(gl, { camera, resolution, colliders, onCollide }: FloorParams) {
    super()

    this._camera = camera
    this._resolution = resolution

    this._background = new StaticPlane(gl, {
      texture: floor,
      camera,
      resolution,
      transparent: true,
    })
    this.addChild(this._background)

    this._clock = new Clock(gl, {
      texture: floor,
      camera,
      colliders,
      onCollide,
      resolution,
      transparent: true,
    })
    this._clock.name = 'clockShadow'
    this.addChild(this._clock)

    this._gears = new Gears(gl, {
      texture: floor,
      camera,
      colliders,
      onCollide,
      resolution,
      transparent: true,
    })
    this._gears.name = 'gearsShadow'
    this.addChild(this._gears)

    this._boot = new Boot(gl, {
      texture: floor,
      camera,
      colliders,
      onCollide,
      resolution,
      transparent: true,
    })
    this._boot.name = 'bootShadow'
    this.addChild(this._boot)

    this._swat = new Swat(gl, {
      texture: floor,
      camera,
      colliders,
      onCollide,
      resolution,
      transparent: true,
    })
    this._swat.name = 'swatShadow'
    this.addChild(this._swat)

    this._bulb = new Bulb(gl, {
      texture: floor,
      camera,
      colliders,
      onCollide,
      resolution,
      transparent: true,
    })
    this._bulb.name = 'bulbShadow'
    this.addChild(this._bulb)
  }

  resize = () => {
    getWorldPositionFromViewportRectPerc(
      this._camera,
      BG_POSITION,
      this._resolution,
      this._background.position,
    )
    getWorldMatrix(this._background, tmp_vec_3)
    this.position.copy(tmp_vec_3)
    getScaleFromCameraDistance(this._camera, tmp_vec_3, tmp_vec_3)
    this._background.scale.set(tmp_vec_3.x)
    this._background.scale.multiply(BG_SIZE)
    this._background.position.z = 0.2

    this.rotation.x = -Math.PI / 3

    this._swat.resize()
    this._boot.resize()
    this._gears.resize()
    this._bulb.resize()
    this._clock.resize()
  }

  update = () => {
    this._swat.update()
    this._boot.update()
    this._gears.update()
    this._bulb.update()
    this._clock.update()
  }
}
