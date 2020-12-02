import { Camera, OGLRenderingContext, Transform, Vec2, Vec3 } from 'ogl'

import { Scene, SceneParams } from '../controllers/SceneController'

export default class IntroScene extends Transform implements Scene {
  name = 'intro'

  _gl: OGLRenderingContext
  _resolution: Vec2
  _mouse: Vec3
  _camera: Camera

  constructor(gl, { resolution, mouse, camera }: SceneParams) {
    super()

    this._gl = gl

    this._resolution = resolution
    this._mouse = mouse
    this._camera = camera
  }
}
