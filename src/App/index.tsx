import { h } from 'preact'

import WebGL from '~/components/WebGL'
import Outro from '~/components/Outro'

import './styles.scss'

export default function App() {
  return (
    <div className="App">
      <Outro />
      <WebGL />
    </div>
  )
}
