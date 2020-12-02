import {
  Plane as OGLPlane,
  Camera,
  Mesh,
  OGLRenderingContext,
  Program,
  TextureLoader,
  Vec2,
} from 'ogl'

import spotT from '~/assets/textures/liberty.png'
import vertex from '~/shaders/object/vertex.glsl'
import fragment from '~/shaders/object/fragment.glsl'

const WIDTH = 1
const HEIGHT = 1

export interface PlaneParams {
  camera: Camera
  resolution: Vec2
}

export default class Plane extends Mesh {
  _gl: OGLRenderingContext
  _camera: Camera
  _resolution: Vec2

  constructor(gl, { camera, resolution }: PlaneParams) {
    super(gl, {
      geometry: new OGLPlane(gl, { width: WIDTH, height: HEIGHT }),
      program: new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          tMap: {
            value: TextureLoader.load(gl, {
              src: spotT,
              generateMipmaps: false
            })
          },

        },
      }),
    })

    this._gl = gl

    this._camera = camera
    this._resolution = resolution

  }
  get width() {
    return WIDTH * 0.5 * this.scale.x
  }

  get height() {
    return HEIGHT * 0.5 * this.scale.y
  }
}
