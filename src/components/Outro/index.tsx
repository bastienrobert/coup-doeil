import { h } from 'preact'
import { Howl, Howler } from 'howler';
import { useCallback, useRef } from 'preact/hooks'

import css from './styles.module.scss'

import { outro } from '~/sounds'

import dog from '~/assets/img/dog_outro.png'

export default function Outro() {
  const isPlaying = useRef(false)

  const onClick = useCallback(() => {
    if (!isPlaying.current) {
      isPlaying.current = true
      outro.play()
    }

  }, [])

  return (
    <div className={css.Outro} onClick={onClick}>
      <h1 className={css.h1}>mamie</h1>
      <h2 className={css.h2}>coco</h2>
      <img className={css.dog} src={dog} />
      <p className={css.p}>Pour en savoir plus, <br />tu peux cliquer ici</p>
    </div >
  )
}
