import DynamicPlane, {
  DynamicPlaneParams,
} from '~/Experience/meshes/DynamicPlane'
import { ColliderMesh } from '~/Experience/core/CollidableMesh'

import greenBall from '~/assets/textures/stuffs/green_ball.png'

export default class GreenBall extends DynamicPlane implements ColliderMesh {
  constructor(gl, params: DynamicPlaneParams) {
    super(gl, {
      ...params,
      transparent: true,
      texture: greenBall,
    })
  }

  isInCollision() {
    this.reset()
  }

  resize = () => {
    super.resize()

    this.position.z = 0.3
    this.resetSize()

    this.initial.z = this.position.z
  }
}
