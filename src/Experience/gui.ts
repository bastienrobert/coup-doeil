import dat from 'dat.gui'
import { Transform } from 'ogl'

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

export default gui
