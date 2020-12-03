export type Stages = StageParams[]

interface StageParams {
  name: string
  objects: string[]
}

class Stage {
  name: string
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
    return Object.values(this._values).every((v) => v)
  }
}

export default class Game {
  _stages: Stages
  current: Stage

  constructor(stages: Stages, init?: string) {
    this._stages = stages
    this.set(init)
  }

  set(name: string) {
    const stage = this._stages.find((s) => s.name === name)
    if (stage) this.current = new Stage(stage)
  }

  push(name: string) {
    if (this.current.has(name)) {
      this.current.set(name, true)
    }
    if (this.current.check()) this.win()
  }

  win() {
    console.log('GOTO NEXT STAGE')
  }
}
