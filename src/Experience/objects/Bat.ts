import DynamicPlane, {
  DynamicPlaneParams,
} from '~/Experience/meshes/DynamicPlane'
import bat from '~/assets/textures/stuffs/bat.png'

export default class Bat extends DynamicPlane {
  constructor(gl, params: DynamicPlaneParams) {
    super(gl, {
      ...params,
      transparent: true,
      texture: bat,
    })
  }

  resize = () => {
    super.resize()

    this.rotation.set(0, 0, -Math.PI / 2)
    this.position.z = 0.4

    this.initial.z = this.position.z
  }
}
