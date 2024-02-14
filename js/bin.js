// --- methods ---

function returnBoardPos(e) {

  //returns correct file and rank position as per returnArrayPos() in chess3.js
  var x = Math.abs(e.clientX - this.boardImage.getBoundingClientRect().left);
  var y = Math.abs(e.clientY - this.boardImage.getBoundingClientRect().top);

  var file = x*8/(this.boardImage.clientWidth) + 1
  var rank = 8 - y*8/(this.boardImage.clientHeight) + 1

  // var file = Math.floor(x*8/(boardImage.clientWidth)) + 1
  // var rank = 8 - Math.floor(y*8/(boardImage.clientHeight))

  // var file = Math.abs(Math.floor(x*8/boardImage.clientWidth) - 7) + 1
  // var rank = Math.floor(y*8/(boardImage.clientHeight)) + 1

  //console.log('F',file,'-R',rank)
}

 function _start(e){

  console.log(e.target)
  
  chessboard.board = e.target.id
  console.log(chessboard.board)
  

  var x = this.getBoardXY(e)[0]
  var y = this.getBoardXY(e)[1]
  var outOfBounds = this.getBoardXY(e)[2]

  if(outOfBounds) {console.log("out of bounds"); return 0}
    
  var file = this.getBoardFR(x,y)[0]
  var rank = this.getBoardFR(x,y)[1]

  console.log("_start")
  
  // selection object should be on front, the parent parent (grandfather node) is the square id which is stored

  // this.startPositionID = e.target.classList[1]
  // this.draggedPieceType = e.target.classList[0]
  // this.draggedElement = e.target
  // console.log(this.draggedPieceType,this.startPositionID)
  // this.F1 = chess3.classToPos(this.startPositionID)[0]   // update numerical start position
  // this.R1 = chess3.classToPos(this.startPositionID)[1]
}

function _move(e){

  chessboard.dragging = true
  console.log("_move")
  // e.stopPropagation()
  // e.stopImmediatePropagation()
  
  // // getting x,y coordinates and checking outofBounds
  // {
  //   var x = this.getBoardXY(e)[0]
  //   var y = this.getBoardXY(e)[1]
  //   var outOfBounds = this.getBoardXY(e)[2]
    
  //   var file = this.getBoardFR(x,y)[0]
  //   var rank = this.getBoardFR(x,y)[1]
  // }
  
  // // add rendering during drag
  // {
  //   // last drag event has coords of 0,0 for some reason, this will ignore that last event
  //   if(e.clientX !== 0 ) {

  //     // if out of bounds
  //       if (outOfBounds) {
  //         this.MoveToSquare.remove()
  //         this.MoveFromSquare.remove()

  //       } else {

  //         this.gameBoard.append(this.MoveToSquare)
  //         this.MoveToSquare.classList.remove(this.MoveToSquare.classList.item(0))
  //         this.MoveToSquare.classList.add(chess3.PosToClass(file,rank))

  //         this.gameBoard.append(this.MoveFromSquare)
  //         this.MoveFromSquare.classList.remove(this.MoveFromSquare.classList.item(0))
  //         this.MoveFromSquare.classList.add(chess3.PosToClass(this.F1,this.R1))

  //         // dragging piece
  //         this.draggedElement.classList.remove(this.startPositionID)            //remove  class temporarly for movement   
  //         this.draggedElement.style.left = (e.clientX - this.boardImage.getBoundingClientRect().left + 'px')
  //         this.draggedElement.style.top = (e.clientY - this.boardImage.getBoundingClientRect().top + 'px')
  //         console.log(this.draggedElement.style.top)
        
  //       }
  //   } 
  // } 
  
}

