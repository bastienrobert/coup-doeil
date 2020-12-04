import { h } from 'preact'
import { useCallback, useEffect, useRef } from 'preact/hooks'
import { Renderer } from 'ogl'

import Experience from '~/Experience'
import Game from '~/Experience/Game'

import useOnResize from '~/hooks/useOnResize'

import css from './styles.module.scss'

export default function WebGL() {
  const canvasRef = useRef<HTMLCanvasElement>()
  const rendererRef = useRef<Renderer>()
  const experienceRef = useRef<Experience>()
  const gameRef = useRef<Game>()

  const onResize = useCallback(() => {
    rendererRef.current.setSize(window.innerWidth, window.innerHeight)
    experienceRef.current.resize()
  }, [rendererRef, experienceRef])

  useEffect(() => {
    rendererRef.current = new Renderer({
      canvas: canvasRef.current,
      // dpr: 2
    })
    gameRef.current = new Game(
      [
        {
          name: 'stuff',
          objects: ['boot', 'bulb', 'clock', 'gears', 'swat'],
        },
        {
          name: 'dog',
          objects: ['qsdf'],
        },
      ],
      'stuff',
    )
    experienceRef.current = new Experience(rendererRef.current, {
      game: gameRef.current,
    })

    return () => {
      experienceRef.current.dispose()
    }
  }, [])

  useOnResize(onResize, true)

  return <canvas className={css.WebGL} ref={canvasRef} />
}
