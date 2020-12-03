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

import SceneController from './controllers/SceneController'
import IntroScene from './scenes/IntroScene'
import StuffScene from './scenes/StuffScene'

import Planes from './groups/Planes'
import gui from './gui'

import { getResolutionNormalizedCoords } from '~/utils/maths'
import Spot from './pass/Spot'

const IS_TOUCHABLE = 'ontouchstart' in window

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

const guiData: any = {}

export default class Experience extends Transform {
  renderer: Renderer
  _gl: OGLRenderingContext
  _rafID: number

  _scenes: SceneController
  _camera: Camera
  _controls: Orbit
  _post: Post
  _resolution: Vec2
  _mouse: Vec3
  _mouseNorm: Vec3
  _raycast: Raycast

  _spot: Spot
  _planes: Planes

  constructor(renderer: Renderer) {
    super()

    this.renderer = renderer
    this._gl = renderer.gl
    this._gl.clearColor(1, 1, 1, 1)

    this._camera = new Camera(this._gl)
    this._camera.position.set(0, 0, 10)
    this._camera.lookAt([0, 0, 0])

    this._controls = new Orbit(this._camera)
    this._controls.enabled = false

    this._resolution = new Vec2()
    // MOUSE DISTANCE FAR AWAY TO PREVENT COLLISIONS ON LOAD
    this._mouse = new Vec3(-1000)
    this._mouseNorm = new Vec3(-1000)

    this._raycast = new Raycast(this._gl)

    this._scenes = new SceneController(
      [
        new IntroScene(),
        new StuffScene(this._gl, {
          mouse: this._mouseNorm,
          camera: this._camera,
          resolution: this._resolution,
        }),
      ],
      'stuff',
    )
    this.addChild(this._scenes)

    this._post = new Post(this._gl)
    this._initPass()

    this._initGUI()
    this._listen()
    this._rafID = requestAnimationFrame(this._render)
  }

  _initPass() {
    this._spot = new Spot(this._gl, {
      resolution: this._resolution,
    })
    // this._post.addPass(this._spot)
  }

  _listen() {
    document.addEventListener('contextmenu', this._onContextMenu)
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
    document.removeEventListener('contextmenu', this._onContextMenu)
    document.removeEventListener('keydown', this._onKeyDown)
    document.removeEventListener('keyup', this._onKeyUp)
    document.removeEventListener('mousedown', this._onMouseDown)
    document.removeEventListener('mousemove', this._onMouseMove)
    document.removeEventListener('mouseup', this._onMouseUp)
    document.removeEventListener('touchstart', this._onTouchStart)
    document.removeEventListener('touchmove', this._onTouchMove)
    document.removeEventListener('touchend', this._onMouseUp)
  }

  _onContextMenu = (e) => {
    e.preventDefault()
  }

  _onMouseDown = () => {
    this._mouse.z = 1
    this._mouseNorm.z = 1
    this._scenes.onMouseDown()
  }

  _onTouchStart = () => {
    this._onMouseDown()
  }

  _onMouseMove = (e: MouseEvent | Touch) => {
    this._mouse.set(e.clientX, e.clientY, this._mouse.z)
    getResolutionNormalizedCoords(
      this._mouse,
      this._resolution,
      this._mouseNorm,
    )
    if (!IS_TOUCHABLE) {
      this.rotation.set(this._mouseNorm.y * 0.05, this._mouseNorm.x * 0.05, 0)
    }
    this._scenes.onMouseMove()
  }

  _onTouchMove = (e: TouchEvent) => {
    this._onMouseMove(e.touches[0])
  }

  _onMouseUp = () => {
    this._mouse.z = 0
    this._scenes.onMouseUp()
  }

  dispose() {
    if (this._rafID) cancelAnimationFrame(this._rafID)
    // DISPOSABLE ELEMENTS HERE (eg. REMOVE LISTENERS)
    this._unlisten()
  }

  _onKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'ArrowRight':
        this._spot.setSide('LEFT')
        break
      case 'ArrowLeft':
        this._spot.setSide('RIGHT')
        break
      default:
        this._spot.setSide('BOTH')
        break
    }
  }

  _onKeyUp = () => {
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
    this._scenes.resize()
  }

  _render = (t: number) => {
    stats.begin()
    const time = t * 0.001

    this._controls.update()
    this._spot.update(time)

    this._scenes.raycastable.forEach((mesh: RaycastableMesh) => {
      mesh.isHit = false
    })
    this._raycast.castMouse(this._camera, this._mouseNorm)
    const hits = this._raycast.intersectBounds(this._scenes.raycastable)
    hits.forEach((mesh: RaycastableMesh, i) => {
      mesh.isHit = i === 0
    })
    // hits.forEach((mesh: RaycastableMesh) => (mesh.isHit = true))

    this._scenes.update(time)

    this._post.render({ scene: this, camera: this._camera })
    stats.end()

    this._rafID = requestAnimationFrame(this._render)
  }

  _initGUI() {
    guiData.scenes = this._scenes.name
    gui
      .add(guiData, 'scenes')
      .options(this._scenes.scenes.map((s) => s.name))
      .onChange(this._scenes.set)
  }
}
