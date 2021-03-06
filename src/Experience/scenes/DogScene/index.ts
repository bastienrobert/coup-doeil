import { Camera, OGLRenderingContext, Transform, Vec2, Vec3 } from 'ogl'

import Game from '~/Experience/Game'
import { Scene, SceneParams } from '~/Experience/controllers/SceneController'
import RaycastableMesh from '~/Experience/core/RaycastableMesh'
import Spot from '~/Experience/pass/Spot'

import Background from './objects/Background'
import Floor from './objects/Floor'
import Floating from './groups/Floating'
import Dog from './groups/Dog'

import spots from '~/Experience/pass/spots.json'

interface DogSceneParams extends SceneParams {
  spot: Spot
}

export default class DogScene extends Transform implements Scene {
  name = 'dog'
  raycastable: RaycastableMesh[]

  _gl: OGLRenderingContext
  _game: Game
  _spot: Spot
  _resolution: Vec2
  _mouse: Vec3
  _camera: Camera

  _background: Background
  _floor: Floor
  _dog: Dog
  _floating: Floating

  constructor(gl, { game, resolution, mouse, camera, spot }: DogSceneParams) {
    super()

    this._gl = gl

    this._game = game
    this._resolution = resolution
    this._mouse = mouse
    this._camera = camera
    this._spot = spot

    this.raycastable = []

    this._background = new Background(gl, { camera, resolution })
    this.addChild(this._background)

    this._floor = new Floor(gl, {
      camera,
      resolution,
    })
    this.addChild(this._floor)

    this._floating = new Floating(gl, {
      camera,
      resolution,
      onCollide: this._onCollide,
      mouse,
    })
    this.addChild(this._floating)

    this._dog = new Dog(gl, {
      camera,
      resolution,
      colliders: [...this._floating.colliders],
    })
    this.addChild(this._dog)

    this.raycastable.push(...this._floating.raycastables)
  }

  onBeforeEnter = async () => {
    this._spot.set({ data: spots.dog })
    this._game.set('dog')
    return
  }

  onLeave = async () => {
    return this._spot.transite('WHITE')
  }

  onMouseDown = () => {
    this.raycastable.forEach((m) => {
      if (m.isHit) m.isDown.copy(this._mouse)
    })
  }

  onMouseUp = () => {
    this.raycastable.forEach((m) => {
      m.isDown.z = 0
    })
  }

  resize = () => {
    this._background.resize()
    this._floor.resize()
    this._dog.resize()
    this._floating.resize()
  }

  update = (t) => {
    this._floating.update(t)
    this._dog.update()
  }

  _onCollide = (name) => {
    this._game.push(name)
  }
}
