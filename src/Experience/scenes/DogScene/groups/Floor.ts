import { Camera, Transform, Vec2, Vec3 } from 'ogl'

import StaticPlane from '~/Experience/meshes/StaticPlane'
import { CollidablePlaneParams } from '~/Experience/meshes/CollidablePlane'
import floor from '~/assets/textures/stuffs/floor.png'

import Dog from '~/Experience/objects/Dog'
import BulbBlack from '~/Experience/objects/BulbBlack'
import BootBlack from '~/Experience/objects/BootBlack'
import ClockBlack from '~/Experience/objects/ClockBlack'
import SwatBlack from '~/Experience/objects/SwatBlack'
import GearsBlack from '~/Experience/objects/GearsBlack'

import Bulb from '~/Experience/objects/Bulb'
import Boot from '~/Experience/objects/Boot'
import Clock from '~/Experience/objects/Clock'
import Swat from '~/Experience/objects/Swat'
import Gears from '~/Experience/objects/Gears'

import {
  getScaleFromCameraDistance,
  getWorldMatrix,
  getWorldPositionFromViewportRectPerc,
} from '~/utils/maths'
import { OnCollideParams } from '~/Experience/core/CollidableMesh'


const tmp_vec_3 = new Vec3()

const BG_POSITION = { top: 60, right: 50 }
const BG_SIZE = 1.0

interface FloorParams extends CollidablePlaneParams {
  onCollide?: OnCollideParams
}

export default class Floor extends Transform {
  _background: StaticPlane
  _camera: Camera
  _resolution: Vec2

  _dog: Dog
  _bulbBlack: BulbBlack
  _clockBlack: ClockBlack
  _gearsBlack: GearsBlack
  _swatBlack: SwatBlack
  _bootBlack: BootBlack

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

    this._dog = new Dog(gl, {
      texture: floor,
      camera,
      colliders,
      onCollide,
      resolution,
      transparent: true,
    })
    this._dog.name = 'dog'
    this.addChild(this._dog)

    this._clockBlack = new ClockBlack(gl, {
      texture: floor,
      camera,
      colliders,
      onCollide,
      resolution,
      transparent: true,
    })
    this._clockBlack.name = 'clockBlack'
    this.addChild(this._clockBlack)

    this._gearsBlack = new GearsBlack(gl, {
      texture: floor,
      camera,
      colliders,
      onCollide,
      resolution,
      transparent: true,
    })
    this._gearsBlack.name = 'gearsBlack'
    this.addChild(this._gearsBlack)

    this._bootBlack = new BootBlack(gl, {
      texture: floor,
      camera,
      colliders,
      onCollide,
      resolution,
      transparent: true,
    })
    this._bootBlack.name = 'bootBlack'
    this.addChild(this._bootBlack)

    this._swatBlack = new SwatBlack(gl, {
      texture: floor,
      camera,
      colliders,
      onCollide,
      resolution,
      transparent: true,
    })
    this._swatBlack.name = 'swatBlack'
    this.addChild(this._swatBlack)

    this._bulbBlack = new BulbBlack(gl, {
      camera,
      colliders,
      onCollide,
      resolution,
      transparent: true,
    })
    this._bulbBlack.name = 'bulbBlack'
    this.addChild(this._bulbBlack)

    this._clock = new Clock(gl, {
      sizeOnScreen: 0.05,
      positionOnScreen: { bottom: 30, left: 20 },
      camera,
      colliders,
      onCollide,
      resolution,
      transparent: true,
    })
    this._clock.rotation.x = Math.PI / 3
    this._clock.name = 'clock'
    this.addChild(this._clock)

    this._gears = new Gears(gl, {
      sizeOnScreen: 0.05,
      positionOnScreen: { bottom: 15, left: 25 },
      camera,
      colliders,
      onCollide,
      resolution,
      transparent: true,
    })
    this._gears.rotation.x = Math.PI / 3
    this._gears.name = 'gears'
    this.addChild(this._gears)

    this._boot = new Boot(gl, {
      camera,
      colliders,
      sizeOnScreen: 0.12,
      positionOnScreen: { top: 50, left: 25 },
      onCollide,
      resolution,
      transparent: true,
    })
    this._boot.rotation.x = Math.PI / 3
    this._boot.rotation.y = Math.PI / 2
    this._boot.name = 'boot'
    this.addChild(this._boot)

    this._swat = new Swat(gl, {
      sizeOnScreen: 0.2,
      positionOnScreen: { bottom: 15, left: 21 },
      camera,
      colliders,
      onCollide,
      resolution,
      transparent: true,
    })
    this._swat.rotation.z = Math.PI / 3
    this._swat.rotation.x = Math.PI / 3
    this._swat.name = 'swat'
    this.addChild(this._swat)

    this._bulb = new Bulb(gl, {
      sizeOnScreen: 0.05,
      positionOnScreen: { top: 45, left: 5 },
      camera,
      colliders,
      onCollide,
      resolution,
      transparent: true,
    })
    this._bulb.rotation.x = Math.PI / 3
    this._bulb.name = 'bulb'
    this.addChild(this._bulb)
  }

  resize = () => {
    getWorldPositionFromViewportRectPerc(
      this._camera,
      BG_POSITION,
      this._resolution,
      this.position,
    )
    getWorldMatrix(this, tmp_vec_3)
    this.position.copy(tmp_vec_3)
    getScaleFromCameraDistance(this._camera, tmp_vec_3, tmp_vec_3)
    this._background.scale.set(tmp_vec_3.x)
    this._background.scale.multiply(BG_SIZE)
    this._background.position.z = 0.3

    this.rotation.x = -Math.PI / 3

    this._swatBlack.resize()
    this._bootBlack.resize()
    this._gearsBlack.resize()
    this._bulbBlack.resize()
    this._clockBlack.resize()

    this._swat.resize()
    this._boot.resize()
    this._gears.resize()
    this._bulb.resize()
    this._clock.resize()
    this._dog.resize()
  }

  update(t) {
    this._swat.update(t)
    this._boot.update(t)
    this._gears.update(t)
    this._bulb.update(t)
    this._clock.update(t)

    this._swatBlack.update()
    this._bootBlack.update()
    this._gearsBlack.update()
    this._bulbBlack.update()
    this._clockBlack.update()
    this._dog.update()
  }

}
