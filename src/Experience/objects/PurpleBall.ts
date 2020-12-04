import DynamicPlane, {
  DynamicPlaneParams,
} from '~/Experience/meshes/DynamicPlane'
import { ColliderMesh } from '~/Experience/core/CollidableMesh'

import purpleBall from '~/assets/textures/stuffs/purple_ball.png'

import { ball as ballSound } from '~/sounds'

export default class PurpleBall extends DynamicPlane implements ColliderMesh {
  constructor(gl, params: DynamicPlaneParams) {
    super(gl, {
      ...params,
      transparent: true,
      texture: purpleBall,
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

    this.position.z = 0.7

    this.initial.z = this.position.z
  }
}
