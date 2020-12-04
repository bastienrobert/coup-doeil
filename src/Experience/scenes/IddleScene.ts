import { Transform } from 'ogl'

import { Scene } from '../controllers/SceneController'

import Spot from '../pass/Spot'

interface IddleSceneParams {
  spot: Spot
}

export default class IddleScene extends Transform implements Scene {
  name = 'iddle'

  _spot: Spot

  constructor({ spot }: IddleSceneParams) {
    super()

    this._spot = spot
  }

  onEnter = async () => {
    this._spot.controlable = false
  }

  onBeforeLeave = async () => {
    // this._spot.transite('WHITE')
    return
  }

  onLeave = async () => {
    this._spot.controlable = true
    this._spot.visible(true)
  }
}
