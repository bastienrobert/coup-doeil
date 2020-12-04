import { Vec3 } from 'ogl'

import CollidablePlane, {
  CollidablePlaneParams,
} from '~/Experience/meshes/CollidablePlane'
import clockBlack from '~/assets/textures/stuffs/clock_black.png'

import {
  getScaleFromCameraDistance,
  getWorldMatrix,
  getWorldPositionFromViewportRectPerc,
} from '~/utils/maths'

const tmp_vec_3 = new Vec3()

const POSITION = { top: 32, left: 75 }
const SIZE = 0.1

export default class ClockBlack extends CollidablePlane {
  constructor(gl, params: CollidablePlaneParams) {
    super(gl, {
      ...params,
      transparent: true,
      texture: clockBlack,
      depthTest: false,
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
    this.position.z = 0.8
    getWorldMatrix(this, tmp_vec_3)
    getScaleFromCameraDistance(this._camera, tmp_vec_3, tmp_vec_3)
    this.scale.set(tmp_vec_3.x)
    this.scale.multiply(SIZE)
  }
}
