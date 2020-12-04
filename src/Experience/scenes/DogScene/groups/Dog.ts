import { Camera, Transform, Vec2, Vec3 } from 'ogl'

import StaticPlane from '~/Experience/meshes/StaticPlane'
import { ColliderMesh, OnCollideParams } from '~/Experience/core/CollidableMesh'

import floor from '~/assets/textures/stuffs/floor.png'

import DogObject from '~/Experience/objects/Dog'
import BulbBlack from '~/Experience/objects/BulbBlack'
import BootBlack from '~/Experience/objects/BootBlack'
import ClockBlack from '~/Experience/objects/ClockBlack'
import SwatBlack from '~/Experience/objects/SwatBlack'
import GearsBlack from '~/Experience/objects/GearsBlack'

import { CollidablePlaneParams } from '~/Experience/meshes/CollidablePlane'

interface DogParams extends CollidablePlaneParams {
  onCollide?: OnCollideParams
}

export default class Dog extends Transform {
  _background: StaticPlane
  _camera: Camera
  _resolution: Vec2

  _dog: DogObject
  _bulbBlack: BulbBlack
  _clockBlack: ClockBlack
  _gearsBlack: GearsBlack
  _swatBlack: SwatBlack
  _bootBlack: BootBlack

  constructor(gl, { camera, resolution, colliders, onCollide }: DogParams) {
    super()

    this._camera = camera
    this._resolution = resolution

    this._dog = new DogObject(gl, {
      texture: floor,
      camera,
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
  }

  resize = () => {
    this._dog.resize()
    this._swatBlack.resize()
    this._bootBlack.resize()
    this._gearsBlack.resize()
    this._bulbBlack.resize()
    this._clockBlack.resize()
  }

  update() {
    this._swatBlack.update()
    this._bootBlack.update()
    this._gearsBlack.update()
    this._bulbBlack.update()
    this._clockBlack.update()
  }
}
