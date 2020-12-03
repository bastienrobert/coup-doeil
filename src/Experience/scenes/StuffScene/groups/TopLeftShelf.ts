import { Camera, Transform, Vec2, Vec3 } from 'ogl'

import StaticPlane from '~/Experience/meshes/StaticPlane'
import RaycastableMesh, {
  RaycastableGroup,
} from '~/Experience/core/RaycastableMesh'
import { ColliderGroup, ColliderMesh } from '~/Experience/core/CollidableMesh'
import { DynamicPlaneParams } from '~/Experience/meshes/DynamicPlane'
import topLeftShelf from '~/assets/textures/stuffs/topLeftShelf.png'

import Boot from '../objects/Boot'
import Bone from '../objects/Bone'
import GreenBall from '../objects/GreenBall'
import Fork from '../objects/Fork'
import RedRectangle from '../objects/RedRectangle'

import {
  getScaleFromCameraDistance,
  getWorldMatrix,
  getWorldPositionFromViewportRectPerc,
} from '~/utils/maths'
import gui, { newGUIScreenTransform } from '~/Experience/gui'

const tmp_vec_3 = new Vec3()

const BG_POSITION = { top: 30, left: 7 }
const BG_SIZE = 0.7

export default class TopLeftShelf
  extends Transform
  implements RaycastableGroup, ColliderGroup {
  raycastables: RaycastableMesh[]
  colliders: ColliderMesh[]

  _background: StaticPlane
  _camera: Camera
  _resolution: Vec2

  _boot: Boot
  _bone: Bone
  _greenBall: GreenBall
  _fork: Fork
  _redRectangle: RedRectangle

  constructor(gl, { camera, resolution, mouse }: DynamicPlaneParams) {
    super()

    this._camera = camera
    this._resolution = resolution
    this.raycastables = []
    this.colliders = []

    this._background = new StaticPlane(gl, {
      texture: topLeftShelf,
      camera,
      depthWrite: false,
      depthTest: false,
      resolution,
      transparent: true,
    })
    this.addChild(this._background)

    this._redRectangle = new RedRectangle(gl, {
      texture: topLeftShelf,
      camera,
      resolution,
      transparent: true,
    })
    this.addChild(this._redRectangle)

    this._boot = new Boot(gl, {
      texture: topLeftShelf,
      camera,
      mouse,
      resolution,
      transparent: true,
    })
    this._boot.name = 'boot'
    this.addChild(this._boot)

    this._bone = new Bone(gl, {
      texture: topLeftShelf,
      camera,
      mouse,
      resolution,
      transparent: true,
    })
    this._bone.name = 'bone'
    this.addChild(this._bone)

    this._fork = new Fork(gl, {
      texture: topLeftShelf,
      camera,
      mouse,
      resolution,
      transparent: true,
    })
    this._fork.name = 'fork'
    this.addChild(this._fork)

    this._greenBall = new GreenBall(gl, {
      texture: topLeftShelf,
      camera,
      mouse,
      resolution,
      transparent: true,
    })
    this._greenBall.name = 'greenBall'
    this.addChild(this._greenBall)

    this.raycastables.push(this._boot, this._bone, this._fork, this._greenBall)
    this.colliders.push(this._boot, this._bone, this._fork, this._greenBall)
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
    this._background.position.z = 0.05

    this._boot.resize()
    this._bone.resize()
    this._greenBall.resize()
    this._fork.resize()
    this._redRectangle.resize()
  }

  update(t) {
    this._boot.update(t)
    this._bone.update(t)
    this._greenBall.update(t)
    this._fork.update(t)
  }

  _initGUI() {
    const c = gui.addFolder('topLeftShelf')
    newGUIScreenTransform('bone', this._bone, this._camera, this._resolution, c)
  }
}
