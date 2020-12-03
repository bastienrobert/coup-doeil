import { Color, TextureLoader, Vec2, Pass, OGLRenderingContext } from 'ogl'

import spotLeft from '~/assets/textures/spotLeft.png'
import spotRight from '~/assets/textures/spotRight.png'

import fragment from '~/shaders/spot/fragment.glsl'

import spots from './spots.json'
import SpotData from './SpotData'

import spring, { Spring } from '~/utils/spring'
import timestamp, { Timestamp } from '~/utils/timestamp'

interface SpotParams {
  resolution: Vec2
}

type SpotSide = 'LEFT' | 'RIGHT' | 'BOTH'

export default class Spot implements Pass {
  _gl: OGLRenderingContext
  _resolution: Vec2
  _spring: Spring
  _timestamp: Timestamp

  fragment: string
  uniforms: any

  constructor(gl, { resolution }: SpotParams) {
    this._gl = gl

    this._resolution = resolution
    this._spring = spring({
      value: {
        left: 1,
        right: 1,
      },
      callback: ({ left, right }: any) => {
        this.uniforms.uLeftEnable.value = left
        this.uniforms.uRightEnable.value = right
      },
    })

    this._timestamp = timestamp()

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
        this._spring.set({
          value: {
            left: 1,
            right: 0,
          },
        })
        break
      case 'RIGHT':
        this._spring.set({
          value: {
            left: 0,
            right: 1,
          },
        })
        break
      case 'BOTH':
        this._spring.set({
          value: {
            left: 1,
            right: 1,
          },
        })
        break
    }
  }

  resize = () => {
    this._resolution.set(this._resolution.x, this._resolution.y)
  }

  update = (t: number) => {
    this._timestamp.update(t * 1000)
    this._spring.update(this._timestamp.delta)
    this.uniforms.uTime.value = t
  }
}
