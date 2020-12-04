import DynamicPlane, {
  DynamicPlaneParams,
} from '~/Experience/meshes/DynamicPlane'

import bottle from '~/assets/textures/stuffs/bottle.png'
import { bottle as bottleSound } from '~/sounds'

export default class Bottle extends DynamicPlane {
  constructor(gl, params: DynamicPlaneParams) {
    super(gl, {
      ...params,
      transparent: true,
      texture: bottle,
    })
  }

  onMouseDown = () => {
    if (this.isHit) bottleSound.play()
  }

  resize = () => {
    super.resize()

    this.position.z = 0.2

    this.initial.z = this.position.z
  }
}
