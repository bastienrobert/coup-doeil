import { Camera, Transform, Vec2, Vec3 } from 'ogl'

export interface Scene extends Transform {
  name: string
  resize?: () => void
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
  mouseNorm?: Vec3
}

export default class SceneController extends Transform {
  scenes: Scene[]
  name: string
  _current: Scene

  constructor(scenes: Scene[], first?: string) {
    super()

    this.scenes = scenes
    this.scenes.forEach((s: Scene) => {
      this.addChild(s)
      s.visible = false
    })

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

  async set(name: string) {
    const previous = this._current
    const next = this.scenes.find((s) => s.name === name)

    // HIDE PREVIOUS SCENE
    if (previous) {
      if (previous.onBeforeLeave) await previous.onBeforeLeave()
      previous.visible = false
      if (previous.onLeave) await previous.onLeave()
    }

    // HIDE NEXT SCENE
    if (next) {
      if (next.onBeforeEnter) await next.onBeforeEnter()
      next.visible = true
      if (next.onEnter) await next.onEnter()
    }

    this._current = next
    this.name = next.name
    return
  }

  update = (t: number) => {
    if (this._current?.update) this._current.update(t)
  }
}
