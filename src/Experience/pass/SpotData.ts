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

  constructor(gl: OGLRenderingContext, data: SpotDataData) {
    super(gl, {
      image: new Uint8Array(1),
      width: 1,
      height: 1,
      generateMipmaps: false,
    })

    this.set(data)
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
      const x = valueToColor(c.x * 10)
      const y = valueToColor(c.y * 10)
      const s = valueToColor(c.s * 10)

      this.image[i2] = x[0]
      this.image[1 + i2] = x[1]
      this.image[2 + i2] = x[2]
      this.image[3 + i2] = x[3]
      this.image[4 + i2] = y[0]
      this.image[5 + i2] = y[1]
      this.image[6 + i2] = y[2]
      this.image[7 + i2] = y[3]
      this.image[8 + i2] = s[0]
      this.image[9 + i2] = s[1]
      this.image[10 + i2] = s[2]
      this.image[11 + i2] = s[3]
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

        const tmp = { foo: 0 }

        const x = c.addFolder('x')
        // x.add(tmp, 'foo', 0, 100, 0.1).onChange((v) => {
        //   const rv = Math.round(v * 10)
        //   console.log(rv)
        // })
        x.add(this.image, i2 + o + '').onChange(onChange)
        x.add(this.image, i2 + o + 1 + '').onChange(onChange)
        x.add(this.image, i2 + o + 2 + '').onChange(onChange)
        x.add(this.image, i2 + o + 3 + '').onChange(onChange)
        const y = c.addFolder('y')
        y.add(this.image, i2 + o + 4 + '').onChange(onChange)
        y.add(this.image, i2 + o + 5 + '').onChange(onChange)
        y.add(this.image, i2 + o + 6 + '').onChange(onChange)
        y.add(this.image, i2 + o + 7 + '').onChange(onChange)
        const s = c.addFolder('s')
        s.add(this.image, i2 + o + 8 + '').onChange(onChange)
        s.add(this.image, i2 + o + 9 + '').onChange(onChange)
        s.add(this.image, i2 + o + 10 + '').onChange(onChange)
        s.add(this.image, i2 + o + 11 + '').onChange(onChange)
      }
    }

    data.left.forEach(generate(leftC, 0))
    data.right.forEach(generate(rightC, this.image.length * 0.5))
  }
}
