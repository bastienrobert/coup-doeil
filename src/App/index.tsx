import { h } from 'preact'

import WebGL from '~/components/WebGL'
import Outro from '~/components/Outro'
import Intro from '~/components/Intro'

import './styles.scss'

export default function App() {
  return (
    <div className="App">
      <Intro />
      <WebGL />
    </div>
  )
}
