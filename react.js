import { createRoot }from 'react-dom'
import Wordle from './Wordle.jsx'

let root = createRoot(document.getElementById("root"))
root.render(<Wordle />)