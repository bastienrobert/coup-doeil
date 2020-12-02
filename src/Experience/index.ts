import {
  Camera,
  Renderer,
  OGLRenderingContext,
  Transform,
  Orbit,
  Vec3,
  Vec2,
  Raycast,
} from 'ogl'
import Stats from 'stats.js'

import RaycastableMesh from './core/RaycastableMesh'
import Planes from './groups/Planes'
import Cube from './meshes/Cube'

import {
  getResolutionNormalizedCoords,
  getScaleFromCameraDistance,
  getWorldMatrix,
  getWorldPositionFromViewportRectPerc,
} from '~/utils/maths'
import {
  applyMatrix4,
  box,
  cloneBox,
  getIsIntersectedBoundingBox,
} from '~/utils/box'

const IS_TOUCHABLE = 'ontouchstart' in window

const tmp_vec_3 = new Vec3()
const tmp_cube_bound = box()

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

export default class Experience extends Transform {
  renderer: Renderer
  _gl: OGLRenderingContext
  _rafID: number

  _camera: Camera
  _controls: Orbit
  _resolution: Vec2
  _mouse: Vec3
  _mouseNorm: Vec3
  _raycast: Raycast
  _raycastable: RaycastableMesh[]
  _cube: Cube
  _planes: Planes

  constructor(renderer: Renderer) {
    super()

    this.renderer = renderer
    this._gl = renderer.gl
    this._gl.clearColor(1, 1, 1, 1)

    this._camera = new Camera(this._gl, { aspect: 45 })
    this._camera.position.set(0, 0, 7)
    this._camera.lookAt([0, 0, 0])

    this._controls = new Orbit(this._camera)
    this._controls.enabled = false

    this._resolution = new Vec2()
    this._mouse = new Vec3()
    this._mouseNorm = new Vec3()
    this._listen()

    this._raycast = new Raycast(this._gl)
    this._raycastable = []

    this._cube = new Cube(this._gl, {
      mouse: this._mouseNorm,
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

    this._rafID = requestAnimationFrame(this._render)
  }

  _listen() {
    document.addEventListener('mousedown', this._onMouseDown)
    document.addEventListener('mousemove', this._onMouseMove)
    document.addEventListener('mouseup', this._onMouseUp)
    document.addEventListener('touchstart', this._onTouchStart)
    document.addEventListener('touchmove', this._onTouchMove)
    document.addEventListener('touchend', this._onMouseUp)
  }

  _unlisten() {
    document.removeEventListener('mousedown', this._onMouseDown)
    document.removeEventListener('mousemove', this._onMouseMove)
    document.removeEventListener('mouseup', this._onMouseUp)
    document.removeEventListener('touchstart', this._onTouchStart)
    document.removeEventListener('touchmove', this._onTouchMove)
    document.removeEventListener('touchend', this._onMouseUp)
  }

  _onMouseDown = (e: MouseEvent | Touch) => {
    this._mouse.z = 1
    this._mouseNorm.z = 1
    if (this._cube.isHit) this._cube.isDown.copy(this._mouseNorm)
  }

  _onTouchStart = (e: TouchEvent) => {
    this._onMouseDown(e.touches[0])
  }

  _onMouseMove = (e: MouseEvent | Touch) => {
    this._mouse.set(e.clientX, e.clientY, this._mouse.z)
    getResolutionNormalizedCoords(
      this._mouse,
      this._resolution,
      this._mouseNorm,
    )
    if (IS_TOUCHABLE) {
      this.rotation.set(this._mouseNorm.x * 0.1, this._mouseNorm.y * 0.1, 0)
    }
  }

  _onTouchMove = (e: TouchEvent) => {
    this._onMouseMove(e.touches[0])
  }

  _onMouseUp = () => {
    this._mouse.z = 0
    this._cube.isDown.z = 0
  }

  dispose() {
    if (this._rafID) cancelAnimationFrame(this._rafID)
    // DISPOSABLE ELEMENTS HERE (eg. REMOVE LISTENERS)
    this._unlisten()
  }

  resize = () => {
    this._resolution.set(
      this.renderer.gl.canvas.width,
      this.renderer.gl.canvas.height,
    )
    this._camera.perspective({
      aspect: this._resolution.x / this._resolution.y,
    })
    this._camera.updateMatrixWorld()

    this._planes.resize()
    this._cube.resize()
  }

  _render = (t) => {
    stats.begin()
    const time = t * 0.001
    this._controls.update()

    this._raycastable.forEach((mesh: RaycastableMesh) => (mesh.isHit = false))
    this._raycast.castMouse(this._camera, this._mouseNorm)
    const hits = this._raycast.intersectBounds(this._raycastable)
    hits.forEach((mesh: RaycastableMesh) => (mesh.isHit = true))

    this._cube.update(time)
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

    this.renderer.render({ scene: this, camera: this._camera })
    stats.end()

    this._rafID = requestAnimationFrame(this._render)
  }
}
