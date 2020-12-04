import { GUI } from 'dat.gui'
import { OGLRenderingContext, Texture } from 'ogl'

import gui from '../gui'

/**
 * DATA IS:
 * - X: RGB^2->256^4^2
 * - Y: RGB^2->256^4^2
 * - ScaleX: RGB^2->256^4^2
 * - ScaleY: RGB^2->256^4^2
 */

interface ValueToColorParams {
  precision: number
  type: 'RGB' | 'RGBA'
}

function valueToColor(
  value: number,
  { precision = 1, type = 'RGBA' }: Partial<ValueToColorParams> = {},
) {
  let a = []
  let u = value
  const l = type.length
  for (let p = 0; p < precision * l; p++) {
    if (u <= 0) a.push(0)
    else a.push((u -= 255) > 0 ? 255 : 255 + u)
  }
  return a
}

interface SpotDataCoords {
  x: number
  y: number
  s: number
}

interface SpotDataData {
  left: SpotDataCoords[]
  right: SpotDataCoords[]
}

export default class SpotData extends Texture {
  image: Uint8Array
  _gui: GUI
  _leftSpots: number
  _rightSpots: number

  constructor(gl: OGLRenderingContext, data?: SpotDataData) {
    super(gl, {
      image: new Uint8Array(1),
      width: 1,
      height: 1,
      generateMipmaps: false,
    })

    if (data) this.set(data)
  }

  _size(ceiled: number) {
    const image = new Uint8Array(ceiled * 4 * 2)
    this.width = image.length / 4 / 2
    this.height = 2
    this.image = image
  }

  _populate(coords: SpotDataCoords[], offset: number = 0) {
    coords.forEach((c, i) => {
      const i2 = i * 4 * 3 + offset

      this._setPixelValue(i2, c.x * 10)
      this._setPixelValue(i2 + 4, c.y * 10)
      this._setPixelValue(i2 + 8, c.s * 1000)
    })
  }

  set(data: SpotDataData) {
    const max = Math.max(data.left.length, data.right.length) * 3
    const ceiled = Math.ceil(max / 2) * 2

    this._size(ceiled)

    this._populate(data.left)
    this._populate(data.right, this.image.length * 0.5)

    this.needsUpdate = true

    this._initGUI(data)
  }

  _getPixelValue(p: number) {
    return (
      this.image[p] + this.image[p + 1] + this.image[p + 2] + this.image[p + 3]
    )
  }

  _setPixelValue(p: number, value: number) {
    const rv = valueToColor(value)
    this.image[p] = rv[0]
    this.image[p + 1] = rv[1]
    this.image[p + 2] = rv[2]
    this.image[p + 3] = rv[3]
  }

  _initGUI(data: SpotDataData) {
    if (this._gui) gui.removeFolder(this._gui)

    this._gui = gui.addFolder('image')
    const leftC = this._gui.addFolder('left')
    const rightC = this._gui.addFolder('right')

    const onChange = () => {
      this.needsUpdate = true
    }

    const generate = (main: GUI, o = 0) => {
      return (_, i) => {
        const c = main.addFolder(`spot-${i}`)
        const i2 = i * 4 * 3

        const xg = i2 + o
        const yg = i2 + o + 4
        const sg = i2 + o + 8

        const tmp = {
          x: this._getPixelValue(xg) * 0.1,
          y: this._getPixelValue(yg) * 0.1,
          s: this._getPixelValue(sg) * 0.001,
        }

        c.add(tmp, 'x', 0, 100, 0.1).onChange((v) => {
          this._setPixelValue(xg, v * 10)
          onChange()
        })
        c.add(tmp, 'y', 0, 100, 0.1).onChange((v) => {
          this._setPixelValue(yg, v * 10)
          onChange()
        })
        c.add(tmp, 's', 0, 1, 0.001).onChange((v) => {
          this._setPixelValue(sg, v * 1000)
          onChange()
        })
      }
    }

    data.left.forEach(generate(leftC, 0))
    data.right.forEach(generate(rightC, this.image.length * 0.5))
  }
}
