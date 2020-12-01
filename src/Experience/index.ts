import { Camera, Renderer, OGLRenderingContext, Transform, Orbit, Vec2 } from 'ogl'
import Stats from 'stats.js'

import Cube from './meshes/Cube'
import Spot from './meshes/Spot'

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
  _cube: Cube
  _spot: Spot

  constructor(renderer: Renderer) {
    super()

    this.renderer = renderer
    this._gl = renderer.gl
    this._gl.clearColor(1, 1, 1, 1)

    this._camera = new Camera(this._gl, { aspect: 35 })
    this._camera.position.set(0, 1, 7)
    this._camera.lookAt([0, 0, 0])

    this._controls = new Orbit(this._camera)
    this._resolution = new Vec2()

    this._cube = new Cube(this._gl)
    this.addChild(this._cube)
    this._spot = new Spot(this._gl, {
      resolution: this._resolution
    })
    this.addChild(this._spot)

    this._listen()

    this._rafID = requestAnimationFrame(this._render)
  }

  _listen() {
    document.addEventListener('keydown', this._onKeyDown)
    document.addEventListener('keyup', this._onKeyUp)
  }

  _unlisten() {
    document.removeEventListener('keydown', this._onKeyDown)
    document.removeEventListener('keyup', this._onKeyUp)
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
    this._resolution.set(this.renderer.gl.canvas.width, this.renderer.gl.canvas.height)
    this._camera.perspective({
      aspect: this._resolution.x / this._resolution.y,
    })
  }

  _render = (t: number) => {
    stats.begin()
    const time = t * .001

    this._controls.update()
    this._spot.update(time)

    this.renderer.render({ scene: this, camera: this._camera })
    stats.end()

    this._rafID = requestAnimationFrame(this._render)
  }
}
