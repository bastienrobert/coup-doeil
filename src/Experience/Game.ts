import Emitter from '@bastienrobert/events'

export type Stages = StageParams[]

interface StageParams {
  name: string
  objects: string[]
}

class Stage {
  name: string
  won: boolean
  _values: { [key: string]: boolean }

  constructor(params: StageParams) {
    this.name = params.name
    this._values = {}

    params.objects.forEach((n) => {
      this._values[n] = false
    })
  }

  has(name: string) {
    return name in this._values
  }

  set(name: string, value: boolean) {
    this._values[name] = value
  }

  check() {
    // return Object.values(this._values).every((v) => v)
    return true
  }
}

export default class Game extends Emitter {
  _stages: Stages
  index: number
  current: Stage

  constructor(stages: Stages, init?: string) {
    super()

    this._stages = stages
    this.set(init)
  }

  set(name: string) {
    const index = this._stages.findIndex((s) => s.name === name)
    if (index !== undefined) {
      const stage = this._stages[index]
      this.index = index
      this.current = new Stage(stage)
    }
  }

  reset() {
    // this.emit('set', 'stuff')
    this.emit('set', 'dog')
  }

  push(name: string) {
    if (this.current.has(name)) {
      this.current.set(name, true)
    }
    if (this.current.check()) this.win(this.current.name)
  }

  win = (name) => {
    if (this.current.won) return
    if (this.index === this._stages.length - 1) {
      this.emit('gameover')
    }
    this.current.won = true
    this.emit('win', name)
  }
}
