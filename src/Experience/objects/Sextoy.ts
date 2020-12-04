import DynamicPlane, {
  DynamicPlaneParams,
} from '~/Experience/meshes/DynamicPlane'
import { ColliderMesh } from '~/Experience/core/CollidableMesh'

import sextoy from '~/assets/textures/stuffs/sextoy.png'
import { thrill as thrillSound } from '~/sounds'

export default class Sextoy extends DynamicPlane implements ColliderMesh {
  constructor(gl, params: DynamicPlaneParams) {
    super(gl, {
      ...params,
      transparent: true,
      texture: sextoy,
    })
  }

  isInCollision() {
    this.reset()
  }

  onMouseDown = () => {
    if (this.isHit) thrillSound.play()
  }

  resize = () => {
    super.resize()

    this.rotation.set(0, 0, Math.PI / 2)
    this.position.z = 0.2

    this.initial.z = this.position.z
  }
}
