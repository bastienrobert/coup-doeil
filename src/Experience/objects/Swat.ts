import { Mesh } from 'ogl'

import DynamicPlane, {
  DynamicPlaneParamsWithColliderCallback,
} from '~/Experience/meshes/DynamicPlane'
import { ColliderMesh, OnCollideParams } from '~/Experience/core/CollidableMesh'

import swat from '~/assets/textures/stuffs/swat.png'

export default class Swat extends DynamicPlane implements ColliderMesh {
  _onCollide: OnCollideParams

  constructor(
    gl,
    { onCollide, ...params }: DynamicPlaneParamsWithColliderCallback,
  ) {
    super(gl, {
      ...params,
      transparent: true,
      texture: swat,
    })

    this._onCollide = onCollide
  }

  isInCollision(mesh: Mesh) {
    if (mesh.name === 'swatShadow' || mesh.name === 'swatBlack') {
      this.moveTo(mesh.position)
      setTimeout(() => {
        this.hide()
      }, 200)
      if (this._onCollide) this._onCollide(this.name, mesh.name)
    }
  }

  resize = () => {
    super.resize()

    this.position.z = 0.1

    this.initial.z = this.position.z
  }
}
