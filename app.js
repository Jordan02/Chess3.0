const gameBoard = document.querySelector("#gameboard")
const playerDisplay = document.querySelector("#player")
const infoDisplay = document.querySelector("#info-display")
const width = 8



const startPieces2 = [

  'bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR',
  'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP',
  'wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'
  
]

// note const variables may need to change if ever we want to change peice svg to another style


function createBoard() {

  startPieces2.forEach((startpiece,i)=>{
    
    //creating  square and adding peices
    const square = document.createElement("div")
    square.classList.add("square")
    square.setAttribute("square-id", i)

    square.append(createPlayer(startpiece))

    startPieces2[i] !== ''? square.querySelector('.player').setAttribute("id", i) : {}


    // coloring square by class
    const row = Math.floor((63 - i)/ 8) +1

    if( row % 2 === 0) {
      square.classList.add(i % 2  === 0 ? "white" : "black")
    } else {
      square.classList.add(i % 2  === 0 ? "black" : "white")
    }

    
    
    gameBoard.append(square)

  })
}

createBoard()
