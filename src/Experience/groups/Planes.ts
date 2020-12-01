import { Camera, Color, Transform, Vec2, Vec3 } from 'ogl'

import Plane, { PlaneParams } from '../meshes/Plane'

import {
  getScaleFromCameraDistance,
  getWorldMatrix,
  getWorldPositionFromViewportRectPerc,
} from '~/utils/maths'

type PlanesParams = Omit<PlaneParams, 'color'>

const tmp_vec_3 = new Vec3()

export default class Planes extends Transform {
  _camera: Camera
  _resolution: Vec2

  _alpha: Plane
  _beta: Plane

  constructor(gl, { camera, resolution }: PlanesParams) {
    super()

    this._camera = camera
    this._resolution = resolution

    this._alpha = new Plane(gl, {
      color: new Color(0.8, 0.2, 1.0),
      camera,
      resolution,
    })
    this.addChild(this._alpha)
    this._beta = new Plane(gl, {
      color: new Color(1.0, 0.8, 0.2),
      camera,
      resolution,
    })
    this.addChild(this._beta)
  }

  resize = () => {
    getWorldPositionFromViewportRectPerc(
      this._camera,
      { top: 0, left: 0 },
      this._resolution,
      this._alpha.position,
    )
    getWorldMatrix(this._alpha, tmp_vec_3)
    getScaleFromCameraDistance(this._camera, tmp_vec_3, tmp_vec_3)

    this._alpha.scale.set(tmp_vec_3)
    this._alpha.scale.x *= 1 / 3

    this._alpha.position.x += this._alpha.width
    this._alpha.position.y -= this._alpha.height

    getWorldPositionFromViewportRectPerc(
      this._camera,
      { top: 0, right: 0 },
      this._resolution,
      this._beta.position,
    )

    getWorldMatrix(this._beta, tmp_vec_3)
    getScaleFromCameraDistance(this._camera, tmp_vec_3, tmp_vec_3)

    this._beta.scale.set(tmp_vec_3)
    this._beta.scale.x *= 1 / 3

    this._beta.position.x -= this._beta.width
    this._beta.position.y -= this._beta.height
  }
}
