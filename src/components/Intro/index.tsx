import { h } from 'preact'
import { Howl, Howler } from 'howler';

import css from './styles.module.scss'

import grandma from '~/assets/img/grandma.png'
import dog from '~/assets/img/dog_intro.png'

export default function Intro() {

  const sound = new Howl({
    src: ['/sounds/intro.mp3'],
    autoplay: false,
    volume: 0.5
  });


  return (
    <div className={css.Intro}>
      <h1 className={css.h1}>mamie</h1>
      <img className={css.dog} src={dog} />
      <h2 className={css.h2}>coco</h2>
      <img className={css.grandma} src={grandma} />
      <p className={css.p}>Clic pour commencer</p>
    </div>
  )
}


