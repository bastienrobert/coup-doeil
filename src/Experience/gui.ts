import dat from 'dat.gui'
import { Camera, Transform, Vec2, Vec3 } from 'ogl'

import {
  getScaleFromCameraDistance,
  getWorldMatrix,
  getWorldPositionFromViewportRectPerc,
} from '~/utils/maths'

const gui = new dat.GUI()

export function newGUITransform(name: string, object: Transform, parent = gui) {
  const c = parent.addFolder(name)
  const pos = c.addFolder('position')
  pos.add(object.position, 'x').step(0.1)
  pos.add(object.position, 'y').step(0.1)
  pos.add(object.position, 'z').step(0.1)

  const rot = c.addFolder('rotation')
  rot.add(object.rotation, 'x').step(0.1)
  rot.add(object.rotation, 'y').step(0.1)
  rot.add(object.rotation, 'z').step(0.1)

  const sca = c.addFolder('scale')
  sca.add(object.scale, 'x').step(0.1)
  sca.add(object.scale, 'y').step(0.1)
  sca.add(object.scale, 'z').step(0.1)

  return c
}

const tmp_vec_3 = new Vec3()
const tmp_vec_32 = new Vec3()
export function newGUIScreenTransform(
  name: string,
  object: Transform,
  camera: Camera,
  resolution: Vec2,
  parent = gui,
) {
  const c = parent.addFolder(name)

  const size = new Vec3()
  getWorldMatrix(object, size)
  getScaleFromCameraDistance(camera, size, size)

  const tmp: any = {
    reset: () => {
      tmp.position.right = 0
      tmp.position.bottom = 0

      onChange()
    },
    position: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    size: (1 / size.x) * 0.5,
  }

  const onChange = () => {
    if (tmp.position.bottom) tmp.position.top = null
    if (tmp.position.right) tmp.position.left = null

    getWorldPositionFromViewportRectPerc(
      camera,
      tmp.position,
      resolution,
      object.position,
    )
    ;(object as any)._initial?.copy(object.position)

    // compute object size to fit in viewport
    getWorldMatrix(object, tmp_vec_32)
    getScaleFromCameraDistance(camera, tmp_vec_32, tmp_vec_32)

    object.scale.set(
      tmp.size * tmp_vec_32.x,
      tmp.size * tmp_vec_32.x,
      tmp.size * tmp_vec_32.x,
    )
  }

  c.add(tmp, 'reset')

  c.add(tmp.position, 'top').step(0.1).onChange(onChange)
  c.add(tmp.position, 'left').step(0.1).onChange(onChange)
  c.add(tmp.position, 'right').step(0.1).onChange(onChange)
  c.add(tmp.position, 'bottom').step(0.1).onChange(onChange)

  c.add(tmp, 'size', 0, 1, 0.01).onChange(onChange)

  const rot = c.addFolder('rotation')
  rot.add(object.rotation, 'x', 0, Math.PI * 2, 0.01)
  rot.add(object.rotation, 'y', 0, Math.PI * 2, 0.01)
  rot.add(object.rotation, 'z', 0, Math.PI * 2, 0.01)

  return c
}

export default gui
