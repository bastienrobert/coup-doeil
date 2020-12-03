import { h } from 'preact'
import { Howl, Howler } from 'howler';

import css from './styles.module.scss'

import dog from '~/assets/img/dog_outro.png'

export default function Outro() {

  const sound = new Howl({
    src: ['/sounds/intro.mp3'],
    autoplay: false,
    volume: 0.5
  });


  return (
    <div className={css.Intro}>
      <h1 className={css.h1}>mamie</h1>
      <h2 className={css.h2}>coco</h2>
      <img className={css.dog} src={dog} />
      <p className={css.p}>Pour en savoir plus, <br />tu peux cliquer ici</p>
    </div >
  )
}


