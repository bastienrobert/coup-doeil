import {
  Plane as OGLPlane,
  Camera,
  OGLRenderingContext,
  Program,
  Vec2,
  TextureLoader,
} from 'ogl'

import CollidableMesh from '../core/CollidableMesh'

import vertex from '~/shaders/collidable/vertex.glsl'
import fragment from '~/shaders/collidable/fragment.glsl'

const WIDTH = 1
const HEIGHT = 1

export interface CollidablePlaneParams {
  camera: Camera
  resolution: Vec2
  transparent?: boolean
  texture?: string
}

export default class CollidablePlane extends CollidableMesh {
  _gl: OGLRenderingContext
  _camera: Camera
  _resolution: Vec2

  isCollide: boolean

  constructor(
    gl,
    { texture, camera, resolution, transparent }: CollidablePlaneParams,
  ) {
    super(gl, {
      geometry: new OGLPlane(gl, { width: WIDTH, height: HEIGHT }),
      program: new Program(gl, {
        vertex,
        fragment,
        transparent,
        uniforms: {
          uTexture: {
            value: TextureLoader.load(gl, {
              src: texture,
              generateMipmaps: false,
            }),
          },
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
