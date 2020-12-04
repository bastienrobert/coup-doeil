import DynamicPlane, {
  DynamicPlaneParams,
} from '~/Experience/meshes/DynamicPlane'
import { ColliderMesh } from '~/Experience/core/CollidableMesh'

import redBall from '~/assets/textures/stuffs/red_ball.png'

import { ball as ballSound } from '~/sounds'

export default class RedBall extends DynamicPlane implements ColliderMesh {
  constructor(gl, params: DynamicPlaneParams) {
    super(gl, {
      ...params,
      transparent: true,
      texture: redBall,
    })
  }

  onMouseDown = () => {
    if (this.isHit) ballSound.play()
  }

  isInCollision() {
    this.reset()
  }

  resize = () => {
    super.resize()

    this.position.z = 0.3

    this.initial.z = this.position.z
  }
}
