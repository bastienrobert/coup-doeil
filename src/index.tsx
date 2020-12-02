import { h, render } from 'preact'
import 'preact/devtools'
import App from './App'

import 'reset-css'
import './styles.css'

const root = document.getElementById('root')
if (root) render(<App />, root)
