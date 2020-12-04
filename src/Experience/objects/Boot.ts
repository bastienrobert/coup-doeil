import { Mesh } from 'ogl'

import DynamicPlane, {
  DynamicPlaneParamsWithColliderCallback,
} from '~/Experience/meshes/DynamicPlane'
import { ColliderMesh, OnCollideParams } from '~/Experience/core/CollidableMesh'

import boot from '~/assets/textures/stuffs/boot.png'

export default class Boot extends DynamicPlane implements ColliderMesh {
  _onCollide: OnCollideParams

  constructor(
    gl,
    { onCollide, ...params }: DynamicPlaneParamsWithColliderCallback,
  ) {
    super(gl, {
      ...params,
      transparent: true,
      texture: boot,
    })

    this._onCollide = onCollide
  }

  isInCollision(mesh: Mesh) {
    if (mesh.name === 'bootShadow') {
      this.moveTo(mesh.position)
      setTimeout(() => {
        this.hide()
      }, 200)
      if (this._onCollide) this._onCollide(this.name, mesh.name)
    }
  }

  resize = () => {
    super.resize()

    this.rotation.z = -Math.PI / 2
    this.position.z = 0.3
    this.resetSize()

    this.initial.z = this.position.z
  }
}
