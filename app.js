const gameBoard = document.querySelector("#gameboard")
const infoDisplay = document.querySelector("#info-display")
var BoardDirectionStyle = document.querySelector("#boadDirStyle")

// get board veiwing direction
// note flipping board: will change how peices are rendered, acheived by swapping css style sheets
// starting square reference is changed (bottom left to top right), ahcieved in dragdrop function
BoardDirectionStyle.setAttribute("href","squares_white.css")
BoardDirectionStyle.getAttribute("href") == "squares_black.css"? boardDir = "black" : boardDir = "white"


// peice matrix is always from whites perspective. Don't Change
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

//console.log(startPieces2.reverse())

// note const variables may need to change if ever we want to change peice svg to another style

const boardImage = document.createElement("img")
boardImage.setAttribute("src", 'src/chessboards/green_white.png')
boardImage.classList.add("chessboard")
gameBoard.append(boardImage)


gameBoard.addEventListener('mousemove', returnBoardPos)
function returnBoardPos(e) {

  //returns correct file and rank position as per returnArrayPos() in chess3.js
  var x = Math.abs(e.clientX - boardImage.getBoundingClientRect().left);
  var y = Math.abs(e.clientY - boardImage.getBoundingClientRect().top);
  // var file = Math.floor(x*8/(boardImage.clientWidth))+1
  // var rank = 8 - Math.floor(y*8/(boardImage.clientHeight))

  var file = Math.abs(Math.floor(x*8/boardImage.clientWidth) - 7) + 1
  var rank = Math.floor(y*8/(boardImage.clientHeight)) + 1

  //console.log('F',file,'-R',rank)
}


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


AddPerk('F6-R1')


let startPositionID
let draggedElement
let endPositionID
let draggedPeiceType

/**
 * @param {DragEvent} e - The drag event object
 */

function dragStart(e){

  // selection object should be on front, the parent parent (grandfather node) is the square id which is stored
  startPositionID = e.target.classList[1]
  draggedPeiceType = e.target.classList[0]
  console.log(draggedPeiceType,startPositionID)
  draggedElement = e.target
 
}

function dragOver(e) {

}

function dragEnd(e){
  // this stops drop from occuring in two squares/ imporant
  //e.stopPropgation() 

  //returns correct file and rank position as per returnArrayPos() in chess3.js
  var x = Math.abs(e.clientX - boardImage.getBoundingClientRect().left);
  var y = Math.abs(e.clientY - boardImage.getBoundingClientRect().top);

  //  -- change board start reference based on wheter black or white is viewing
  if(boardDir == "white") {

    var file = Math.floor(x*8/(boardImage.clientWidth))+ 1
    var rank = 8 - Math.floor(y*8/(boardImage.clientHeight))

  } else {

    var file = Math.abs(Math.floor(x*8/boardImage.clientWidth) - 7) + 1
    var rank = Math.floor(y*8/(boardImage.clientHeight)) + 1
  }
  
  // -- checks and validations before confirming class/position change

  endPositionID = 'F' + file.toString() + '-R' + rank.toString()

  if (isValid() == true) {

    draggedElement.classList.remove(startPositionID)
    draggedElement.classList.add(endPositionID)
    console.log(draggedPeiceType,endPositionID)

  } else {

    console.log(draggedPeiceType,endPositionID)
    console.log("illegal move")
  }
  

  
  //e.target.append(draggedElement)
 
}

