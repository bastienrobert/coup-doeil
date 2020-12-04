import { Camera, OGLRenderingContext, Transform, Vec2, Vec3 } from 'ogl'

import Game from '~/Experience/Game'
import Spot from '~/Experience/pass/Spot'
import { Scene, SceneParams } from '~/Experience/controllers/SceneController'

import RaycastableMesh from '~/Experience/core/RaycastableMesh'

import Background from './objects/Background'
import Floor from './groups/Floor'
import TopLeftShelf from './groups/TopLeftShelf'
import TopRightShelf from './groups/TopRightShelf'
import MiddleShelf from './groups/MiddleShelf'
import BottomRightShelf from './groups/BottomRightShelf'
import BottomLeftShelf from './groups/BottomLeftShelf'

import gui from '~/Experience/gui'
import spots from '~/Experience/pass/spots.json'

interface StuffSceneParams extends SceneParams {
  spot: Spot
}

export default class StuffScene extends Transform implements Scene {
  name = 'stuff'
  raycastable: RaycastableMesh[]

  _gl: OGLRenderingContext
  _game: Game
  _spot: Spot
  _resolution: Vec2
  _mouse: Vec3
  _camera: Camera

  _background: Background
  _floor: Floor
  _topLeftShelf: TopLeftShelf
  _middleShelf: MiddleShelf
  _bottomRightShelf: BottomRightShelf
  _bottomLeftShelf: BottomLeftShelf
  _topRightShelf: TopRightShelf

  constructor(gl, { game, resolution, mouse, camera, spot }: StuffSceneParams) {
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

    this._topLeftShelf = new TopLeftShelf(gl, {
      camera,
      resolution,
      mouse,
      onCollide: this._onCollide,
    })
    this.addChild(this._topLeftShelf)

    this._middleShelf = new MiddleShelf(gl, {
      camera,
      resolution,
      mouse,
      onCollide: this._onCollide,
    })
    this.addChild(this._middleShelf)

    this._bottomRightShelf = new BottomRightShelf(gl, {
      camera,
      resolution,
      mouse,
      onCollide: this._onCollide,
    })
    this.addChild(this._bottomRightShelf)

    this._bottomLeftShelf = new BottomLeftShelf(gl, {
      camera,
      resolution,
      mouse,
    })
    this.addChild(this._bottomLeftShelf)

    this._topRightShelf = new TopRightShelf(gl, {
      camera,
      resolution,
      mouse,
      onCollide: this._onCollide,
    })
    this.addChild(this._topRightShelf)

    this._floor = new Floor(gl, {
      camera,
      resolution,
      colliders: [
        ...this._topLeftShelf.colliders,
        ...this._middleShelf.colliders,
        ...this._bottomRightShelf.colliders,
        ...this._bottomLeftShelf.colliders,
        ...this._topRightShelf.colliders,
      ],
    })
    this.addChild(this._floor)

    this.raycastable.push(
      ...this._topLeftShelf.raycastables,
      ...this._middleShelf.raycastables,
      ...this._bottomRightShelf.raycastables,
      ...this._bottomLeftShelf.raycastables,
      ...this._topRightShelf.raycastables,
    )

    this._initGUI()
  }

  onEnter = async () => {
    this._game.set('stuff')
    this._spot.set({ data: spots.stuff })
  }

  onLeave = async () => {
    return this._spot.transite('BLACK')
  }

  onMouseDown = () => {
    this.raycastable.forEach((m) => {
      if (m.isHit) {
        m.isDown.copy(this._mouse)
        if (m.onMouseDown) m.onMouseDown()
      }
    })
  }

  onMouseUp = () => {
    this.raycastable.forEach((m) => {
      m.isDown.z = 0
    })
  }

  resize = () => {
    this._floor.resize()
    this._background.resize()
    this._topLeftShelf.resize()
    this._middleShelf.resize()
    this._bottomRightShelf.resize()
    this._bottomLeftShelf.resize()
    this._topRightShelf.resize()
  }

  update = (t) => {
    this._topLeftShelf.update(t)
    this._middleShelf.update(t)
    this._bottomRightShelf.update(t)
    this._bottomLeftShelf.update(t)
    this._topRightShelf.update(t)

    this._floor.update()
  }

  _onCollide = (name) => {
    this._game.push(name)
  }

  _initGUI() {
    const c = gui.addFolder('stuff')
    // newGUIScreenTransform(
    //   'dynamic',
    //   this._dynamic,
    //   this._camera,
    //   this._resolution,
    //   c,
    // )
  }
}
