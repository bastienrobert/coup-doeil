import { Camera, Transform, Vec2, Vec3 } from 'ogl'

import StaticPlane from '~/Experience/meshes/StaticPlane'
import {
  ColliderGroup,
  ColliderMesh,
  OnCollideParams,
} from '~/Experience/core/CollidableMesh'
import { DynamicPlaneParams } from '~/Experience/meshes/DynamicPlane'
import RaycastableMesh, {
  RaycastableGroup,
} from '~/Experience/core/RaycastableMesh'

import Bulb from '~/Experience/objects/Bulb'
import Boot from '~/Experience/objects/Boot'
import Clock from '~/Experience/objects/Clock'
import Swat from '~/Experience/objects/Swat'
import Gears from '~/Experience/objects/Gears'

interface FloatingParams extends DynamicPlaneParams {
  onCollide?: OnCollideParams
}

export default class Floating
  extends Transform
  implements RaycastableGroup, ColliderGroup {
  raycastables: RaycastableMesh[]
  colliders: ColliderMesh[]

  _background: StaticPlane
  _camera: Camera
  _resolution: Vec2

  _bulb: Bulb
  _boot: Boot
  _clock: Clock
  _swat: Swat
  _gears: Gears

  constructor(gl, { camera, resolution, mouse, onCollide }: FloatingParams) {
    super()

    this._camera = camera
    this._resolution = resolution
    this.raycastables = []
    this.colliders = []

    this._bulb = new Bulb(gl, {
      sizeOnScreen: 0.06,
      positionOnScreen: { top: 55, left: 10 },
      camera,
      mouse,
      onCollide,
      resolution,
      transparent: true,
    })
    this._bulb.name = 'bulb'
    this.addChild(this._bulb)

    this._boot = new Boot(gl, {
      camera,
      mouse,
      sizeOnScreen: 0.12,
      positionOnScreen: { top: 40, left: 20 },
      onCollide,
      resolution,
      transparent: true,
    })
    this._boot.name = 'boot'
    this.addChild(this._boot)

    this._clock = new Clock(gl, {
      sizeOnScreen: 0.08,
      positionOnScreen: { bottom: 30, left: 15 },
      camera,
      mouse,
      onCollide,
      resolution,
      transparent: true,
    })
    this._clock.name = 'clock'
    this.addChild(this._clock)

    this._swat = new Swat(gl, {
      sizeOnScreen: 0.3,
      positionOnScreen: { top: 15, left: 21 },
      camera,
      mouse,
      onCollide,
      resolution,
      transparent: true,
    })
    this._swat.rotation.z = -Math.PI / 3
    this._swat.name = 'swat'
    this.addChild(this._swat)

    this._gears = new Gears(gl, {
      sizeOnScreen: 0.08,
      positionOnScreen: { bottom: 40, left: 25 },
      camera,
      mouse,
      onCollide,
      resolution,
      transparent: true,
    })
    this._gears.name = 'gears'
    this.addChild(this._gears)

    this.raycastables.push(
      this._bulb,
      this._boot,
      this._clock,
      this._swat,
      this._gears,
    )
    this.colliders.push(
      this._clock,
      this._gears,
      this._boot,
      this._swat,
      this._bulb,
    )
  }

  resize = () => {
    this._swat.resize()
    this._boot.resize()
    this._gears.resize()
    this._bulb.resize()
    this._clock.resize()
  }

  update(t) {
    this._bulb.update(t)
    this._boot.update(t)
    this._clock.update(t)
    this._swat.update(t)
    this._gears.update(t)
  }
}
