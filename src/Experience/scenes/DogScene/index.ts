import { Camera, OGLRenderingContext, Transform, Vec2, Vec3 } from 'ogl'

import Game from '~/Experience/Game'
import { Scene, SceneParams } from '~/Experience/controllers/SceneController'

import Background from './objects/Background'
import Floor from './groups/Floor'

import RaycastableMesh from '~/Experience/core/RaycastableMesh'

export default class DogScene extends Transform implements Scene {
  name = 'dog'
  raycastable: RaycastableMesh[]

  _gl: OGLRenderingContext
  _game: Game
  _resolution: Vec2
  _mouse: Vec3
  _camera: Camera

  _background: Background
  _floor: Floor

  constructor(gl, { game, resolution, mouse, camera }: SceneParams) {
    super()

    this._gl = gl

    this._game = game
    this._resolution = resolution
    this._mouse = mouse
    this._camera = camera

    this.raycastable = []

    this._background = new Background(gl, { camera, resolution })
    this.addChild(this._background)

    this._floor = new Floor(gl, {
      camera,
      resolution
    })
    this.addChild(this._floor)
  }

  onBeforeEnter = async () => {
    this._game.set('dog')
    return Promise.resolve()
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
  }

  update = (t) => {
    this._floor.update()
  }

  _onCollide = (name) => {
    this._game.push(name)
  }
}
