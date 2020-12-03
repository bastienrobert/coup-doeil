import { Camera, OGLRenderingContext, Transform, Vec2, Vec3 } from 'ogl'

import { Scene, SceneParams } from '../controllers/SceneController'

import RaycastableMesh from '../core/RaycastableMesh'

import Planes from '../groups/Planes'
import DynamicPlane from '../meshes/DynamicPlane'

import liberty from '~/assets/textures/liberty.png'

interface IntroSceneParams extends SceneParams {
  raycastable: RaycastableMesh[]
}

export default class IntroScene extends Transform implements Scene {
  name = 'intro'

  _gl: OGLRenderingContext
  _resolution: Vec2
  _mouse: Vec3
  _camera: Camera
  _raycastable: RaycastableMesh[]

  _dynamic: DynamicPlane
  _planes: Planes

  constructor(
    gl,
    { resolution, mouse, camera, raycastable }: IntroSceneParams,
  ) {
    super()

    this._gl = gl

    this._resolution = resolution
    this._mouse = mouse
    this._camera = camera
    this._raycastable = raycastable

    this._dynamic = new DynamicPlane(this._gl, {
      mouse: this._mouse,
      camera: this._camera,
      resolution: this._resolution,
      texture: liberty,
      positionOnScreen: { top: 50, left: (1 / 6) * 100 },
    })
    this._raycastable.push(this._dynamic)
    this.addChild(this._dynamic)

    this._planes = new Planes(this._gl, {
      camera: this._camera,
      resolution: this._resolution,
      collides: [this._dynamic],
    })
    this.addChild(this._planes)
  }

  onMouseDown = () => {
    if (this._dynamic.isHit) this._dynamic.isDown.copy(this._mouse)
  }

  onMouseUp = () => {
    this._dynamic.isDown.z = 0
  }

  resize = () => {
    this._planes.resize()
    this._dynamic.resize()
  }

  update = (t) => {
    this._dynamic.update(t)
    this._planes.update()
  }
}
