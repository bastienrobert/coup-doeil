import { Color, TextureLoader, Vec2, Pass, OGLRenderingContext } from 'ogl'

import spotLeft from '~/assets/textures/spotLeft.png'
import spotRight from '~/assets/textures/spotRight.png'

import fragment from '~/shaders/spot/fragment.glsl'

import spots from './spots.json'
import SpotData from './SpotData'

interface SpotParams {
  resolution: Vec2
}

type SpotSide = 'LEFT' | 'RIGHT' | 'BOTH'

export default class Spot implements Pass {
  _gl: OGLRenderingContext
  _resolution: Vec2

  fragment: string
  uniforms: any

  constructor(gl, { resolution }: SpotParams) {
    this._gl = gl

    this._resolution = resolution
    this.fragment = fragment

    this.uniforms = {
      tLeft: {
        value: TextureLoader.load(gl, {
          src: spotLeft,
          generateMipmaps: false,
        }),
      },
      tRight: {
        value: TextureLoader.load(gl, {
          src: spotRight,
          generateMipmaps: false,
        }),
      },
      tData: {
        value: new SpotData(this._gl, spots.intro),
      },
      uResolution: { value: resolution },
      uLeftEnable: { value: 1 },
      uRightEnable: { value: 1 },
      uTextureDimension: { value: new Vec2(1024, 1024) },
      uTime: { value: 0 },
      uColor: { value: new Color(0.3, 0.2, 0.5) },
    }
  }

  setSide(side: SpotSide) {
    switch (side) {
      case 'LEFT':
        this.uniforms.uLeftEnable.value = 1
        this.uniforms.uRightEnable.value = 0
        break
      case 'RIGHT':
        this.uniforms.uLeftEnable.value = 0
        this.uniforms.uRightEnable.value = 1
        break
      case 'BOTH':
        this.uniforms.uLeftEnable.value = 1
        this.uniforms.uRightEnable.value = 1
        break
    }
  }

  resize = () => {
    this._resolution.set(this._resolution.x, this._resolution.y)
  }

  update = (t: number) => {
    this.uniforms.uTime.value = t
  }
}
