import { Vec3 } from 'ogl'

import StaticPlane, { StaticPlaneParams } from '../meshes/StaticPlane'
import dog from '~/assets/textures/stuffs/dog.png'

import {
  getScaleFromCameraDistance,
  getWorldMatrix,
  getWorldPositionFromViewportRectPerc,
} from '~/utils/maths'

const tmp_vec_3 = new Vec3()

const POSITION = { bottom: 45, left: 60 }
const SIZE = 0.5

export default class Dog extends StaticPlane {
  constructor(gl, params: StaticPlaneParams) {
    super(gl, {
      ...params,
      transparent: true,
      texture: dog,
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
    this.position.z = 0.7
    getWorldMatrix(this, tmp_vec_3)
    getScaleFromCameraDistance(this._camera, tmp_vec_3, tmp_vec_3)
    this.scale.set(tmp_vec_3.x)
    this.scale.multiply(SIZE)
  }
}
