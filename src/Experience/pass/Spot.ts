import { Program, Color, Mesh, Triangle, TextureLoader, Vec2, Pass } from 'ogl'

import spotLeft from '~/assets/textures/spotLeft.png'
import spotRight from '~/assets/textures/spotRight.png'
import spotT from '~/assets/textures/spot.png'

import vertex from '~/shaders/spot/vertex.glsl'
import fragment from '~/shaders/spot/fragment.glsl'
import gui from '../gui'

interface SpotParams {
  resolution: Vec2
}

type SpotSide = 'LEFT' | 'RIGHT' | 'BOTH'

export default class Spot implements Pass {
  _resolution: Vec2

  fragment: string
  uniforms: any

  constructor(gl, { resolution }: SpotParams) {
    this._resolution = resolution
    this.fragment = fragment

    this.uniforms = {
      tSpot: {
        value: TextureLoader.load(gl, {
          src: spotT,
          generateMipmaps: false,
        }),
      },
      uResolution: { value: resolution },
      uTextureLeft: { value: 1 },
      uTextureRight: { value: 1 },
      uTextureLeftAlphaPosition: { value: new Vec2(10, 10) },
      uTextureLeftAlphaScale: { value: 0.2 },
      uTextureLeftAlphaDimension: { value: new Vec2(2048, 2048) },
      uTime: { value: 0 },
      uColor: { value: new Color(0.3, 0.2, 0.5) },
    }

    this._initGUI()
  }

  setSide(side: SpotSide) {
    switch (side) {
      case 'LEFT':
        this.uniforms.uTextureLeft.value = 1
        this.uniforms.uTextureRight.value = 0
        break
      case 'RIGHT':
        this.uniforms.uTextureLeft.value = 0
        this.uniforms.uTextureRight.value = 1
        break
      case 'BOTH':
        this.uniforms.uTextureLeft.value = 1
        this.uniforms.uTextureRight.value = 1
        break
    }
  }

  resize = () => {
    this._resolution.set(this._resolution.x, this._resolution.y)
  }

  update = (t: number) => {
    this.uniforms.uTime.value = t
  }

  _initGUI() {
    gui.add(this.uniforms.uTextureLeftAlphaScale, 'value').step(.1) // prettier-ignore
    const textureLeftAlphaPositionC = gui.addFolder('textureLeftAlphaPosition') // prettier-ignore
    textureLeftAlphaPositionC.add(this.uniforms.uTextureLeftAlphaPosition.value, 'x') // prettier-ignore
    textureLeftAlphaPositionC.add(this.uniforms.uTextureLeftAlphaPosition.value, 'y') // prettier-ignore
    const textureLeftAlphaDimensionC = gui.addFolder('textureLeftAlphaDimension') // prettier-ignore
    textureLeftAlphaDimensionC.add(this.uniforms.uTextureLeftAlphaDimension.value, 'x') // prettier-ignore
    textureLeftAlphaDimensionC.add(this.uniforms.uTextureLeftAlphaDimension.value, 'y') // prettier-ignore
  }
}