function _end(e){

  chessboard.dragging = false
  console.log("_end")
  this stops drop from occuring in two squares/ imporant
  e.stopPropgation() 

  //-- remove movement visuals. THIS MUST BE DONE FIRST
  { 
    this.MoveToSquare.remove()
    this.MoveFromSquare.remove()

    this.draggedElement.removeAttribute('style')
  }

  //  -- get x and y coordinates within board
  {
    var x = this.getBoardXY(e)[0]
    var y = this.getBoardXY(e)[1]
    var outOfBounds = this.getBoardXY(e)[2]

    if(outOfBounds) {console.log("out of bounds"); return 0}
    
    var file = this.getBoardFR(x,y)[0]
    var rank = this.getBoardFR(x,y)[1]

  }
 
  // -- checks and validations before confirming class/position change
  {
    this.F2 = file
    this.R2 = rank
    this.endPositionID = chess3.PosToClass(file,rank)
    this.droppedPieceType = this.gameArray[chess3.PosToIndex(this.F2, this.R2)]
  
    this.updateTempArray() // update gameboardaarry for validation checks before comitting

    var validation = chess3.isValid(this.F1, this.R1, this.F2, this.R2, this.tempGameArray, this.gameArray)

    if ( validation == true) {
  
      var capture = this.tryCapture()
      //this.draggedElement.classList.remove(this.startPositionID)
      this.draggedElement.classList.add(this.endPositionID)          
      
      this.gameArray = [...this.tempGameArray]  //Update real game array. (...) is needed to prevent reference copy
      if(capture) {console.log("captures")}
      console.log(this.draggedPieceType,this.endPositionID)


    } else {
  
      this.draggedElement.classList.add(this.startPositionID)   // adding back class removed when piece move was started  
      this.tempGameArray = [...this.gameArray] // reset tempGameArray                     
      console.log("illegal move")
    }
  }

}

function updateTempArray(){

  const startPosArrayValue = chess3.PosToIndex(this.F1,this.R1)
  const endPosArrayValue = chess3.PosToIndex(this.F2,this.R2)
  this.tempGameArray[startPosArrayValue] = ''
  this.tempGameArray[endPosArrayValue] = this.draggedPieceType
}

function flipBoard(){

  if(this.boardViewDir == 'white') {

    document.querySelector("#boadDirStyle").setAttribute("href", "css/squares_black.css")
    this.boardViewDir = 'black'
  } else {

    document.querySelector("#boadDirStyle").setAttribute("href", "css/squares_white.css")
    this.boardViewDir = 'white'
  }
}

function tryCapture(){

  const targetPeice = this.gameBoard.getElementsByClassName(this.endPositionID)[0]

  if (targetPeice == undefined) {return 0} //if it is empty, break

  else {
    // remove peice
    targetPeice.remove()
    return 1
  }

}

function getBoardXY(e){

  var outOfBounds
  const x = e.clientX - this.boardImage.getBoundingClientRect().left;
  const y = e.clientY - this.boardImage.getBoundingClientRect().top;

  //out of bounds tests
  const a = (x > this.boardImage.clientWidth)  || (x < 0)  //x-axis
  const b = (y > this.boardImage.clientHeight) || (y < 0)  //y-axis

  a||b? outOfBounds = 1 : outOfBounds = 0

  //console.log(x,y,outOfBounds)
  return [x,y,outOfBounds]
}

function getAbsBoardXY(e){

  const offsetX = e.clientX - this.boardImage.getBoundingClientRect().left;
  const offsetY = e.clientY - this.boardImage.getBoundingClientRect().top;

  const newLeft = e.clientX - offsetX
  const newTop = e.clientY - offsetY

  return [newLeft,newTop]
}

function getBoardFR(x,y){

  if(this.boardViewDir == "white") {
  
    var file = Math.floor(x*8/(this.boardImage.clientWidth)) + 1
    var rank = 8 - Math.floor(y*8/(this.boardImage.clientHeight))

  } else {
    
    var file = Math.abs(Math.floor(x*8/this.boardImage.clientWidth) - 7) + 1
    var rank = Math.floor(y*8/(this.boardImage.clientHeight)) + 1
  }

  return [file,rank]

}