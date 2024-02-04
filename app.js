const gameBoard = document.querySelector("#gameboard")
const infoDisplay = document.querySelector("#info-display")
const body = document.getElementsByTagName("body")[0]

document.body.style.cursor = 'src/killstreaks/duckingjam.png'

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

// //move
// gameBoard.addEventListener('mousemove', returnBoardPos)
// function returnBoardPos(e) {

  // //returns correct file and rank position as per returnArrayPos() in chess3.js
  // var x = Math.abs(e.clientX - boardImage.getBoundingClientRect().left);
  // var y = Math.abs(e.clientY - boardImage.getBoundingClientRect().top);
  // var file = Math.floor(x*8/(boardImage.clientWidth))
  // var rank = 7 - Math.floor(y*8/(boardImage.clientHeight))

//   console.log(rank,':',file)
// }



function InitBoard(){
  startPieces2.forEach((startpiece, i) => {

    if(startpiece !== '') {

      const piece = document.createElement('piece')

      // instantiate intial peices 
      const getpos = returnArrayPos(i)
      const squareclass = 'F' + getpos[0].toString() + '-R' +getpos[1].toString()
      piece.classList.add(startpiece)
      piece.classList.add(squareclass)
      piece.setAttribute("draggable",true)

      // adding image
      const pieceImage = document.createElement("img")
      const url = 'src/peices/merida/' + startpiece + '.svg'
      pieceImage.setAttribute("src", url)
      pieceImage.classList.add("pieceIcon")
      pieceImage.setAttribute("draggable",false)
      piece.append(pieceImage)

      //adding event listeners
      piece.addEventListener("dragstart",dragStart)
      piece.addEventListener("dragend",dragEnd)
      piece.addEventListener("dragover",dragOver)

      gameBoard.append(piece)
    }
  })
}

InitBoard()

// receives square ID as a string
function AddPerk(squareClassID){

piece = document.getElementsByClassName(squareClassID)[0]

//create perk container and add perks
perkContainer = document.createElement("div")
perkContainer.classList.add("perk-container")
perkContainer.setAttribute("draggable",false)

perk1 = document.createElement("img")
perk1.classList.add("perk")
perk1.setAttribute("draggable",false)
perk1.setAttribute("src", 'src/killstreaks/quick_revive.png')
perkContainer.append(perk1)

perk2 = document.createElement("img")
perk2.classList.add("perk")
perk2.setAttribute("draggable",false)
perk2.setAttribute("src", 'src/killstreaks/msc_trinity.png')
perkContainer.append(perk2)



piece.append(perkContainer)
}

AddPerk('F3-R0')


let startPositionID
let draggedElement
let endPositionID


/**
 * @param {DragEvent} e - The drag event object
 */

function dragStart(e){

  // selection object should be on front, the parent parent (grandfather node) is the square id which is stored
  startPositionID = e.target.classList[1]
  console.log(startPositionID)
  draggedElement = e.target
  body.style.cursor = 'grabbing'
}

function dragOver(e) {

  //
}

function dragEnd(e){
  // this stops drop from occuring in two squares/ imporant
  //e.stopPropgation() 

  //returns correct file and rank position as per returnArrayPos() in chess3.js
  var x = Math.abs(e.clientX - boardImage.getBoundingClientRect().left);
  var y = Math.abs(e.clientY - boardImage.getBoundingClientRect().top);
  var file = Math.floor(x*8/(boardImage.clientWidth)).toString()
  var rank = 7 - Math.floor(y*8/(boardImage.clientHeight)).toString()

  out = 'F' + file + '-R' + rank

  draggedElement.classList.remove(startPositionID)
  draggedElement.classList.add(out)

  document.body.style.cursor = "default"

  console.log(out)
  //e.target.append(draggedElement)
 
}
