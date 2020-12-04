import { h } from 'preact'
import { useCallback, useEffect, useRef } from 'preact/hooks'
import { Renderer } from 'ogl'

import Experience from '~/Experience'
import Game from '~/Experience/Game'

import useOnResize from '~/hooks/useOnResize'

import css from './styles.module.scss'

interface WebGLParams {
  play: boolean
  onWin: (payload: boolean) => void
}

export default function WebGL({ play, onWin }: WebGLParams) {
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

    const onInternalWin = () => onWin(true)
    gameRef.current.on('gameover', onInternalWin)
    experienceRef.current = new Experience(rendererRef.current, {
      game: gameRef.current,
    })

    return () => {
      gameRef.current.off('gameover', onInternalWin)
      experienceRef.current.dispose()
    }
  }, [])

  useEffect(() => {
    if (play && gameRef.current) {
      gameRef.current.reset()
    }
  }, [play, gameRef])

  useOnResize(onResize, true)

  return <canvas className={css.WebGL} ref={canvasRef} />
}
