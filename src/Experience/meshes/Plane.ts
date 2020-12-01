import {
  Plane as OGLPlane,
  Camera,
  Mesh,
  OGLRenderingContext,
  Program,
  Vec2,
  Color,
} from 'ogl'

import vertex from '~/shaders/plane/vertex.glsl'
import fragment from '~/shaders/plane/fragment.glsl'

const WIDTH = 1
const HEIGHT = 1

export interface PlaneParams {
  camera: Camera
  resolution: Vec2
  color?: Color
}

export default class Plane extends Mesh {
  _gl: OGLRenderingContext
  _camera: Camera
  _resolution: Vec2

  isCollide: boolean

  constructor(gl, { color, camera, resolution }: PlaneParams) {
    super(gl, {
      geometry: new OGLPlane(gl, { width: WIDTH, height: HEIGHT }),
      program: new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          uColor: { value: color || new Color(0.2, 0.8, 1.0) },
          uCollide: { value: 0 },
        },
      }),
    })

    this._gl = gl

    this._camera = camera
    this._resolution = resolution

    this.isCollide = false

    this.onBeforeRender(this._updateCollideUniform)
  }

  _updateCollideUniform = () => {
    this.program.uniforms.uCollide.value = this.isCollide ? 1 : 0
  }

  get width() {
    return WIDTH * 0.5 * this.scale.x
  }

  get height() {
    return HEIGHT * 0.5 * this.scale.y
  }
}