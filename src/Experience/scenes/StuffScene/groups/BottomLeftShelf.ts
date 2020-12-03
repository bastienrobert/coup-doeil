import { Camera, Transform, Vec2, Vec3 } from 'ogl'

import StaticPlane from '~/Experience/meshes/StaticPlane'
import RaycastableMesh, {
  RaycastableGroup,
} from '~/Experience/core/RaycastableMesh'
import { DynamicPlaneParams } from '~/Experience/meshes/DynamicPlane'
import bottomLeftShelf from '~/assets/textures/stuffs/bottomLeftShelf.png'

import RedBall from '~/Experience/objects/RedBall'
import Keys from '~/Experience/objects/Keys'
import Sextoy from '~/Experience/objects/Sextoy'
import Bat from '~/Experience/objects/Bat'

import {
  getScaleFromCameraDistance,
  getWorldMatrix,
  getWorldPositionFromViewportRectPerc,
} from '~/utils/maths'
import { ColliderGroup, ColliderMesh } from '~/Experience/core/CollidableMesh'

const tmp_vec_3 = new Vec3()

const BG_POSITION = { top: 55, left: 25 }
const BG_SIZE = 0.5

export default class BottomLeftShelf
  extends Transform
  implements RaycastableGroup, ColliderGroup {
  raycastables: RaycastableMesh[]
  colliders: ColliderMesh[]

  _background: StaticPlane
  _camera: Camera
  _resolution: Vec2

  _redBall: RedBall
  _keys: Keys
  _sextoy: Sextoy
  _bat: Bat

  constructor(gl, { camera, resolution, mouse }: DynamicPlaneParams) {
    super()

    this._camera = camera
    this._resolution = resolution
    this.raycastables = []
    this.colliders = []

    this._background = new StaticPlane(gl, {
      texture: bottomLeftShelf,
      camera,
      depthWrite: false,
      depthTest: false,
      resolution,
      transparent: true,
    })
    this.addChild(this._background)

    this._redBall = new RedBall(gl, {
      texture: bottomLeftShelf,
      camera,
      mouse,
      sizeOnScreen: 0.1,
      positionOnScreen: { top: 57, left: 5 },
      resolution,
      transparent: true,
    })
    this._redBall.name = 'redBall'
    this.addChild(this._redBall)

    this._sextoy = new Sextoy(gl, {
      texture: bottomLeftShelf,
      camera,
      mouse,
      positionOnScreen: { top: 57, left: 15 },
      sizeOnScreen: 0.2,
      resolution,
      transparent: true,
    })
    this._sextoy.name = 'sextoy'
    this.addChild(this._sextoy)

    this._bat = new Bat(gl, {
      texture: bottomLeftShelf,
      camera,
      mouse,
      positionOnScreen: { top: 62, left: 28 },
      sizeOnScreen: 0.24,
      resolution,
      transparent: true,
    })
    this._bat.name = 'bat'
    this.addChild(this._bat)

    this._keys = new Keys(gl, {
      texture: bottomLeftShelf,
      camera,
      mouse,
      sizeOnScreen: 0.1,
      positionOnScreen: { top: 65, left: 35 },
      resolution,
      transparent: true,
    })
    this._keys.name = 'keys'
    this.addChild(this._keys)

    this.raycastables.push(this._redBall, this._sextoy, this._bat, this._keys)
    this.colliders.push(this._redBall, this._sextoy, this._keys)
  }

  resize = () => {
    getWorldPositionFromViewportRectPerc(
      this._camera,
      BG_POSITION,
      this._resolution,
      this._background.position,
    )
    getWorldMatrix(this._background, tmp_vec_3)
    // tmp_vec_3.z = 0
    getScaleFromCameraDistance(this._camera, tmp_vec_3, tmp_vec_3)
    this._background.scale.set(tmp_vec_3.x)
    this._background.scale.multiply(BG_SIZE)
    this._background.position.z = 1

    this._redBall.resize()
    this._keys.resize()
    this._sextoy.resize()
    this._bat.resize()
  }

  update(t) {
    this._redBall.update(t)
    this._keys.update(t)
    this._sextoy.update(t)
    this._bat.update(t)
  }
}
