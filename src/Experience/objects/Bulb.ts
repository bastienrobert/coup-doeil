import { Mesh } from 'ogl'

import DynamicPlane, {
  DynamicPlaneParamsWithColliderCallback,
} from '~/Experience/meshes/DynamicPlane'
import { ColliderMesh, OnCollideParams } from '~/Experience/core/CollidableMesh'

import bulb from '~/assets/textures/stuffs/bulb.png'

export default class Bulb extends DynamicPlane implements ColliderMesh {
  _onCollide: OnCollideParams

  constructor(
    gl,
    { onCollide, ...params }: DynamicPlaneParamsWithColliderCallback,
  ) {
    super(gl, {
      ...params,
      transparent: true,
      texture: bulb,
    })

    this._onCollide = onCollide
  }

  isInCollision(mesh: Mesh) {
    if (mesh.name === 'bulbShadow' || mesh.name === 'bulbBlack') {
      this.moveTo(mesh.position)
      setTimeout(() => {
        this.hide()
      }, 200)
      if (this._onCollide) this._onCollide(this.name, mesh.name)
    }
  }

  resize = () => {
    super.resize()

    this.position.z = 0.5

    this.initial.z = this.position.z
  }
}
