import { h } from 'preact'
import { useCallback, useEffect, useRef, useState } from 'preact/hooks'

import grandma from '~/assets/img/grandma.png'
import arrowL from '~/assets/img/arrowLeft.svg'
import arrowR from '~/assets/img/arrowRight.svg'
import dog from '~/assets/img/dog_intro.png'

import { intro } from '~/sounds'

import css from './styles.module.scss'

export default function Intro() {

  const isPlaying = useRef(false)
  const [pclass, setPclass] = useState(css.p);
  const [dogclass, setDogClass] = useState(css.dog);
  const [isEnd, setIsEnd] = useState(false);
  const [grandmaclass, setGrandmaClass] = useState(css.grandma);
  const [arrowLclass, setarrowLclass] = useState(css.disable);
  const [arrowRclass, setarrowRclass] = useState(css.disable);
  const [spoutnikclass, setspoutnikclass] = useState(css.disable);

  const onEnd = useCallback(() => {
    setIsEnd(true)
  }, [])

  const onClick = useCallback(() => {
    if (!isPlaying.current) {
      isPlaying.current = true
      intro.play()
      intro.on('end', onEnd)
      setPclass(css.disable)
      // setGrandmaClass(css.disable)
      // setDogClass(css.dogMove)
    }

    return () => {
      intro.off('end', onEnd)

    }
  }, [])

  useEffect(() => {
    if (isEnd) {
      setarrowRclass(css.arrowR)
      setarrowLclass(css.arrowL)
    }
  }, [isEnd])

  return (
    <div className={css.Intro} onClick={onClick}>
      <h1 className={css.h1}>mamie</h1>
      <img className={dogclass} src={dog} />
      <h2 className={css.h2}>coco</h2>
      <img className={grandmaclass} src={grandma} />
      <p className={pclass} >Clique pour commencer</p>
      <img className={arrowLclass} src={arrowL} />
      <img className={arrowRclass} src={arrowR} />
      <p className={spoutnikclass} >Remonter Spoutnik</p>
    </div>
  )
}


