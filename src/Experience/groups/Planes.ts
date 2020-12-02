import { Bounds, Camera, Color, Transform, Vec2, Vec3 } from 'ogl'

import Plane, { PlaneParams } from '../meshes/Plane'

import {
  getScaleFromCameraDistance,
  getWorldMatrix,
  getWorldPositionFromViewportRectPerc,
} from '~/utils/maths'
import { applyMatrix4, cloneBox } from '~/utils/box'

type PlanesParams = Omit<PlaneParams, 'color'>

interface PlanesBounds {
  alpha: Bounds
  beta: Bounds
}

const tmp_vec_3 = new Vec3()

export default class Planes extends Transform {
  _camera: Camera
  _resolution: Vec2

  alpha: Plane
  beta: Plane
  bounds: PlanesBounds

  constructor(gl, { camera, resolution }: PlanesParams) {
    super()

    this._camera = camera
    this._resolution = resolution

    this.alpha = new Plane(gl, {
      color: new Color(0.8, 0.2, 1.0),
      camera,
      resolution,
    })
    this.addChild(this.alpha)
    this.alpha.geometry.computeBoundingBox()

    this.beta = new Plane(gl, {
      color: new Color(1.0, 0.8, 0.2),
      camera,
      resolution,
    })
    this.addChild(this.beta)
    this.beta.geometry.computeBoundingBox()

    this.bounds = {
      alpha: cloneBox(this.alpha.geometry.bounds),
      beta: cloneBox(this.beta.geometry.bounds),
    }
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
    cloneBox(this.alpha.geometry.bounds, this.bounds.alpha)
    cloneBox(this.beta.geometry.bounds, this.bounds.beta)
    applyMatrix4(this.bounds.alpha, this.alpha.worldMatrix)
    applyMatrix4(this.bounds.beta, this.beta.worldMatrix)
  }
}
