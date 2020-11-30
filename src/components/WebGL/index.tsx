import { h } from 'preact'
import { useEffect, useRef } from 'preact/hooks'
import { Renderer } from 'ogl'

import Experience from '~/Experience'

import useOnResize from '~/hooks/useOnResize'

import css from './styles.module.scss'

export default function WebGL() {
  const canvasRef = useRef<HTMLCanvasElement>()
  const rendererRef = useRef<Renderer>()
  const experienceRef = useRef<Experience>()

  useEffect(() => {
    rendererRef.current = new Renderer({
      canvas: canvasRef.current,
    })
    experienceRef.current = new Experience(rendererRef.current)

    return () => {
      experienceRef.current.dispose()
    }
  }, [])

  useOnResize(() => {
    rendererRef.current.setSize(window.innerWidth, window.innerHeight)
    experienceRef.current.resize()
  }, true)

  return <canvas className={css.WebGL} ref={canvasRef} />
}
