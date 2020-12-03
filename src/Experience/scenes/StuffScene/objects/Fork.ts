import { Vec3 } from 'ogl'

import DynamicPlane, {
  DynamicPlaneParams,
} from '~/Experience/meshes/DynamicPlane'
import fork from '~/assets/textures/stuffs/fork.png'

import { getScaleFromCameraDistance, getWorldMatrix } from '~/utils/maths'
import { ColliderMesh } from '~/Experience/core/CollidableMesh'

const tmp_vec_3 = new Vec3()

const POSITION = { top: 32, left: 33 }
const SIZE = 0.15

export default class Fork extends DynamicPlane implements ColliderMesh {
  constructor(gl, { camera, resolution, mouse }: DynamicPlaneParams) {
    super(gl, {
      transparent: true,
      texture: fork,
      positionOnScreen: {
        top: POSITION.top,
        left: POSITION.left,
      },
      mouse,
      camera,
      resolution,
    })
  }

  isInCollision() {
    this.reset()
  }

  resize = () => {
    super.resize()

    this.position.z = 0.6
    getWorldMatrix(this, tmp_vec_3)
    getScaleFromCameraDistance(this._camera, tmp_vec_3, tmp_vec_3)
    this.scale.set(tmp_vec_3.x)
    this.scale.multiply(SIZE)

    this.initial.z = this.position.z
  }
}
