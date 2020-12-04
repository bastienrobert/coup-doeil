import { Mesh } from 'ogl'

import DynamicPlane, {
  DynamicPlaneParamsWithColliderCallback,
} from '~/Experience/meshes/DynamicPlane'
import { ColliderMesh, OnCollideParams } from '~/Experience/core/CollidableMesh'

import clock from '~/assets/textures/stuffs/clock.png'

export default class Clock extends DynamicPlane implements ColliderMesh {
  _onCollide: OnCollideParams

  constructor(
    gl,
    { onCollide, ...params }: DynamicPlaneParamsWithColliderCallback,
  ) {
    super(gl, {
      ...params,
      transparent: true,
      texture: clock,
    })

    this._onCollide = onCollide
  }

  isInCollision(mesh: Mesh) {
    if (mesh.name === 'clockShadow') {
      this.moveTo(mesh.position)
      setTimeout(() => {
        this.hide()
      }, 200)
      if (this._onCollide) this._onCollide(this.name, mesh.name)
    }
  }

  resize = () => {
    super.resize()

    this.position.z = 0.8

    this.initial.z = this.position.z
  }
}
