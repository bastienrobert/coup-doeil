import { Mesh, Vec3 } from 'ogl'

import DynamicPlane, {
  DynamicPlaneParams,
} from '~/Experience/meshes/DynamicPlane'
import { ColliderMesh } from '~/Experience/core/CollidableMesh'

import bulb from '~/assets/textures/stuffs/bulb.png'

import { getScaleFromCameraDistance, getWorldMatrix } from '~/utils/maths'

const tmp_vec_3 = new Vec3()

const POSITION = { top: 63, left: 60 }
const SIZE = 0.12

export default class Bulb extends DynamicPlane implements ColliderMesh {
  constructor(gl, { camera, resolution, mouse }: DynamicPlaneParams) {
    super(gl, {
      transparent: true,
      texture: bulb,
      mouse,
      positionOnScreen: {
        top: POSITION.top,
        left: POSITION.left,
      },
      camera,
      resolution,
    })
  }

  isInCollision(mesh: Mesh) {
    if (mesh.name === 'bulbShadow') {
      this.moveTo(mesh.position)
      setTimeout(() => {
        this.hide()
      }, 200)
    }
  }

  resize = () => {
    super.resize()

    this.position.z = 0.4
    getWorldMatrix(this, tmp_vec_3)
    getScaleFromCameraDistance(this._camera, tmp_vec_3, tmp_vec_3)
    this.scale.set(tmp_vec_3.x)
    this.scale.multiply(SIZE)

    this.initial.z = this.position.z
  }
}
