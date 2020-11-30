import { Camera, Renderer, OGLRenderingContext, Transform, Orbit } from 'ogl'
import Stats from 'stats.js'

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
  _cube: Cube

  constructor(renderer: Renderer) {
    super()

    this.renderer = renderer
    this._gl = renderer.gl
    this._gl.clearColor(1, 1, 1, 1)

    this._camera = new Camera(this._gl, { aspect: 35 })
    this._camera.position.set(0, 1, 7)
    this._camera.lookAt([0, 0, 0])

    this._controls = new Orbit(this._camera)

    this._cube = new Cube(this._gl)
    this.addChild(this._cube)

    this._rafID = requestAnimationFrame(this._render)
  }

  dispose() {
    if (this._rafID) cancelAnimationFrame(this._rafID)
    // DISPOSABLE ELEMENTS HERE (eg. REMOVE LISTENERS)
  }

  resize = () => {
    const { width, height } = this.renderer.gl.canvas
    this._camera.perspective({
      aspect: width / height,
    })
  }

  _render = () => {
    stats.begin()
    this._controls.update()

    this.renderer.render({ scene: this, camera: this._camera })
    stats.end()

    this._rafID = requestAnimationFrame(this._render)
  }
}
