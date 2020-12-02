import {
  Camera,
  Renderer,
  OGLRenderingContext,
  Transform,
  Orbit,
  Vec3,
  Vec2,
  Raycast,
  Post,
} from 'ogl'
import Stats from 'stats.js'

import RaycastableMesh from './core/RaycastableMesh'
import Planes from './groups/Planes'
import Object from './meshes/Object'
import Cube from './meshes/Cube'

import Spot from './pass/Spot'

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
  _post: Post
  _resolution: Vec2
  _mouse: Vec3
  _mouseNorm: Vec3
  _raycast: Raycast
  _raycastable: RaycastableMesh[]

  _cube: Cube
  _spot: Spot
  _planes: Planes
  _object: Object

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

    this._post = new Post(this._gl)
    this._initPass()

    this._raycast = new Raycast(this._gl)
    this._raycastable = []

    this._cube = new Cube(this._gl, {
      mouse: this._mouseNorm,
      camera: this._camera,
    })
    this._raycastable.push(this._cube)
    this.addChild(this._cube)

    this._planes = new Planes(this._gl, {
      camera: this._camera,
      resolution: this._resolution,
    })
    this.addChild(this._planes)

    this._object = new Object(this._gl, {
      camera: this._camera,
      resolution: this._resolution,
    })
    this.addChild(this._object)

    this._listen()
    this._rafID = requestAnimationFrame(this._render)
  }

  _initPass() {
    this._spot = new Spot(this._gl, {
      resolution: this._resolution
    })
    //this._post.addPass(this._spot)
  }

  _listen() {
    document.addEventListener('contextmenu', event => event.preventDefault());
    document.addEventListener('keydown', this._onKeyDown)
    document.addEventListener('keyup', this._onKeyUp)
    document.addEventListener('mousedown', this._onMouseDown)
    document.addEventListener('mousemove', this._onMouseMove)
    document.addEventListener('mouseup', this._onMouseUp)
    document.addEventListener('touchstart', this._onTouchStart)
    document.addEventListener('touchmove', this._onTouchMove)
    document.addEventListener('touchend', this._onMouseUp)
  }

  _unlisten() {
    document.removeEventListener('keydown', this._onKeyDown)
    document.removeEventListener('keyup', this._onKeyUp)
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


  _onKeyDown = (e: KeyboardEvent) => {
    if (e.code == 'ArrowRight') {
      this._spot.setSide('LEFT')
    }
    else if (e.code == 'ArrowLeft') {
      this._spot.setSide('RIGHT')
    }
    else {
      this._spot.setSide('BOTH')
    }
  }

  _onKeyUp = (e: KeyboardEvent) => {
    this._spot.setSide('BOTH')
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
    this._post.resize()
    this._spot.resize()

    this._planes.resize()

    getWorldPositionFromViewportRectPerc(
      this._camera,
      { top: 50, left: (1 / 6) * 100 },
      this._resolution,
      this._cube.position,
    )
    getWorldMatrix(this._cube, tmp_vec_3)
    getScaleFromCameraDistance(this._camera, tmp_vec_3, tmp_vec_3)
  }

  _render = (t: number) => {
    stats.begin()
    const time = t * .001

    this._controls.update()
    this._spot.update(time)

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

    this._post.render({ scene: this, camera: this._camera })
    stats.end()

    this._rafID = requestAnimationFrame(this._render)
  }
}