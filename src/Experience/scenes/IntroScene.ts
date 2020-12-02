import { Camera, OGLRenderingContext, Transform, Vec2, Vec3 } from 'ogl'
import {
  applyMatrix4,
  box,
  cloneBox,
  getIsIntersectedBoundingBox,
} from '~/utils/box'

import { Scene, SceneParams } from '../controllers/SceneController'

import RaycastableMesh from '../core/RaycastableMesh'

import Planes from '../groups/Planes'
import Cube from '../meshes/Cube'

interface IntroSceneParams extends SceneParams {
  raycastable: RaycastableMesh[]
}

const tmp_cube_bound = box()

export default class IntroScene extends Transform implements Scene {
  name = 'intro'

  _gl: OGLRenderingContext
  _resolution: Vec2
  _mouse: Vec3
  _camera: Camera
  _raycastable: RaycastableMesh[]

  _cube: Cube
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

    this._cube = new Cube(this._gl, {
      mouse: this._mouse,
      camera: this._camera,
      resolution: this._resolution,
    })
    this._raycastable.push(this._cube)
    this.addChild(this._cube)
    console.log(this._cube)

    this._planes = new Planes(this._gl, {
      camera: this._camera,
      resolution: this._resolution,
    })
    this.addChild(this._planes)
  }

  onMouseDown = () => {
    if (this._cube.isHit) this._cube.isDown.copy(this._mouse)
  }

  onMouseUp = () => {
    this._cube.isDown.z = 0
  }

  resize = () => {
    this._planes.resize()
    this._cube.resize()
  }

  update = (t) => {
    this._cube.update(t)
    this._planes.update()

    // check collisions
    cloneBox(this._cube.geometry.bounds, tmp_cube_bound)
    applyMatrix4(tmp_cube_bound, this._cube.worldMatrix)
    this._planes.alpha.isCollide = getIsIntersectedBoundingBox(
      this._planes.bounds.alpha,
      tmp_cube_bound,
    )
    this._planes.beta.isCollide = getIsIntersectedBoundingBox(
      this._planes.bounds.beta,
      tmp_cube_bound,
    )
  }
}
