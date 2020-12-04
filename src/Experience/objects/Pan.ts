import DynamicPlane, {
  DynamicPlaneParams,
} from '~/Experience/meshes/DynamicPlane'
import { ColliderMesh } from '~/Experience/core/CollidableMesh'

import pan from '~/assets/textures/stuffs/pan.png'

import { pan as panSound } from '~/sounds'

export default class Pan extends DynamicPlane implements ColliderMesh {
  constructor(gl, params: DynamicPlaneParams) {
    super(gl, {
      ...params,
      transparent: true,
      texture: pan,
    })
  }

  isInCollision() {
    this.reset()
  }

  onMouseDown = () => {
    if (this.isHit) panSound.play()
  }

  resize = () => {
    super.resize()

    this.position.z = 0.6

    this.initial.z = this.position.z
  }
}
