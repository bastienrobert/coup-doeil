import {
  Camera,
  Renderer,
  OGLRenderingContext,
  Transform,
  Orbit,
  Vec3,
  Vec2,
} from 'ogl'
import Stats from 'stats.js'
import { normalizeMouse } from '~/utils/maths'

import Cube from './meshes/Cube'

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
  _cube: Cube

  constructor(renderer: Renderer) {
    super()

    this.renderer = renderer
    this._gl = renderer.gl
    this._gl.clearColor(1, 1, 1, 1)

    this._camera = new Camera(this._gl, { aspect: 35 })
    this._camera.position.set(0, 0, 7)
    this._camera.lookAt([0, 0, 0])

    this._controls = new Orbit(this._camera)
    this._controls.enabled = false

    this._resolution = new Vec2()
    this._mouse = new Vec3()
    this._mouseNorm = new Vec3()
    this._listen()

    this._cube = new Cube(this._gl, {
      mouse: this._mouseNorm,
      camera: this._camera,
    })
    this.addChild(this._cube)

    this._rafID = requestAnimationFrame(this._render)
  }

  _listen() {
    document.addEventListener('mousedown', this._onMouseDown)
    document.addEventListener('mousemove', this._onMouseMove)
    document.addEventListener('mouseup', this._onMouseUp)
  }

  _unlisten() {
    document.removeEventListener('mousedown', this._onMouseDown)
    document.removeEventListener('mousemove', this._onMouseMove)
    document.removeEventListener('mouseup', this._onMouseUp)
  }

  _onMouseDown = () => {
    this._mouse.z = 1
  }

  _onMouseMove = (e: MouseEvent) => {
    if (this._mouse.z === 0) return
    this._mouse.set(e.clientX, e.clientY, 1)
    normalizeMouse(this._mouse, this._resolution, this._mouseNorm)
  }

  _onMouseUp = () => {
    this._mouse.z = 0
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
  }

  _render = (t) => {
    stats.begin()
    const time = t * 0.001
    this._controls.update()

    this._cube.update(time)

    this.renderer.render({ scene: this, camera: this._camera })
    stats.end()

    this._rafID = requestAnimationFrame(this._render)
  }
}
