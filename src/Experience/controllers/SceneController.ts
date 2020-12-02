import { Camera, Transform, Vec2, Vec3 } from 'ogl'

export interface Scene extends Transform {
  name: string
  resize?: () => void
  onBeforeEnter?: () => Promise<void>
  onEnter?: () => Promise<void>
  onBeforeLeave?: () => Promise<void>
  onLeave?: () => Promise<void>
}

export interface SceneParams {
  camera?: Camera
  resolution?: Vec2
  mouse?: Vec3
  mouseNorm?: Vec3
}

export default class SceneController extends Transform {
  _scenes: Scene[]
  _current: Scene

  constructor(scenes: Scene[], first?: string) {
    super()

    this._scenes = scenes
    this._scenes.forEach((s: Scene) => (s.visible = false))
    if (first) this.set(first)
  }

  resize = () => {
    if (this._current.resize) this._current.resize()
  }

  async set(name: string) {
    const previous = this._current
    const next = this._scenes.find((s) => s.name === name)

    // HIDE PREVIOUS SCENE
    if (previous && previous.onBeforeLeave) await previous.onBeforeLeave()
    previous.visible = false
    if (previous && previous.onLeave) await previous.onLeave()

    // HIDE NEXT SCENE
    if (next && next.onBeforeEnter) await next.onBeforeEnter()
    next.visible = true
    if (next && next.onEnter) await next.onEnter()
    return
  }
}
