import { h } from 'preact'
import { useCallback, useEffect, useRef, useState } from 'preact/hooks'
import anime from 'animejs'

import grandma from '~/assets/img/grandma.png'
import arrowL from '~/assets/img/arrowLeft.svg'
import arrowR from '~/assets/img/arrowRight.svg'
import dog from '~/assets/img/dog_intro.png'
import bg_button from '~/assets/img/button_intro.svg'

import { intro } from '~/sounds'

import css from './styles.module.scss'

export default function Intro({ onPlay }) {
  const isPlaying = useRef(false)
  const componentRef = useRef<HTMLDivElement>()
  const [pclass, setPclass] = useState(css.p)
  const [dogclass, setDogClass] = useState(css.dog)
  const [isEnd, setIsEnd] = useState(false)
  const [grandmaclass, setGrandmaClass] = useState(css.grandma)
  const [arrowLclass, setarrowLclass] = useState(css.disable)
  const [arrowRclass, setarrowRclass] = useState(css.disable)
  const [toggleClass, setToggleClass] = useState(false)

  const onKeyDown = (event) => {
    if (
      (event.code === 'ArrowLeft' && isEnd) ||
      (event.code === 'ArrowRight' && isEnd)
    ) {
      setGrandmaClass(css.disable)
      setDogClass(css.dogMove)
      setToggleClass(true)
    }
  }

  const onEnd = useCallback(() => {
    setIsEnd(true)
  }, [])

  const onClick = useCallback(() => {
    if (!isPlaying.current) {
      isPlaying.current = true
      intro.play()
      intro.on('end', onEnd)
      setPclass(css.disable)
    }

    return () => {
      intro.off('end', onEnd)
    }
  }, [])

  const onStartClick = useCallback(() => {
    onPlay(true)
    anime({
      targets: componentRef.current,
      opacity: 0,
      duration: 800,
      easing: 'easeInOutExpo',
      complete: () => {
        componentRef.current.style.visibility = 'hidden'
      },
    })
  }, [componentRef])

  useEffect(() => {
    if (isEnd) {
      setarrowRclass(css.arrowR)
      setarrowLclass(css.arrowL)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isEnd])

  return (
    <div
      ref={componentRef}
      className={css.Intro}
      onClick={onClick}>
      <h1 className={css.h1}>mamie</h1>
      <img className={dogclass} src={dog} />
      <h2 className={css.h2}>coco</h2>
      <img className={grandmaclass} src={grandma} />
      <p className={pclass}>Clique pour commencer</p>
      <img className={arrowLclass} src={arrowL} />
      <img className={arrowRclass} src={arrowR} />
      <img
        onClick={onStartClick}
        className={toggleClass ? css.bg_spoutnik : css.disable}
        src={bg_button}
      />
    </div>
  )
}
