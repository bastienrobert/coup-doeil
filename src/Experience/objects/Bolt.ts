import DynamicPlane, {
  DynamicPlaneParams,
} from '~/Experience/meshes/DynamicPlane'
import { ColliderMesh } from '~/Experience/core/CollidableMesh'

import bolt from '~/assets/textures/stuffs/bolt.png'
import { bolt as boldSound } from '~/sounds'

export default class Bolt extends DynamicPlane implements ColliderMesh {
  constructor(gl, params: DynamicPlaneParams) {
    super(gl, {
      ...params,
      transparent: true,
      texture: bolt,
    })
  }

  isInCollision() {
    this.reset()
  }

  onMouseDown = () => {
    if (this.isHit) boldSound.play()
  }

  resize = () => {
    super.resize()

    this.rotation.set(0, 0, -Math.PI / 2)
    this.position.z = 0.7

    this.initial.z = this.position.z
  }
}
