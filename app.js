const gameBoard = document.querySelector("#gameboard")
const infoDisplay = document.querySelector("#info-display")
var BoardDirectionStyle = document.querySelector("#boadDirStyle")

// get board veiwing direction
// note flipping board: will change how peices are rendered, acheived by swapping css style sheets
// starting square reference is changed (bottom left to top right), ahcieved in dragdrop function
BoardDirectionStyle.setAttribute("href","squares_white.css")
BoardDirectionStyle.getAttribute("href") == "squares_black.css"? boardDir = "black" : boardDir = "white"

let startPositionID
let endPositionID
let draggedElement
let draggedPieceType   // type of peice being dragged
let droppedPieceType   // type of piece dragged piece is dropped into

let gameArray          // it's more effience to update a game array, then parse this, than to getelementbyclassname
let tempGameArray      // this array is updated for validation purposes become being committed

let pos1_f
let pos1_r
let pos2_f
let pos2_r

// peice matrix is always from whites perspective. Don't Change
// const startPieces2 = [

//   'bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR',
//   'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP',
//   '', '', '', '', '', '', '', '',
//   '', '', '', '', '', '', '', '',
//   '', '', '', '', '', '', '', '',
//   '', '', '', '', '', '', '', '',
//   'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP',
//   'wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'
  
// ]

const startPieces2 = [

  'bQ', 'bR', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', 'wB', 'wQ'
  
]

// note const variables may need to change if ever we want to change peice svg to another style

const boardImage = document.createElement("img")
boardImage.setAttribute("src", 'src/chessboards/resin_ocean.png')
boardImage.classList.add("chessboard")
gameBoard.append(boardImage)

gameBoard.addEventListener('mousemove', returnBoardPos)
function returnBoardPos(e) {

  //returns correct file and rank position as per returnArrayPos() in chess3.js
  var x = Math.abs(e.clientX - boardImage.getBoundingClientRect().left);
  var y = Math.abs(e.clientY - boardImage.getBoundingClientRect().top);

  var file = x*8/(boardImage.clientWidth) + 1
  var rank = 8 - y*8/(boardImage.clientHeight) + 1

  // var file = Math.floor(x*8/(boardImage.clientWidth)) + 1
  // var rank = 8 - Math.floor(y*8/(boardImage.clientHeight))

  // var file = Math.abs(Math.floor(x*8/boardImage.clientWidth) - 7) + 1
  // var rank = Math.floor(y*8/(boardImage.clientHeight)) + 1

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

  tempGameArray = startPieces2
  gameArray = startPieces2
  //AddPerk('F6-R1')
  //AddPerk('F2-R8')
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
perk1.setAttribute("src", 'src/killstreaks/duckingjam.png')
perkContainer.append(perk1)

perk2 = document.createElement("img")
perk2.classList.add("perk")
perk2.setAttribute("draggable",false)
perk2.setAttribute("src", 'src/killstreaks/msc_trinity.png')
perkContainer.append(perk2)

piece.append(perkContainer)

}

/**
 * @param {DragEvent} e - The drag event object
 */

function dragStart(e){

  // selection object should be on front, the parent parent (grandfather node) is the square id which is stored
  startPositionID = e.target.classList[1]
  draggedPieceType = e.target.classList[0]
  console.log(draggedPieceType,startPositionID)
  draggedElement = e.target
  pos1_f = returnPiecePos(startPositionID)[0]    // update numerical start position
  pos1_r = returnPiecePos(startPositionID)[1]
 
}

function dragOver(e) {

}

function dragEnd(e){
  // this stops drop from occuring in two squares/ imporant
  //e.stopPropgation() 

  //returns correct file and rank position as per returnArrayPos() in chess3.js
  var x = e.clientX - boardImage.getBoundingClientRect().left;
  var y = e.clientY - boardImage.getBoundingClientRect().top;

  //check if drop outside of gamebaord
  a = (x > boardImage.clientWidth)  || (x < 0)  //x-axis
  b = (y > boardImage.clientHeight) || (y < 0)  //y-axis

  if( a || b ) {

    console.log("out of bounds")

    return 0
  }

  //  -- change board start reference based on wheter black or white is viewing
  if(boardDir == "white") {

    var file = Math.floor(x*8/(boardImage.clientWidth)) + 1
    var rank = 8 - Math.floor(y*8/(boardImage.clientHeight))

  } else {

    var file = Math.abs(Math.floor(x*8/boardImage.clientWidth) - 7) + 1
    var rank = Math.floor(y*8/(boardImage.clientHeight)) + 1
  }
  
  // -- checks and validations before confirming class/position change

  endPositionID = 'F' + file.toString() + '-R' + rank.toString()
  pos2_f = file
  pos2_r = rank

  droppedPieceType = gameArray[returnSingleArrayPos(pos2_f, pos2_r)]

  updateTempArray() // update gameboardaarry for validation checks before comitting

  if (isValid() == true) {

    const capture = tryCapture()
    draggedElement.classList.remove(startPositionID)
    draggedElement.classList.add(endPositionID)
    
    gameArray = [...tempGameArray]  //Update real game array. (...) is needed to prevent reference copy
    if(capture) {console.log("captures")}
    console.log(draggedPieceType,endPositionID)

  } else {

    
    tempGameArray = [...gameArray] // reset tempGameArray                      ///start here, WHY IS THE TEMP AND GAME ARRAY NOT UPDATING PROPERLY, Got it working, not work on using arrays for gameboard logic, and storing possible moves
    console.log(draggedPieceType,endPositionID)
    console.log("illegal move")
  }
  
}

function test() {

a = ['wp','rt','t3']


console.log(a)
console.log(a[0])
console.log(a[0][0])

}

test()

