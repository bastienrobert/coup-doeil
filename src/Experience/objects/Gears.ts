import { Mesh } from 'ogl'

import DynamicPlane, {
  DynamicPlaneParamsWithColliderCallback,
} from '~/Experience/meshes/DynamicPlane'
import { ColliderMesh, OnCollideParams } from '~/Experience/core/CollidableMesh'

import gears from '~/assets/textures/stuffs/gears.png'

export default class Gears extends DynamicPlane implements ColliderMesh {
  _onCollide: OnCollideParams

  constructor(
    gl,
    { onCollide, ...params }: DynamicPlaneParamsWithColliderCallback,
  ) {
    super(gl, {
      transparent: true,
      texture: gears,
      ...params,
    })

    this._onCollide = onCollide
  }

  isInCollision(mesh: Mesh) {
    if (mesh.name === 'gearsShadow' || mesh.name === 'gearsBlack') {
      this.moveTo(mesh.position)
      setTimeout(() => {
        this.hide()
      }, 200)
      if (this._onCollide) this._onCollide(this.name, mesh.name)
    }
  }

  resize = () => {
    super.resize()

    this.position.z = 0.6

    this.initial.z = this.position.z
  }
}
