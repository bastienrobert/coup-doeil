import { Vec3 } from 'ogl'

import StaticPlane, { StaticPlaneParams } from '~/Experience/meshes/StaticPlane'
import bootShadow from '~/assets/textures/stuffs/boots_shadow.png'

import {
  getScaleFromCameraDistance,
  getWorldMatrix,
  getWorldPositionFromViewportRectPerc,
} from '~/utils/maths'

const tmp_vec_3 = new Vec3()

const POSITION = { top: 70, left: 35 }
const SIZE = 0.09

export default class BootShadow extends StaticPlane {
  constructor(gl, { camera, resolution }: StaticPlaneParams) {
    super(gl, {
      transparent: true,
      texture: bootShadow,
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
    this.rotation.set(0, 0, -Math.PI / 2)
    this.position.z = 0.8
    getWorldMatrix(this, tmp_vec_3)
    getScaleFromCameraDistance(this._camera, tmp_vec_3, tmp_vec_3)
    this.scale.set(tmp_vec_3.x)
    this.scale.multiply(SIZE)
  }
}
