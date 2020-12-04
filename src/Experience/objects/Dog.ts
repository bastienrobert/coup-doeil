import { Vec3 } from 'ogl'

import CollidablePlane, {
  CollidablePlaneParams,
} from '~/Experience/meshes/CollidablePlane'
import dog from '~/assets/textures/stuffs/dog.png'

import {
  getScaleFromCameraDistance,
  getWorldMatrix,
  getWorldPositionFromViewportRectPerc,
} from '~/utils/maths'

const tmp_vec_3 = new Vec3()

const POSITION = { bottom: 40, left: 55 }
const SIZE = 0.4

export default class Dog extends CollidablePlane {
  constructor(gl, params: CollidablePlaneParams) {
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
    this.rotation.x = Math.PI / 3
    getWorldMatrix(this, tmp_vec_3)
    getScaleFromCameraDistance(this._camera, tmp_vec_3, tmp_vec_3)
    this.scale.set(tmp_vec_3.x)
    this.scale.multiply(SIZE)
  }
}
