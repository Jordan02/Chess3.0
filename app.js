const gameBoard = document.querySelector("#gameboard")
const infoDisplay = document.querySelector("#info-display")




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

const boardImage = document.createElement("img")
boardImage.setAttribute("src", 'src/chessboards/green_white.png')
boardImage.classList.add("chessboard")
gameBoard.append(boardImage)

gameBoard.addEventListener('mousemove', returnBoardPos)

function returnBoardPos(e) {

    var x = Math.abs(e.clientX - boardImage.getBoundingClientRect().left);
    var y = Math.abs(e.clientY - boardImage.getBoundingClientRect().top);
    var col = Math.floor(x*8/(boardImage.clientWidth))
    var row = 7 - Math.floor(y*8/(boardImage.clientHeight))

    console.log(row,':',col)

}

function returnArrayPos(pos){

  const row = 7 - Math.floor((pos/8))
  const col = pos - Math.floor((pos/8))*8

  return [row,col]

  // todo: probably need to add out of bound error catches here?

}

function InitBoard(){

const peice = document.createElement("div")

// retrieves square position from peice array
const getpos = returnArrayPos(55)
const squareclass = 'square-'+ getpos[0].toString() + getpos[1].toString()
peice.classList.add(squareclass)

gameBoard.append(peice)

console.log(squareclass)

}

InitBoard()
// function createBoard() {

//   startPieces2.forEach((startpiece,i)=>{
    
//     //creating  square and adding peices
//     const square = document.createElement("div")
//     square.classList.add("square")
//     square.setAttribute("square-id", i)

//     square.append(createPlayer(startpiece))

//     startPieces2[i] !== ''? square.querySelector('.player').setAttribute("id", i) : {}


//     // coloring square by class
//     const row = Math.floor((63 - i)/ 8) +1

//     if( row % 2 === 0) {
//       square.classList.add(i % 2  === 0 ? "white" : "black")
//     } else {
//       square.classList.add(i % 2  === 0 ? "black" : "white")
//     }

    
    
//     gameBoard.append(square)

//   })
// }
// createBoard()
