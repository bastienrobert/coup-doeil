import { OGLRenderingContext, Texture } from 'ogl'

import gui from '../gui'

export default class SpotData extends Texture {
  constructor(gl: OGLRenderingContext) {
    // prettier-ignore
    const image = new Uint8Array([
      0, 0, 255, 0,
      0, 255, 0, 0,
      255, 0, 0, 0,
      0, 0, 0, 0,
    ])

    super(gl, {
      image,
      width: image.length / 4 / 2,
      height: image.length / 4 / 2,
      generateMipmaps: false,
    })

    this._initGUI()
  }

  _initGUI() {
    const image = gui.addFolder('image')
    ;(this.image as Uint8Array).forEach((p, i) => {
      image.add(this.image, String(i), 0, 255, 1).onChange(() => {
        this.needsUpdate = true
      })
    })
  }
}
