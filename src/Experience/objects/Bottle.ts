import DynamicPlane, {
  DynamicPlaneParams,
} from '~/Experience/meshes/DynamicPlane'

import bottle from '~/assets/textures/stuffs/bottle.png'

export default class Bottle extends DynamicPlane {
  constructor(gl, params: DynamicPlaneParams) {
    super(gl, {
      ...params,
      transparent: true,
      texture: bottle,
    })
  }

  resize = () => {
    super.resize()

    this.position.z = 0.2

    this.initial.z = this.position.z
  }
}
