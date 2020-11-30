import { Box, Mesh, Program } from 'ogl'

import vertex from '~/shaders/cube/vertex.glsl'
import fragment from '~/shaders/cube/fragment.glsl'

export default class Cube extends Mesh {
  constructor(gl) {
    super(gl, {
      geometry: new Box(gl, { width: 1, height: 1, depth: 1 }),
      program: new Program(gl, {
        vertex,
        fragment,
      }),
    })
  }
}
