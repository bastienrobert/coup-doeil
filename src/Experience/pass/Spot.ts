import {
  Color,
  TextureLoader,
  Vec2,
  Pass,
  OGLRenderingContext,
  Vec4,
} from 'ogl'

import spotLeft from '~/assets/textures/spotLeft.png'
import spotRight from '~/assets/textures/spotRight.png'

import fragment from '~/shaders/spot/fragment.glsl'

import SpotData from './SpotData'
import spots from './spots.json'

import spring, { InrtiaConfig, Spring } from '~/utils/spring'
import timestamp, { Timestamp } from '~/utils/timestamp'

const tmp_vec_4 = new Vec4()

const TRANSITE_IN: InrtiaConfig = {
  friction: 12,
  rigidity: 0.25,
}
const TRANSITE_OUT: InrtiaConfig = {
  friction: 50,
  rigidity: 0.1,
}

interface SpotParams {
  resolution: Vec2
}

interface SetSpotParams {
  left?: string
  right?: string
  data?: any
}

type SpotSide = 'LEFT' | 'RIGHT' | 'BOTH'

export default class Spot implements Pass {
  _gl: OGLRenderingContext
  _resolution: Vec2
  _spring: Spring
  _transiting: boolean
  _transition: Spring
  _timestamp: Timestamp

  controlable: boolean
  fragment: string
  uniforms: any

  constructor(gl, { resolution }: SpotParams) {
    this._gl = gl

    this._resolution = resolution
    this._spring = spring({
      config: {
        interpolation: 'basic',
        friction: 7,
      },
      value: {
        left: 0,
        right: 0,
      },
      callback: ({ left, right }: any) => {
        this.uniforms.uLeftEnable.value = left
        this.uniforms.uRightEnable.value = right
      },
    })
    this._transition = spring({
      value: new Vec4(0, 0, 0, 0),
      config: {
        perfectStop: true,
        precisionStop: 0.01,
      },
      callback: (value: Vec4) => {
        this.uniforms.uMask.value.copy(value)

        if (tmp_vec_4.w === value.w && value.w === 1 && this._transiting) {
          this._transiting = false
          setTimeout(() => {
            this._transition.set({
              config: TRANSITE_OUT,
              value: tmp_vec_4.set(1, 1, 1, 0),
            })
          }, 600)
        }
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
        value: new SpotData(this._gl, spots.stuff),
      },
      uResolution: { value: resolution },
      uMask: { value: new Vec4(1, 1, 1, 0) },
      uLeftEnable: { value: 0 },
      uRightEnable: { value: 0 },
      uTextureDimension: { value: new Vec2(1024, 1024) },
      uTime: { value: 0 },
      uColor: { value: new Color(0.3, 0.2, 0.5) },
    }
  }

  set({ left, right, data }: SetSpotParams) {
    if (left) {
      TextureLoader.loadImage(this._gl, left, this.uniforms.tLeft.value)
    }
    if (right) {
      TextureLoader.loadImage(this._gl, right, this.uniforms.tRight.value)
    }
    if (data) {
      this.uniforms.tData.value.set(data)
      this.uniforms.uColor.value.set(data.color)
    }
  }

  visible(payload: boolean) {
    this._spring.set({
      value: {
        left: payload ? 1 : 0,
        right: payload ? 1 : 0,
      },
    })
  }

  setSide(side: SpotSide) {
    if (!this.controlable) return

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

  transite = (color: 'WHITE' | 'BLACK'): Promise<void> => {
    return new Promise((resolve) => {
      this._transition.emitter.once('off', () => resolve && resolve())
      this._transiting = true
      this._transition.set({
        config: TRANSITE_IN,
        value:
          color === 'WHITE'
            ? tmp_vec_4.set(1, 1, 1, 1)
            : tmp_vec_4.set(0, 0, 0, 1),
      })
    })
  }

  resize = () => {
    this._resolution.set(this._resolution.x, this._resolution.y)
  }

  update = (t: number) => {
    this._timestamp.update(t * 1000)
    this._spring.update(this._timestamp.delta)
    this._transition.update(this._timestamp.delta)
    this.uniforms.uTime.value = t
  }
}
