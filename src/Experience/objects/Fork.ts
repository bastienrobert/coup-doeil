import DynamicPlane, {
  DynamicPlaneParams,
} from '~/Experience/meshes/DynamicPlane'
import { ColliderMesh } from '~/Experience/core/CollidableMesh'
import fork from '~/assets/textures/stuffs/fork.png'

export default class Fork extends DynamicPlane implements ColliderMesh {
  constructor(gl, params: DynamicPlaneParams) {
    super(gl, {
      ...params,
      transparent: true,
      texture: fork,
    })
  }

  isInCollision() {
    this.reset()
  }

  resize = () => {
    super.resize()

    this.position.z = 0.6
    this.resetSize()

    this.initial.z = this.position.z
  }
}
