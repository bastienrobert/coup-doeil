import { Camera, OGLRenderingContext, Transform, Vec2, Vec3 } from 'ogl'

import { Scene, SceneParams } from '../../controllers/SceneController'

import RaycastableMesh from '../../core/RaycastableMesh'

import DynamicPlane from '../../meshes/DynamicPlane'

import Background from './objects/Background'
import Floor from './objects/Floor'
import TopLeftShelf from './groups/TopLeftShelf'
import TopRightShelf from './groups/TopRightShelf'
import MiddleShelf from './groups/MiddleShelf'
import BottomRightShelf from './groups/BottomRightShelf'
import BottomLeftShelf from './groups/BottomLeftShelf'

import gui from '../../gui'

export default class StuffScene extends Transform implements Scene {
  name = 'stuff'

  _gl: OGLRenderingContext
  _resolution: Vec2
  _mouse: Vec3
  _camera: Camera
  _raycastable: RaycastableMesh[]

  _dynamic: DynamicPlane

  _background: Background
  _floor: Floor
  _topLeftShelf: TopLeftShelf
  _middleShelf: MiddleShelf
  _bottomRightShelf: BottomRightShelf
  _bottomLeftShelf: BottomLeftShelf
  _topRightShelf: TopRightShelf

  constructor(gl, { resolution, mouse, camera }: SceneParams) {
    super()

    this._gl = gl

    this._resolution = resolution
    this._mouse = mouse
    this._camera = camera
    // this._raycastable = raycastable

    this._background = new Background(gl, { camera, resolution })
    this.addChild(this._background)

    this._floor = new Floor(gl, { camera, resolution })
    this.addChild(this._floor)

    this._topLeftShelf = new TopLeftShelf(gl, { camera, resolution })
    this.addChild(this._topLeftShelf)

    this._middleShelf = new MiddleShelf(gl, { camera, resolution })
    this.addChild(this._middleShelf)

    this._bottomRightShelf = new BottomRightShelf(gl, { camera, resolution })
    this.addChild(this._bottomRightShelf)

    this._bottomLeftShelf = new BottomLeftShelf(gl, { camera, resolution })
    this.addChild(this._bottomLeftShelf)

    this._topRightShelf = new TopRightShelf(gl, { camera, resolution })
    this.addChild(this._topRightShelf)

    // this._raycastable.push(this._dynamic)
    // this.addChild(this._dynamic)

    this._initGUI()
  }

  onMouseDown = () => {
    // if (this._dynamic.isHit) this._dynamic.isDown.copy(this._mouse)
  }

  onMouseUp = () => {
    // this._dynamic.isDown.z = 0
  }

  resize = () => {
    this._background.resize()
    this._floor.resize()
    this._topLeftShelf.resize()
    this._middleShelf.resize()
    this._bottomRightShelf.resize()
    this._bottomLeftShelf.resize()
    this._topRightShelf.resize()
    // this._dynamic.resize()
  }

  update = (t) => {
    // this._dynamic.update(t)
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