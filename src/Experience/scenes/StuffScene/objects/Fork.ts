import { Vec3 } from 'ogl'

import StaticPlane, { StaticPlaneParams } from '~/Experience/meshes/StaticPlane'
import fork from '~/assets/textures/stuffs/fork.png'

import {
  getScaleFromCameraDistance,
  getWorldMatrix,
  getWorldPositionFromViewportRectPerc,
} from '~/utils/maths'

const tmp_vec_3 = new Vec3()

const POSITION = { top: 32, left: 33 }
const SIZE = 0.15

export default class Fork extends StaticPlane {
  constructor(gl, { camera, resolution }: StaticPlaneParams) {
    super(gl, {
      transparent: true,
      texture: fork,
      depthTest: false,
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
    this.position.z = 0.6
    getWorldMatrix(this, tmp_vec_3)
    getScaleFromCameraDistance(this._camera, tmp_vec_3, tmp_vec_3)
    this.scale.set(tmp_vec_3.x)
    this.scale.multiply(SIZE)
  }
}
