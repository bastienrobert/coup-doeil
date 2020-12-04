import { Camera, Transform, Vec2, Vec3 } from 'ogl'

import Game from '../Game'
import RaycastableMesh from '../core/RaycastableMesh'

export interface Scene extends Transform {
  name: string
  resize?: () => void
  raycastable?: RaycastableMesh[]
  onBeforeEnter?: () => Promise<void>
  onEnter?: () => Promise<void>
  onBeforeLeave?: () => Promise<void>
  onLeave?: () => Promise<void>
  onMouseDown?: () => void
  onMouseMove?: () => void
  onMouseUp?: () => void
  update?: (t: number) => void
}

export interface SceneParams {
  camera?: Camera
  resolution?: Vec2
  mouse?: Vec3
  game?: Game
}

export default class SceneController extends Transform {
  scenes: Scene[]
  name: string
  raycastable: RaycastableMesh[]
  _current: Scene

  constructor(scenes: Scene[], first?: string) {
    super()

    this.scenes = scenes
    this.scenes.forEach((s: Scene) => {
      this.addChild(s)
      s.visible = false
    })

    this.raycastable = []
    if (first) this.set(first)
  }

  resize = () => {
    if (this._current?.resize) this._current.resize()
  }

  onMouseDown = () => {
    if (this._current?.onMouseDown) this._current.onMouseDown()
  }

  onMouseMove = () => {
    if (this._current?.onMouseMove) this._current.onMouseMove()
  }

  onMouseUp = () => {
    if (this._current?.onMouseUp) this._current.onMouseUp()
  }

  set = async (name: string) => {
    const previous = this._current
    const next = this.scenes.find((s) => s.name === name)
    this.name = next.name

    // HIDE PREVIOUS SCENE
    if (previous) {
      if (previous.onBeforeLeave) previous.onBeforeLeave()
      this.raycastable = []
      previous.visible = false
      if (next?.resize) next.resize()
      if (previous.onLeave) await previous.onLeave()
    }

    // HIDE NEXT SCENE
    if (next) {
      if (next.onBeforeEnter) next.onBeforeEnter()
      next.visible = true
      if (next.raycastable) this.raycastable = next.raycastable
      if (next.onEnter) await next.onEnter()
    }

    this._current = next
    return
  }

  update = (t: number) => {
    if (this._current?.update) this._current.update(t)
  }
}
