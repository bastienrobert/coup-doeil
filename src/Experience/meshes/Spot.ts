import { Program, Color, Mesh, Triangle, TextureLoader, Vec2 } from 'ogl'

import spotLeft from '~/assets/textures/spotLeft.png'
import spotRight from '~/assets/textures/spotRight.png'
import spotT from '~/assets/textures/spot.png'

import vertex from '~/shaders/spot/vertex.glsl'
import fragment from '~/shaders/spot/fragment.glsl'

interface SpotParams {
  resolution: Vec2
}

type SpotSide = 'LEFT' | 'RIGHT' | 'BOTH'

export default class Spot extends Mesh {
  constructor(gl, { resolution }: SpotParams) {
    super(gl, {
      geometry: new Triangle(gl),
      program: new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          tSpot: {
            value: TextureLoader.load(gl, {
              src: spotT,
              generateMipmaps: false
            })
          },
          uResolution: { value: resolution },
          uTextureLeft: { value: 0 },
          uTextureRight: { value: 0 },
          uTime: { value: 0 },
          uColor: { value: new Color(0.3, 0.2, 0.5) }
        }
      }),
    })
  }

  setSide(side: SpotSide) {
    switch (side) {
      case 'LEFT':
        this.program.uniforms.uTextureLeft.value = 1
        this.program.uniforms.uTextureRight.value = 0
        break
      case 'RIGHT':
        this.program.uniforms.uTextureLeft.value = 0
        this.program.uniforms.uTextureRight.value = 1
        break
      case 'BOTH':
        this.program.uniforms.uTextureLeft.value = 1
        this.program.uniforms.uTextureRight.value = 1
        break
    }
  }

  update = (t: number) => {
    this.program.uniforms.uTime.value = t
  }
}
