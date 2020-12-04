import Inrtia from 'inrtia'
import Emitter from '@bastienrobert/events'

type InrtiaValue = number | { [key: string]: any } | any[]

interface IntInrtiaConfig {
  friction: number
  rigidity: number
  interpolation: 'basic' | 'bounce' | 'elastic'
  perfectStop: boolean
  precisionStop: number
}

type SpringConfigWithoutCallback = Omit<SpringConfig, 'callback'>

export type InrtiaConfig = Partial<IntInrtiaConfig>

export interface SpringConfig {
  config?: InrtiaConfig
  callback?: (current?: InrtiaValue, previous?: InrtiaValue) => void
  value: InrtiaValue
}

export interface Spring {
  inrtia: Inrtia
  emitter: Emitter
  set: (params: SpringConfigWithoutCallback) => void
  update: (delta: number) => void
}

export default function spring({
  config = {
    friction: 50,
    rigidity: 0.15,
    interpolation: 'elastic',
    perfectStop: true,
    precisionStop: 0.001,
  },
  callback,
  value,
}: SpringConfig): Spring {
  const inrtia = new Inrtia({ value, ...config })
  const emitter = new Emitter()
  inrtia.previous = 0

  let isOn = false
  const obj = {
    inrtia,
    emitter,
    set: ({ config, value }: SpringConfigWithoutCallback) => {
      if (config) {
        const { precisionStop, perfectStop, ...interpolationParams } = config
        inrtia.interpolationParams = {
          ...inrtia.interpolationParams,
          ...interpolationParams,
        }

        if (precisionStop) inrtia.precisionStop = precisionStop
        if (perfectStop) inrtia.perfectStop = perfectStop
      }
      inrtia.to(value)
    },
    update(delta: number) {
      if (!isOn && !inrtia.stopped) {
        isOn = true
        emitter.emit('on')
      } else if (isOn && inrtia.stopped) {
        isOn = false
        emitter.emit('off')
      }

      inrtia.previous = inrtia.value
      inrtia.update(Math.min(delta, 64))
      if (callback) callback(inrtia.value, inrtia.previous)
    },
  }

  return obj
}
