
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

export default function Wordle() {
  return (
    <div id="screen">
      <h1>Wordy</h1>
      <Grid />
      <Keyboard />
    </div>
  )
}


let secret          = wordList[0]
let history         = ['piano', 'horse', 'toddf']
let currentAttempt  ='wat'

function Grid() {
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

function Keyboard() {
  return (
    <div id="keyboard">
      <h1>  </h1>
    </div>
  );
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