import { Vec3 } from 'ogl'

import DynamicPlane, {
  DynamicPlaneParams,
} from '~/Experience/meshes/DynamicPlane'
import bone from '~/assets/textures/stuffs/bone.png'

import { getScaleFromCameraDistance, getWorldMatrix } from '~/utils/maths'

const tmp_vec_3 = new Vec3()

const POSITION = { top: 35, left: 18 }
const SIZE = 0.12

export default class Bone extends DynamicPlane {
  constructor(gl, { camera, resolution, mouse }: DynamicPlaneParams) {
    super(gl, {
      transparent: true,
      texture: bone,
      positionOnScreen: {
        top: POSITION.top,
        left: POSITION.left,
      },
      mouse,
      camera,
      resolution,
      depthTest: false,
    })
  }

  resize = () => {
    super.resize()

    this.position.z = 0.28
    getWorldMatrix(this, tmp_vec_3)
    getScaleFromCameraDistance(this._camera, tmp_vec_3, tmp_vec_3)
    this.scale.set(tmp_vec_3.x)
    this.scale.multiply(SIZE)
  }
}
