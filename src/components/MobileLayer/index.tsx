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

export default function MobileLayer() {
  return (
    <div className={css.MobileLayer}>
      <h1 className={css.h1}>mamie</h1>
      <img className={css.dog} src={dog} />
      <h2 className={css.h2}>coco</h2>
      <img className={css.grandma} src={grandma} />
      <p className={css.p}>Passe en mode paysage!</p>
    </div>
  )
}
