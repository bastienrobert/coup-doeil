import { h } from 'preact'
import { useCallback, useRef } from 'preact/hooks'
import { Howl, Howler } from 'howler'

import grandma from '~/assets/img/grandma.png'
import dog from '~/assets/img/dog_intro.png'

import { intro } from '~/sounds'

import css from './styles.module.scss'

export default function Intro() {
  const isPlaying = useRef(false)

  const onClick = useCallback(() => {
    if (!isPlaying.current) {
      isPlaying.current = true
      intro.play()
    }
  }, [])

  return (
    <div className={css.Intro} onClick={onClick}>
      <h1 className={css.h1}>mamie</h1>
      <img className={css.dog} src={dog} />
      <h2 className={css.h2}>coco</h2>
      <img className={css.grandma} src={grandma} />
      <p className={css.p}>Clique pour commencer</p>
    </div>
  )
}


