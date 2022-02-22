'use strict'
let wordList = [
  'patio',
  'darts',
  'piano',
  'raise'
];

function buildGrid() {
  for (let i = 0; i < 6; i++) {
    let row = document.createElement('div')
    for (let j = 0; j< 5; j++) {
      let cell = document.createElement('div')
      cell.className    = 'cell'
      cell.textContent  = ' '
      row.appendChild(cell)
    }
    grid.appendChild(row) 
  }
}

let randomIndex     = Math.floor(Math.random() * wordList.length)
let secret          = wordList[randomIndex];
let currentAttempt  = '';
let history        = [];
let grid = document.getElementById('grid')

buildGrid();
updateGrid();
window.addEventListener('keydown', handleKeyDown);

function handleKeyDown(e) {
  let letter = e.key.toLowerCase();
  if (letter === 'enter') {
    if (currentAttempt.length < 5) {
      console.log("premature enter");
    } 
    if (!wordList.includes(currentAttempt)) {
      alert('Not a word!');
      return;
    }
    history.push(currentAttempt);
    currentAttempt = ''
    
  } else if ( letter === 'backspace') {
    console.log(letter);
    currentAttempt = currentAttempt.slice(0,-1)
    
    
  } else if (/[a-z]/.test(letter)) {
    if (currentAttempt.length < 5) {
      currentAttempt += letter;
    }
    else{
      console.log("not adding charcter")
    }
  }
  updateGrid();
}

function updateGrid() {
  let row  = grid.firstChild
  for (let attempt of history) {
    drawAttempt(row, attempt, false)
    row = row.nextSibling
  }
  drawAttempt(row, currentAttempt, true)
  // history.push(currentAttempt)
}

function drawAttempt(row, attempt, isCurrent) {
  for (let i=0; i < 5; i++) {
    let cell = row.children[i];
    if (attempt[i] !== undefined) {
      cell.textContent = attempt[i];
    } else {
      cell.innerHTML = '<div style="opacity:0">X</div>';
    }
    if (isCurrent) {
      cell.style.backgroundColor  = 'white'
      cell.style.color = 'black'
    } else {
      cell.style.backgroundColor  = getBgColor(attempt, i)
      cell.style.color = 'white';
    }
  }
  
}

function getBgColor(attempt, index) {
  let correctLetter  = secret[index]
  let attemptLetter  = attempt[index]
  if (attemptLetter === undefined) { return }
  if (correctLetter === attemptLetter) {
    return '#6aaa64'
  }
  if (secret.indexOf(attemptLetter) === -1) {
    return '#939598'
  }
  return '#c9b458'
}

// document.addEventListener('click', updateGrid)