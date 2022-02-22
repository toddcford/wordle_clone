'use strict'

let GREEN     = '#6aaa64'
let GREY      = '#939598'
let LIGHTGREY = '#d3d6da';
let YELLOW    = '#c9b458'
let wordList  = [
  'patio',
  'darts',
  'piano',
  'raise',
  'tacit',
  'other',
  'court',
  'jesus',
  'boobs',
  'titty',
  'otter',
  'caulk',
  'pizza',
  'swill',
  'penis',
  'swarm'
];

function buildGrid() {
  for (let i = 0; i < 6; i++) {
    let row = document.createElement('div')
    for (let j = 0; j< 5; j++) {
      let cell = document.createElement('div')
      cell.className    = 'cell'
      cell.textContent  = ''
      row.appendChild(cell)
    }
    grid.appendChild(row) 
  }
}

let randomIndex     = Math.floor(Math.random() * wordList.length)
let secret          = wordList[randomIndex];
let currentAttempt  = '';
let history         = [];
let grid            = document.getElementById('grid');
let keyboard        = document.getElementById('keyboard');
let keyboardButtons = new Map();
let green_buttons   = new Set();
let yellow_buttons  = new Set();
let grey_buttons    = new Set();

buildGrid();
buildKeyboard();
updateGrid();
window.addEventListener('keydown', handleKeyDown);

function handleKeyDown(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) {
    return;
  }
  let letter = e.key.toLowerCase();

  if (letter === 'enter') {
    if (currentAttempt.length < 5) {
      console.log("premature enter");
    } 
    if (!wordList.includes(currentAttempt)) {
      alert('Not a word!');
      return;
    }
    if (currentAttempt === secret) {
      updateGrid();
      setTimeout(() => alert("WINNER"), 250);
    }
    history.push(currentAttempt);
    currentAttempt = ''
  } else if ( letter === 'backspace') {
    console.log(letter);
    currentAttempt = currentAttempt.slice(0,-1)
  } else if (/^[a-z]$/.test(letter)) {
    if (currentAttempt.length < 5) {
      currentAttempt += letter;
    }
    else{
      console.log("not adding charcter")
    }
  }
  updateGrid();
  updateKeyboard();
}

function handleKey(key) {
  console.log(key)
  let letter = key.toLowerCase();

  if (letter === 'enter') {
    if (currentAttempt.length < 5) {
      console.log("premature enter");
    } 
    if (!wordList.includes(currentAttempt)) {
      alert('Not a word!');
      return;
    }
    if (currentAttempt === secret) {
      updateGrid();
      setTimeout(() => alert("WINNER"), 250);
    }
    history.push(currentAttempt);
    currentAttempt = ''
    
  } else if ( letter === '<-') {
    console.log(letter);
    currentAttempt = currentAttempt.slice(0,-1)
    
    
  } else if (/^[a-z]$/.test(letter)) {
    console.log('success')
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
  document.getElementById("enter").focus();
  document.getElementById("enter").blur();
  // history.push(currentAttempt)
}

function drawAttempt(row, attempt, isCurrent) {
  for (let i=0; i < 5; i++) {
    let cell = row.children[i];
    if (attempt[i] !== undefined) {
      cell.textContent = attempt[i];
    } else {
      cell.innerHTML = '<div style="opacity:0">X</div>';
      // cell.textContent = attempt[i]
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
    green_buttons.add(attemptLetter)
    return GREEN
  }
  if (secret.indexOf(attemptLetter) === -1) {
    grey_buttons.add(attemptLetter)
    return GREY
  }
  yellow_buttons.add(attemptLetter);
  return YELLOW
}

function buildKeyboard() {
  buildKeyboardRow('qwertyuiop', false);
  buildKeyboardRow('asdfghjkl', false);
  buildKeyboardRow('zxcvbnm', true);
}

function buildKeyboardRow(letters, isLastRow) {
  let keyboardRow = document.createElement('div')
  keyboardRow.className = 'keyboardRow'
  if (isLastRow) {
    let key = document.createElement('button')
    key.className = 'key';
    key.id = 'enter';
    key.textContent = 'Enter';
    key.style.backgroundColor = LIGHTGREY;
    key.style.fontSize = '12px';
    key.onclick = () => {
      handleKey(key.textContent);
    }
    keyboardRow.appendChild(key);  
  }
  for (let i = 0; i < letters.length; i++) {
    let key = document.createElement('button')
    key.className = 'key';
    key.textContent = letters[i];
    key.style.backgroundColor = LIGHTGREY;
    key.onclick = () => {
      console.log("clicked")
      handleKey(key.textContent);
    }
    keyboardButtons.set(letters[i], key);
    keyboardRow.appendChild(key);
  }
  if (isLastRow) {
    let key = document.createElement('button')
    key.className = 'key';
    key.textContent = '<-';
    key.style.backgroundColor = LIGHTGREY;
    key.onclick = () => {
      handleKey(key.textContent)
    }
    keyboardRow.appendChild(key);
  }
  keyboard.appendChild(keyboardRow);
}

function updateKeyboard() {
  console.log("updating keyboard")
  for (let [key, button] of keyboardButtons) {
    if (green_buttons.has(key)) {
      button.style.backgroundColor = GREEN;
    } else if (yellow_buttons.has(key)) {
      button.style.backgroundColor = YELLOW;
    } else if (grey_buttons.has(key)) {
      button.style.backgroundColor = GREY;
    }
  }
}