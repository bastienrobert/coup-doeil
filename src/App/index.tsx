import { h } from 'preact'
import { useState } from 'preact/hooks'

import WebGL from '~/components/WebGL'
import Outro from '~/components/Outro'
import Intro from '~/components/Intro'

import './styles.scss'

export default function App() {
  const [play, setPlay] = useState(false)
  const [win, setWin] = useState(false)

  return (
    <div className="App">
      <Intro onPlay={setPlay} />
      <Outro win={win} />
      <WebGL play={play} onWin={setWin} />
    </div>
  )
}
