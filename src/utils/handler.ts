import { Vec3 } from 'ogl'

type MouseOffsetHandlerCallback = (init: Vec3) => void

export interface MouseOffsetHandler {
  init: Vec3
  callback: () => void
}

export function mouseOffsetHandler(callback: MouseOffsetHandlerCallback) {
  const init = new Vec3()

  function _callback() {
    callback(init)
  }

  return { init, callback: _callback }
}
