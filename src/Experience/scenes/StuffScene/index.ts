import { Camera, OGLRenderingContext, Transform, Vec2, Vec3 } from 'ogl'

import { Scene, SceneParams } from '../../controllers/SceneController'

import RaycastableMesh from '../../core/RaycastableMesh'

import DynamicPlane from '../../meshes/DynamicPlane'
import Background from './Background'
import Floor from './Floor'

import gui, { newGUIScreenTransform } from '../../gui'
import StaticPlane from '~/Experience/meshes/StaticPlane'

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

    this._initBottomLeftShelf()
    this._initTopLeftShelf()
    this._initBottomRightShelf()
    this._initTopRightShelf()

    // this._raycastable.push(this._dynamic)
    // this.addChild(this._dynamic)

    this._initGUI()
  }

  _initFloor = () => {}

  _initBottomLeftShelf = () => {}

  _initTopLeftShelf = () => {}

  _initBottomRightShelf = () => {}

  _initTopRightShelf = () => {}

  onMouseDown = () => {
    // if (this._dynamic.isHit) this._dynamic.isDown.copy(this._mouse)
  }

  onMouseUp = () => {
    // this._dynamic.isDown.z = 0
  }

  resize = () => {
    this._background.resize()
    this._floor.resize()
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
