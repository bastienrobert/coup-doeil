import { Bounds, Camera, Color, Mesh, Transform, Vec2, Vec3 } from 'ogl'

import CollidableMesh from '../core/CollidableMesh'
import CollidablePlane, {
  CollidablePlaneParams,
} from '../meshes/CollidablePlane'

import {
  getScaleFromCameraDistance,
  getWorldMatrix,
  getWorldPositionFromViewportRectPerc,
} from '~/utils/maths'
import {
  applyMatrix4,
  box,
  cloneBox,
  getIsIntersectedBoundingBox,
} from '~/utils/box'

interface PlanesParams extends Omit<CollidablePlaneParams, 'color'> {
  collides: Mesh[]
}

const tmp_vec_3 = new Vec3()
const tmp_bound = box()

export default class Planes extends Transform {
  _camera: Camera
  _resolution: Vec2
  _collidable: Mesh[]
  _colliders: Mesh[]

  alpha: CollidablePlane
  beta: CollidablePlane

  constructor(gl, { camera, resolution, collides }: PlanesParams) {
    super()

    this._camera = camera
    this._resolution = resolution
    this._colliders = []
    this._collidable = collides

    this.alpha = new CollidablePlane(gl, {
      camera,
      resolution,
    })
    this.addChild(this.alpha)
    this._colliders.push(this.alpha)

    this.beta = new CollidablePlane(gl, {
      camera,
      resolution,
    })
    this.addChild(this.beta)
    this._colliders.push(this.beta)
  }

  resize = () => {
    this._camera.updateMatrixWorld()

    getWorldPositionFromViewportRectPerc(
      this._camera,
      { top: 0, left: 0 },
      this._resolution,
      this.alpha.position,
    )
    getWorldMatrix(this.alpha, tmp_vec_3)
    tmp_vec_3.z = 0
    getScaleFromCameraDistance(this._camera, tmp_vec_3, tmp_vec_3)

    this.alpha.scale.copy(tmp_vec_3)
    this.alpha.scale.x *= 1 / 3

    this.alpha.position.x += this.alpha.width
    this.alpha.position.y -= this.alpha.height

    getWorldPositionFromViewportRectPerc(
      this._camera,
      { top: 0, right: 0 },
      this._resolution,
      this.beta.position,
    )

    getWorldMatrix(this.beta, tmp_vec_3)
    tmp_vec_3.z = 0
    getScaleFromCameraDistance(this._camera, tmp_vec_3, tmp_vec_3)

    this.beta.scale.copy(tmp_vec_3)
    this.beta.scale.x *= 1 / 3

    this.beta.position.x -= this.beta.width
    this.beta.position.y -= this.beta.height
  }

  update() {
    // this.resize()
    cloneBox(this.alpha.geometry.bounds, this.alpha.bounds)
    cloneBox(this.beta.geometry.bounds, this.beta.bounds)
    applyMatrix4(this.alpha.bounds, this.alpha.worldMatrix)
    applyMatrix4(this.beta.bounds, this.beta.worldMatrix)

    this._collidable.forEach((mesh: Mesh) => {
      cloneBox(mesh.geometry.bounds, tmp_bound)
      applyMatrix4(tmp_bound, mesh.worldMatrix)

      this._colliders.forEach((m: CollidableMesh) => {
        m.isCollide = getIsIntersectedBoundingBox(m.bounds, tmp_bound)
      })
    })
  }
}
