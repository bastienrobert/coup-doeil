import { Vec3 } from 'ogl'
import StaticPlane, { StaticPlaneParams } from '~/Experience/meshes/StaticPlane'
import floor from '~/assets/textures/stuffs/floor.png'

import {
  getScaleFromCameraDistance,
  getWorldMatrix,
  getWorldPositionFromViewportRectPerc,
} from '~/utils/maths'

const tmp_vec_3 = new Vec3()

const POSITION = { top: 60, left: 50 }
const SIZE = 1.2

export default class Floor extends StaticPlane {
  constructor(gl, { camera, resolution }: StaticPlaneParams) {
    super(gl, {
      texture: floor,
      camera,
      depthWrite: false,
      resolution,
    })
    this.rotation.x = -Math.PI / 3
  }

  resize = () => {
    getWorldPositionFromViewportRectPerc(
      this._camera,
      POSITION,
      this._resolution,
      tmp_vec_3,
    )
    this.position.copy(tmp_vec_3)
    getWorldMatrix(this, tmp_vec_3)
    // tmp_vec_3.z = 0
    getScaleFromCameraDistance(this._camera, tmp_vec_3, tmp_vec_3)
    this.scale.set(tmp_vec_3.x)
    this.scale.multiply(SIZE)
  }
}
