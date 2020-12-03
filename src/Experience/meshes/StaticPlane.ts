import {
  Plane as OGLPlane,
  Camera,
  OGLRenderingContext,
  Program,
  Vec2,
  Mesh,
  TextureLoader,
  ProgramOptions,
} from 'ogl'

import vertex from '~/shaders/collidable/vertex.glsl'
import fragment from '~/shaders/collidable/fragment.glsl'

const WIDTH = 1
const HEIGHT = 1

export interface StaticPlaneParams extends Partial<ProgramOptions> {
  camera: Camera
  resolution: Vec2
  texture?: string
}

export default class StaticPlane extends Mesh {
  _gl: OGLRenderingContext
  _camera: Camera
  _resolution: Vec2

  isCollide: boolean

  constructor(
    gl,
    { texture, camera, resolution, ...params }: StaticPlaneParams,
  ) {
    super(gl, {
      geometry: new OGLPlane(gl, { width: WIDTH, height: HEIGHT }),
      program: new Program(gl, {
        ...params,
        vertex,
        fragment,
        uniforms: {
          uTexture: {
            value: TextureLoader.load(gl, {
              src: texture,
              generateMipmaps: false,
            }),
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
