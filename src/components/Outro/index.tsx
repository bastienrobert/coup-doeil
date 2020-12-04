import { h } from 'preact'
import { useCallback, useEffect, useRef } from 'preact/hooks'
import anime from 'animejs'

import css from './styles.module.scss'

import { outro } from '~/sounds'

import dog from '~/assets/img/dog_outro.png'

export default function Outro({ win }) {
  const componentRef = useRef<HTMLDivElement>()
  const isPlaying = useRef(false)

  const onClick = useCallback(() => {
    if (!isPlaying.current) {
      isPlaying.current = true
      outro.play()
    }
  }, [])

  useEffect(() => {
    if (win)
      anime({
        targets: componentRef.current,
        opacity: 1,
        duration: 800,
        easing: 'easeInOutExpo',
        begin: () => {
          componentRef.current.style.visibility = 'visible'
        },
      })
  }, [win])

  return (
    <div className={css.Outro} ref={componentRef} onClick={onClick}>
      <h1 className={css.h1}>mamie</h1>
      <h2 className={css.h2}>coco</h2>
      <img className={css.dog} src={dog} />
      <p className={css.p}>
        Pour en savoir plus, <br />
        tu peux cliquer ici
      </p>
    </div>
  )
}
