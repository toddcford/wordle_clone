
import { useState, useEffect } from 'react'
let BLACK       = '#666'
let GREEN       = '#6aaa64'
let GREY        = '#939598'
let BORDERGREY  = '#aaa';
let LIGHTGREY   = '#d3d6da'
let YELLOW      = '#c9b458'

let wordList = [
  'patio',
  'darts',
  'piano',
  'horse',
  'hello',
  'water',
  'pizza',
  'sushi',
  'crabs'
]

let secret          = wordList[0]
// let history         = ['piano', 'horse', 'toddf']
// let currentAttempt  ='wat'


export default function Wordle() {
  let [history, setHistory] = useState([])
  let [currentAttempt, setCurrentAttempt] = useState('')
  let [isAnimating, setIsAnimating] = useState(false)

  function handleKeyDown(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) {
      return;
    }
    if (isAnimating) {
      return;
    }
    handleKey(e.key.toLowerCase())
  }

  function handleKey(letter) {
    if (letter === 'enter') {
      if (currentAttempt.length < 5) {
        console.log("premature enter");
        return //Maybe wrong?
      } 
      if (!wordList.includes(currentAttempt)) {
        alert('Not a word!');
        return;
      }
      if (history.length === 5 && currentAttempt != secret) {
        setHistory([...history, currentAttempt])
        setTimeout(() => alert(secret.toUpperCase()), 2100);
      }
      if (currentAttempt === secret) {
        setTimeout(() => alert("WINNER"), 2100);
      }
      setHistory([...history, currentAttempt])
      setCurrentAttempt('')

      // updateKeyboard()
      //TODO: saveGame()
      //TODO: pauseInput()
      
    } else if ( letter === 'backspace') {
      setCurrentAttempt(currentAttempt.slice(0,-1))
    } else if (/^[a-z]$/.test(letter)) {
      if (currentAttempt.length < 5) {
        setCurrentAttempt(currentAttempt + letter)
        // animatePress(currentAttempt.length - 1)
      }
    }    
  }
 
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown )
    return () => window.removeEventListener('keydown', handleKeyDown)
  })  
  return (
    <div id="screen">
      <h1>Wordy</h1>
      <Grid history={history} currentAttempt={currentAttempt} />
      <Keyboard onKey={handleKey}/>
    </div>
  )
}

function Grid( { currentAttempt, history }) { 
  let rows = [];
  for (let i = 0; i < 6; i++) {
    if (i < history.length) {
      rows.push(
        <Attempt 
          key={i}
          attempt={history[i]}
          solved={true} 
        />
      )
    } else if (i === history.length) {
      rows.push(
        <Attempt
          key={i}
          attempt={currentAttempt}
          solved={false}
        />
      )
    } else {
      rows.push(
        <Attempt
          key={i}
          attempt=''
          solved={false}
        />
      )
    }
  }
  return (
    <div id="grid">
      {rows}
    </div>
  );
}


function Cell({letter, attempt, index, solved}) {
  let content;
  let hasLetter = attempt[index] !== undefined
  let color   = getBgColor(attempt, index);
  if (attempt[index]) {
    content = attempt[index];
  } else {
    content = <div style={{opacity: 0}}>X</div>
  }
  return (
    <div className={"cell " + (solved ? "solved" : "")}>
      <div className="surface" style={{
        transitionDelay: (index * 300) + "ms"
      }}>
        <div 
          className="front" 
          style={{
            backgroundColor: 'white',
            borderColor: hasLetter ? BLACK : BORDERGREY
          }}>
          {content}
        </div>
        <div 
          className="back"
          style= {{
            backgroundColor: color,
            borderColor: color
          }}
        >
          {content}
        </div>
      </div>
    </div>
  )
}

function Keyboard({ onKey }) {
  return (
    <div id="keyboard">
      <KeyboardRow letters={"qwertyuiop"} onKey={onKey}  isLast={false}/>
      <KeyboardRow letters={"asdfghjkl"} onKey={onKey} isLast={false}/>
      <KeyboardRow letters={"zxcvbnm"} onKey={onKey} isLast={true}/>
    </div>
  );
}

function KeyboardRow( { letters, onKey, isLast }) {
  let buttons = []
  if (isLast) {
    buttons.push(<Button key="enter" onKey={onKey} buttonKey="Enter"> Enter </Button>)
  }
  for (let letter of letters) {
    buttons.push(<Button key={letter} onKey={onKey} buttonKey={letter}> { letter } </Button>)
  }
  if (isLast) {
    buttons.push(<Button key="backspace" onKey={onKey} buttonKey="Backspace"> Back </Button>)
  }
  return (
    <div className="keyboardRow">
      {buttons}
    </div>
  )
}

function Button({ buttonKey, onKey, children }) {
  return (
    <button className="button"
            id={buttonKey}
            style={{
              backgroundColor: LIGHTGREY
            }}
            onClick={() => {
              onKey(buttonKey)
            }}
    > {children} </button>
  )
}



function Attempt({attempt, solved}) {
  let cells =[]
  for (let i = 0; i < 5; i++) {
    cells.push(
      <Cell
        key={i}
        attempt={attempt}
        index={i}
        solved={solved}
      />
    )
  }
  return (
    <div> { cells } </div>
  )
}

function getBgColor(attempt, i) {
   let correctLetter = secret[i];
   let attemptLetter = attempt[i];
   if (
     attemptLetter === undefined || secret.indexOf(attemptLetter) === -1
   ) {
     return GREY;
   }
   if (correctLetter == attemptLetter) {
     return GREEN;
   }
   return YELLOW;
}