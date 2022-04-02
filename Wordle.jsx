
import { useState, useContext, useEffect, useRef } from 'react'
import { KeyContext } from './context'

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

export default function Wordle() {
  let [history, setHistory] = useState([])
  let [currentAttempt, setCurrentAttempt] = useState('')
  let [bestColors, setBestColors] = useState(() => new Map())
  // let [isAnimating, setIsAnimating] = useState(false)
  let loadedRef = useRef(false)

  // useEffect(() => {
  //   if (loadedRef.current) {
  //     console.log(currentAttempt)
  //     return
  //   }
  //   loadedRef.current = true
  //   let savedHistory = loadHistory()
  //   console.log("saved history: ", savedHistory)
  //   if (savedHistory) {
  //     setHistory(savedHistory)
  //   }
  //   console.log("history state: ", history)
  // })
  
  // useEffect(() => {
  //   console.log("saving this history: ", history)
  //   saveHistory(history)
  // }, [history])

  function handleKeyDown(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) {
      return;
    }
    // if (isAnimating) {
    //   return;
    // }
    handleKey(e.key.toLowerCase())
  }
  
  function handleKey(letter) {
    console.log("handling key")
    letter = letter.toLowerCase();
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
        saveHistory(newHistory)
        setTimeout(() => alert(secret.toUpperCase()), 2100);
        return
      }
      if (currentAttempt === secret) {
        let newHistory = [...history, currentAttempt]
        setBestColors(calculateBestColors(newHistory))
        setHistory(newHistory)
        setCurrentAttempt('')
        setTimeout(() => alert("WINNER"), 2100);

        return
      }
      let newHistory = [...history, currentAttempt]
      setHistory(newHistory)
      setCurrentAttempt('')
      saveHistory(newHistory)
      //TODO: pauseInput()
      setBestColors(calculateBestColors(newHistory))
      
    } else if ( letter === 'backspace') {
      setCurrentAttempt(currentAttempt.slice(0,-1))
    } else if (/^[a-z]$/.test(letter)) {
      console.log("adding letter")
      if (currentAttempt.length < 5) {
        console.log("setting current attempt")
        console.log("history: ", history)
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
      <KeyContext.Provider value={handleKey}>
        <h1>Wordy</h1>
        <Grid history={history} currentAttempt={currentAttempt} />
        <Keyboard onKey={handleKey} bestColors={bestColors}/>
      </KeyContext.Provider>
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

function Keyboard({ onKey, bestColors}) {
  return (
    <div id="keyboard">
      <KeyboardRow letters={"qwertyuiop"}  isLast={false} bestColors={bestColors} onKey={onKey}/>
      <KeyboardRow letters={"asdfghjkl"}  isLast={false} bestColors={bestColors} onKey={onKey}/>
      <KeyboardRow letters={"zxcvbnm"}  isLast={true} bestColors={bestColors} onKey={onKey}/>
    </div>
  );
}

function KeyboardRow( { letters, isLast, onKey, bestColors }) {
  let buttons = []
  if (isLast) {
    buttons.push(<Button key="enter" buttonKey="Enter"> Enter </Button>)
  }
  for (let letter of letters) {
    buttons.push(<Button key={letter} color={bestColors.get(letter)} buttonKey={letter}> { letter } </Button>)
  }
  if (isLast) {
    buttons.push(<Button key="backspace" buttonKey="Backspace"> Back </Button>)
  }
  return (
    <div className="keyboardRow">
      {buttons}
    </div>
  )
}

function Button({ buttonKey, children, color=LIGHTGREY }) {
  const handleKey  = useContext(KeyContext)
  return (
    <button className="button"
            id={buttonKey}
            style={{
              backgroundColor: color
            }}
            onClick={() => {
              handleKey(buttonKey)
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

function loadHistory() {
  let data
  try {
    data = JSON.parse(localStorage.getItem('data'));
  } catch {}
  if (data !== null) {
    if (data.secret === secret) {
      console.log("returning history")
      return Object.values(data.history)
    }
  }
}
function saveHistory(history) {
  let data = JSON.stringify({
    secret,
    history
  })
  try {
    localStorage.setItem('data', data) 
    console.log("saving historys")
  } catch { 
    console.log("failed to save history")
  }
}

function calculateBestColors(history) {
  let map = new Map()
  for (let attempt of history) { 
    for (let i = 0; i < attempt.length; i++) {
      let color = getBgColor(attempt, i)
      let key   = attempt[i]
      let bestColor = map.get(key)
      map.set(key, getBetterColor(color, bestColor))
    }
  }
  
  return map
}

function getBetterColor(a, b) {
  if (a === GREEN || b === GREEN) {
    return GREEN
  }
  if (a === YELLOW || b === YELLOW) {
    return YELLOW
  }

  return GREY
}