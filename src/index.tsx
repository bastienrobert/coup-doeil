import { h, render } from 'preact'
import 'preact/devtools'
import App from './App'

import './styles.css'
import 'reset-css'

const root = document.getElementById('root')
if (root) render(<App />, root)
