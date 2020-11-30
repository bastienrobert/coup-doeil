import { h } from 'preact'

import WebGL from '~/components/WebGL'
import HelloWorld from '~/components/HelloWorld'

import './styles.scss'

export default function App() {
  return (
    <div className="App">
      <WebGL />
      <HelloWorld />
    </div>
  )
}
