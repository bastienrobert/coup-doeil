import { Vec3 } from 'ogl'

import StaticPlane, { StaticPlaneParams } from '~/Experience/meshes/StaticPlane'
import redRectangle from '~/assets/textures/stuffs/red_rectangle.png'

import {
  getScaleFromCameraDistance,
  getWorldMatrix,
  getWorldPositionFromViewportRectPerc,
} from '~/utils/maths'

const tmp_vec_3 = new Vec3()

const POSITION = { top: 33, left: 36 }
const SIZE = 0.15

export default class RedRectangle extends StaticPlane {
  constructor(gl, { camera, resolution }: StaticPlaneParams) {
    super(gl, {
      transparent: true,
      depthTest: false,
      texture: redRectangle,
      camera,
      resolution,
    })
  }

  resize = () => {
    getWorldPositionFromViewportRectPerc(
      this._camera,
      POSITION,
      this._resolution,
      tmp_vec_3,
    )
    this.position.copy(tmp_vec_3)
    this.position.z = 0.3
    getWorldMatrix(this, tmp_vec_3)
    getScaleFromCameraDistance(this._camera, tmp_vec_3, tmp_vec_3)
    this.scale.set(tmp_vec_3.x)
    this.scale.multiply(SIZE)
  }
}
