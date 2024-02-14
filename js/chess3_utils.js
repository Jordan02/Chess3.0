

/**
 * Returns file and row posistion from a single array index of a 64-element array.
 * @param {number} pos - The single array position.
 * @returns {Array<number>} An array where [0] represents file and [1] represents row.
 * @todo Might need out-of-bounds error handling.
 */
export function IndexToPos(pos){

  const row = 7 - Math.floor((pos/8)) + 1
  const file = pos - Math.floor((pos/8))*8 + 1

  return [file,row]
  //return {"file": file, "row" : row}

}


/**
 * Calculates the single array position from given file and row numbers.
 * @param {number} file - The file number.
 * @param {number} row - The row number.
 * @returns {number} The single array position calculated based on the file and row numbers.
 */
export function PosToIndex(file,row)
{
  var F = file - 1
  var R = row - 1
  return (F + (7-R)*8)
}


/**
 * Extracts file and row numbers from the piece class ID.
 * @param {string} pieceClassID - The piece class ID, e.g., "F1-R7".
 * @returns {Array<number>} An array containing the file and row numbers extracted from the piece class ID.
 */
export function classToPos(pieceClassID) {
  return [Number(pieceClassID[1]), Number(pieceClassID[4])];

}


/**
 * Converts file and rank number position to a piece class ID.
 * @param {number} file - The file number.
 * @param {number} rank - The rank number.
 * @returns {string} The piece class ID.
 */
export function PosToClass(file, rank) {
  
  return "F" + file + "-R" + rank;
}

/**
 * tests wheter coordinates are inside of baord or not
 * @param {number} file - The file number.
 * @param {number} rank - The rank number.
 * @returns {boolean} boolean answer whether pos is out of the board bounds or not
 */
export function isBound(file, rank) {
  
  return !(file > 8 || file < 1 || rank > 8 || rank < 1)
}


/**
 * Checks whether a move is valid or not 
 * @param {number} F1 - Starting file number
 * @param {number} R1 - Starting rank number
 * @param {number} F2 - End file number, after move
 * @param {number} R2 - End rank number, after move
 * @param {Array<number>} newGameArray - temporary array of board posistion with move "F1,R1" -> "F2,R2" committed
 * @param {Array<number>} gameArray - Current/Live array of board posistion without move "F1,R1" -> "F2,R2" committed
 * @returns {boolean} Boolean value confirming wheter move "F1,R1" -> "F2,R2" is valid/ dosen't break chess rules
 */
export function isValid(F1, R1, F2, R2, newGameArray, gameArray) {

  // check if end position has a piece 
  const endPosPieceType = gameArray[PosToIndex(F2,R2)]
  const startPosPieceType = gameArray[PosToIndex(F1,R1)]
  
  if (endPosPieceType !== '' ) {

    // check if both peices are are the same color
    if(endPosPieceType[0] == startPosPieceType[0]) {
      
      return 0
    }
  } 

  // // TODO need to add enpassent and castling to finish this
  // // TODO need to add isKinginCheck conditions
  switch(startPosPieceType){

    case 'wP' :

      //1 step forward rule
      if(R1 !== 2) {

        if(R2 - R1 > 1) {return 0}                                    // only allow 1 step forard
        if(endPosPieceType !== '' && F2 == F1) {return 0}             // prevent moving forward into peice
        if(F2 !== F1 && endPosPieceType == '' || R2 == R1) {return 0} // diagonal capture rule

      } 

      // first move exception for 2 steps
      else {
        
        if(R2-R1>2)   {return 0}                            // allow two step
        if(endPosPieceType !== '' && F2 == F1) {return 0}   // prevent moving forward into peice
        if((F2 !== F1) && (R2-R1 == 2)) {return 0}          // prevent diagonal moves when stepping twice
        if(F2 !== F1 && endPosPieceType == '') { return 0}  // diagonal capture rule
      }

      //no moving backwards
      if(R2 < R1) {return 0}
      

      break

    case 'bP' :
      // same as white, but  reverses
      //1 step forward rule
      if(R1 !== 7) {
        
        if(R1 - R2 > 1) {return 0}                          // only allow 1 step forard
        if(endPosPieceType !== '' && F2 == F1) {return 0} // prevent moving forward into peice
        if(F2 !== F1 && endPosPieceType == '' || R2 == R1) {return 0} // diagonal capture rule
      } 

      // first move exception for 2 steps
      else {
        
        if(R1-R2>2)   {return 0}                            // allow two step
        if(endPosPieceType !== '' && F2 == F1) {return 0} // prevent moving forward into peice
        if((F2 !== F1) && (R2-R1 == 2)) {return 0}  // prevent diagonal moves when stepping twice
        if(F2 !== F1 && endPosPieceType == '') {return 0} // diagonal capture rule
      }

      if(R2 > R1) {return 0}  //no moving backwards
      

      break

    case 'wN' :
    case 'bN' :
      
      var a = Math.abs(R2 - R1) == 1 && Math.abs(F2 - F1) == 2
      var b = Math.abs(R2 - R1) == 2 && Math.abs(F2 - F1) == 1
      if ( !(a || b)) { return 0 }
      break

    case'wB' :
    case'bB' :

      if ( Math.abs((R2 - R1)/(F2 - F1)) !== 1) {return 0}   // checking for diagonal move, uisng dx/dy == 1
      if(testCollision(F1,R1,F2,R2,newGameArray, gameArray)) {return 0}              // test collision
      break

    case 'wR':
    case 'bR' :
      
      if (!(F2 == F1 || R2 == R1)) {return 0}    // checking if movement is not veritcal or horizontal
      if(testCollision(F1,R1,F2,R2,newGameArray, gameArray)) {return 0}  // checking if collision has occured
      break

    case 'wQ':
    case 'bQ':
      
      var a = !(F2 == F1 || R2 == R1)              // horizontal, vertical check
      var b = Math.abs((R2 - R1)/(F2 - F1)) !== 1  // diagonal check
      if ( a && b) {return 0}                                      // combine both
  
      if(testCollision(F1,R1,F2,R2,newGameArray, gameArray)) {return 0}    // test collision
      break

    case 'wK':
    case 'bK':  
      
      var a = Math.abs(R2 - R1) > 1  // vertical 1 step check
      var b = Math.abs(F2 - F1) > 1  // vertical 1 step check
      if(a || b) {return 0}

      break
    
  }
  
  return 1

}


/**
 * Checks whether a move would result in a collision
 * @param {number} F1 - Starting file number
 * @param {number} R1 - Starting rank number
 * @param {number} F2 - End file number, after move
 * @param {number} R2 - End rank number, after move
 * @param {Array<number>} newGameArray - temporary array of board posistion with move "F1,R1" -> "F2,R2" committed
 * @param {Array<number>} gameArray - Current/Live array of board posistion without move "F1,R1" -> "F2,R2" committed
 * @returns {boolean} Boolean value confirming wheter move "F1,R1" -> "F2,R2" iwould result in collosion
 */
export function testCollision(F1,R1,F2,R2,newGameArray, gameArray){

  let dx
  let dy
  let x
  let y

  //check if vertical movement

  if (F2 == F1) { 

    R2/R1 > 1? dy = 1 : dy = -1 //movement dir

    x = F1       // vert movement has constant x
    y = R1 + dy  //start loop 1 from start position       

    // loop through all pos between start and end, and break if piece is encounted
    while ( y !== R2) {

      var a = gameArray[PosToIndex(x,y)] // checking if square has a peice
      if (a !== '') {return 1} // if there is a peice, break
      y+=dy
    }
  }

  // check if horziontal movement
  else if (R2 == R1) {
    
    F2/F1 > 1? dx = 1 : dx = -1 //movement dir

    y = R1       // horz movement has constant y
    x = F1 + dx  //start loop 1 from start position

    // loop through all pos between start and end, and break if piece is encounted
    while ( x !== F2) {

      var a = gameArray[PosToIndex(x,y)] // checking if square has a peice
      if (a !== '') {return 1} // if there is a peice, break
      x+=dx
    }


  }

  // else movement is diagonal
  else {
    R2/R1 > 1? dy = 1 : dy = -1
    F2/F1 > 1? dx = 1 : dx = -1

    y = R1 + dy  //start loop 1 from start position
    x = F1 + dx  //start loop 1 from start position

    // loop through all pos between start and end, and break if piece is encounted
    while ( x !== F2) {

      var a = gameArray[PosToIndex(x,y)] // checking if square has a peice
      if (a !== '') {return 1} // if there is a peice, break

      x+=dx
      y+=dy
    }

    

  }

  return 0
}

/**
 * returns the x and y coordinates relative to top left of board image (down = pos, right = pos), and if the result is out of board frame
 * @param {event} e - Starting file number
 * @param {HTMLImageElement} board_img - Starting rank number
 * @returns {Array<number>} [0]= x coord, [1] = y coord, [2] = boolean for if out of bounds
 */
export function getBoardXY(e, board_img){

  var outOfBounds
  const x = e.clientX - board_img.getBoundingClientRect().left;
  const y = e.clientY - board_img.getBoundingClientRect().top;

  //out of bounds tests
  const a = (x > board_img.clientWidth)  || (x < 0)  //x-axis
  const b = (y > board_img.clientHeight) || (y < 0)  //y-axis

  a||b? outOfBounds = 1 : outOfBounds = 0

  //console.log(x,y,outOfBounds)
  return [x,y,outOfBounds]
}

/**
 * returns the file and rank posistion, WILL NOT be bound to board size. E.g F-2 R10 is possible
 * @param {event} e - Starting file number
 * @param {HTMLImageElement} board_img - Starting rank number
 * @param {string} board_dir - board perspective, either 'white' or 'black'
 * @returns {Array<number>} [0]= File number, [1] = Rank number
 */
export function getBoardFR(e,board_img,board_dir) {

  var outOfBounds
  const x = e.clientX - board_img.getBoundingClientRect().left;
  const y = e.clientY - board_img.getBoundingClientRect().top;

  //out of bounds tests
  const a = (x > board_img.clientWidth)  || (x < 0)  //x-axis
  const b = (y > board_img.clientHeight) || (y < 0)  //y-axis

  a||b? outOfBounds = 1 : outOfBounds = 0


  if(board_dir == "white") {
  
    var file = Math.floor(x*8/(board_img.clientWidth)) + 1
    var rank = 8 - Math.floor(y*8/(board_img.clientHeight))

  } else {
    
    var file = Math.abs(Math.floor(x*8/board_img.clientWidth) - 7) + 1
    var rank = Math.floor(y*8/(board_img.clientHeight)) + 1
  }

  return [file,rank]
}

/**
 * returns the file and rank posistion, Bound to 8x8 board 
 * @param {event} e - event object
 * @param {HTMLImageElement} board_img - Starting rank number
 * @param {string} board_dir - board perspective, either 'white' or 'black'
 * @returns {Array<number>} [0]= File number, [1] = Rank number
 */
export function getAbsBoardFR(e,board_img,board_dir) {

  var outOfBounds
  const x = e.clientX - board_img.getBoundingClientRect().left;
  const y = e.clientY - board_img.getBoundingClientRect().top;

  //out of bounds tests
  const a = (x > board_img.clientWidth)  || (x < 0)  //x-axis
  const b = (y > board_img.clientHeight) || (y < 0)  //y-axis

  a||b? outOfBounds = 1 : outOfBounds = 0


  if(board_dir == "white") {
  
    var file = Math.floor(x*8/(board_img.clientWidth)) + 1
    var rank = 8 - Math.floor(y*8/(board_img.clientHeight))

  } else {
    
    var file = Math.abs(Math.floor(x*8/board_img.clientWidth) - 7) + 1
    var rank = Math.floor(y*8/(board_img.clientHeight)) + 1
  }

  file > 8 ? file = 8 : {}
  file < 1 ? file = 1 : {}
  rank > 8 ? rank = 8 : {}
  rank < 1 ? rank = 1 : {}

  return [file,rank]
}


/**
 * returns cursor position for piece, bound to the gameboard image 
 * @param {event} e - event object
 * @param {HTMLImageElement} board_img - Starting rank number
 * @param {number} offsetX_percent - manual Y adjustment, relative to 1 square as a %
 * @param {number} offsetY_percent - manual Y adjustment, relative to 1 square as a %
 * @returns {Array<number>} [0]= board bound cursor position from left (px), [0]= board bound cursor position from top (px)
 */
export function boundDrag(e, board_img, offsetX_percent, offsetY_percent){

  const squareWidth = board_img.clientWidth/8
  const offsetX = (offsetX_percent/100) * squareWidth
  const offsetY = (offsetY_percent/100) * squareWidth

  var x = e.clientX - board_img.getBoundingClientRect().left + offsetX
  var y = e.clientY - board_img.getBoundingClientRect().top + offsetY

  if (x  > board_img.clientWidth) {x = board_img.clientWidth}
  if (x  < 0) {x = 0}
  if (y  > board_img.clientHeight) {y = board_img.clientHeight}
  if (y  < 0) {y = 0}

  x = x +'px'
  y = y +'px'
  
  return[x,y]
}

/**
 * returns cursor position for piece, bound to the gameboard image 
 * @param {event} e - event object
 * @param {HTMLImageElement} board_img - Starting rank number
 * @param {string} boardViewDir - board view direction, ('white' or 'black')
 * @param {HTMLDivElement} gameBoard - gameboard
 * @param {HTMLDivElement} MoveToSquare - square element used as a highlight
 */
export function movingSquareHighlight(e,board_img, boardViewDir, gameBoard,MoveToSquare){

  if(!getBoardXY(e,board_img)[2]) {

    const moveToPos = getBoardFR(e,board_img,boardViewDir)        // get file rank location
    const MoveToClass = PosToClass(moveToPos[0],moveToPos[1])          // create dragover class
    MoveToSquare.className = ""                                        // remove all classes
    MoveToSquare.classList.add(MoveToClass)                            // update highlight square
    gameBoard.append(MoveToSquare)                                     // append object
                                
  } else {

    MoveToSquare.remove()
  }
}

/**
 * changes the game move from black to white, or white to black
 * @param {string} playerGo - the current player go, either 'white' or 'black
 * @return {string} returns the next players go color
 */
export function changePlayerGo(playerGo){

  playerGo == 'white' ? playerGo = 'black' : playerGo = 'white'
  return playerGo

}

/**
 * attemepts to capture a piece if possible
 * @param {string} draggedPieceType - 
 * @param {string} droppedPieceType - 
 * @param {string} endPositionID - 
 * @param {HTMLDivElement} gameBoard - 
 */
export function tryCapture(draggedPieceType,droppedPieceType,endPositionID,gameBoard){

  if(draggedPieceType[0] !== droppedPieceType[0] && droppedPieceType !== '' ) {

    const targetPiece = gameBoard.querySelector('.' + endPositionID)
    targetPiece.remove()
    return 1
  }

  return 0
}


export class chess_controller {

  selfRef = this
  
  constructor(){

    // TODO: add another set of new listener function to handle movement by clicking
    // TODO: add another event listner to pass function back to board,
    document.addEventListener("passValue",this._recieveChessboard.bind(this))
    document.addEventListener("pointerdown",this._start.bind(this))
    document.addEventListener("pointermove",this._move.bind(this))
    document.addEventListener("pointercancal",this._end.bind(this))
    document.addEventListener("pointerup",this._end.bind(this))

    //gameboard variables
    this.boardID = undefined  // Board ID, String
    this.selectedBoardID      // selected board ID
    this.gameBoard            // container for gameboard, </div> object
    this.boardImage           // container for board image, </img> object
    this.boardImageURl        // Location to board png, string
    this.pieceFolderURL       // Location to piece image folder, string 
    this.boardViewDir         // board direction, (black or white), string
    this.playerGo             // player go, (black or white), string
    this.gameArray            // offical game array layout, string Array
    
    //controller variables
    this.dragging
    this.peicePickup
    this.singleClick
    this.dropped
    this.clickCount2 = 0

    this.startPositionID    // MoveFrom square [F]ileX-[R]owX sytax, string
    this.endPositionID      // MoveTo square [F]ileX-[R]owX sytax, string
    this.draggedElement     // Piece element being moved, </piece> or </div> object
    this.draggedPieceType   // Dragged piece type, string
    this.droppedPieceType   // Dropped square piece type, string
    this.tempGameArray      // temporary board array to allows attemepted moves to be verified, string Array 
    this.F1                 // MoveFrom Square file, int
    this.R1                 // MoveFrom Square rank, int 
    this.F2                 // MoveTo Square file, int
    this.R2                 // MoveTo Square file, int
     

    //visual variables

    this.MoveFromSquare = document.createElement("div")
    this.MoveFromSquare.setAttribute("id","move-from")

    this.MoveToSquare = document.createElement("div")
    this.MoveToSquare.setAttribute("id","move-to")

    this.MoveToSquareOnClick = document.createElement("div")
    this.MoveToSquareOnClick.setAttribute("id","move-to-on-click")
  }

  _UpdateChessboard(){

    const event = new CustomEvent('UpdateChessBoard', {detail: this})
    document.dispatchEvent(event)
    //console.log("emitted")
  }

  _recieveChessboard(e){

    // if selected board is a new board, intialise controller with it's variables
    if(e.detail.boardID !== this.boardID) {

      this.boardID = e.detail.boardID;
      this.gameBoard = e.detail.gameBoard;
      this.boardImage = e.detail.boardImage;
      this.boardImageURl = e.detail.boardImageURl;
      this.pieceFolderURL = e.detail.pieceFolderURL;
      this.boardViewDir = e.detail.boardViewDir;
      this.playerGo = e.detail.playerGo;
      this.gameArray = [...e.detail.gameArray];
      this.tempGameArray = [...e.detail.gameArray];
    } 
    
  }

  _start(e){

    // -- ABORTS --
    {
      if(this.boardID == undefined) return;          // ABORT upon start, if no boardID has been clicked on
      if(getBoardXY(e,this.boardImage)[2]) return;   // ABORT if cursor is out of bounds
    }
    
    // -- UPDATING VARIABLES -- 
    {
      this.dragging = true
      this.MoveFromSquare.classList.remove(this.startPositionID)
      this.F1 = getBoardFR(e,this.boardImage,this.boardViewDir)[0]
      this.R1 = getBoardFR(e,this.boardImage,this.boardViewDir)[1]
      this.startPositionID = PosToClass(this.F1,this.R1)
      this.draggedElement = this.gameBoard.querySelector("." + this.startPositionID)
      this.draggedPieceType = this.gameArray[PosToIndex(this.F1,this.R1)]
      this.draggedElement == undefined ? this.peicePickup = false : this.peicePickup = true
    }
    
    // -- WHEN A PIECE HAS BEEN SELECTED
    {
      if(!this.peicePickup) return;                                 // ABORT if no peice is selected
      if(this.draggedPieceType[0] !== this.playerGo[0]) { console.log(`${this.boardID}: ${this.playerGo}s-move`); return; }    // ABORT if piece color is wrong go

      this.MoveFromSquare.className = ""
      this.MoveFromSquare.classList.add(this.startPositionID)
      this.gameBoard.append(this.MoveFromSquare)
      console.log(`${this.boardID}: ${this.startPositionID}`)

    }
    
  }

  _move(e){

    // -- ABORTS --
    {
      if(this.boardID == undefined) return;                          // ABORT upon start, if no boardID has been clicked on
      if(!this.dragging) return;                                     // ABORT when _end is run, and turn dragging off
      if(this.draggedPieceType[0] !== this.playerGo[0])  return;     // ABORT if piece color is wrong go
      //if(this.draggedElement ==  undefined) return;                // ABORT if piece not selected, ABORT
      
    }
   
    // -- MOVEMENT OPERATIONS
    {

      // -- WHEN DRAGGING WITH PIECE TO MOVE
        if(this.peicePickup) {

            // -- HIGHLIGHTING MOVE TO SQUARE, (if cursor is bound to board)
          movingSquareHighlight(e,this.boardImage,this.boardViewDir,this.gameBoard,this.MoveToSquare)

          // -- DRAGGING PIECE VISUAL UPDATE
          this.draggedElement.style.zIndex = 100                       // put piece in front
          this.draggedElement.classList.remove(this.startPositionID)   // temp removal of square class
          const dragCoord = boundDrag(e,this.boardImage,12,0)          // get bound coordinates 
          this.draggedElement.style.left = dragCoord[0]
          this.draggedElement.style.top = dragCoord[1]

        } 

    
    } 

  }

  _end(e) {
    
    // -- ABORTS 
    {
      if(!this.peicePickup) return;                                  // ABORT if no peice is selected
      if(this.draggedPieceType[0] !== this.playerGo[0])  return;     // ABORT if piece color is wrong go
    }
   
    // -- GETTING DROP SQUARE DATA
    {
       // GETTING DROP SQUARE POS
      const draggedCoord = getBoardFR(e,this.boardImage,this.boardViewDir)
      this.F2 = draggedCoord[0]
      this.R2 = draggedCoord[1]
      this.endPositionID = PosToClass(this.F2,this.R2)
      this.droppedPieceType = this.gameArray[PosToIndex(this.F2,this.R2)]
      
      // UPDATING GAME ARRAYS
      this.tempGameArray[PosToIndex(this.F1,this.R1)] = ''
      this.tempGameArray[PosToIndex(this.F2,this.R2)] = this.draggedPieceType
      
      // PERFORMING MOVE CHECKS
      var isOutOfBounds = getBoardXY(e,this.boardImage)[2]

    }

    /// --- WHERE MOVES ARE COMMITTED OR NOT
    {
      
      if(!isOutOfBounds) {
        // vvvv -- IF DROPS ARE WITHIN BOARD -- vvvv
        
        var checkValid = isValid(this.F1,this.R1, this.F2, this.R2, this.tempGameArray, this.gameArray)

        if(checkValid) {
          // vvvv -- IF DROPS ARE VALID -- vvvv

          // try capture (do first before updating visual board)
          var capture = tryCapture(this.draggedPieceType,
            this.droppedPieceType,this.endPositionID,this.gameBoard)  
          capture ? capture = 'capture-' : capture = ''

          this.draggedElement.classList.add(this.endPositionID)     // update piece class   
          this.gameArray = [...this.tempGameArray]                  // update game Array
          this.dropped = true                                       //s ignal drop
          this.playerGo = changePlayerGo(this.playerGo)             // change player go
          this._UpdateChessboard()                                  // DO THIS LAST - commit changes to gameboard object

          


          console.log(`${this.boardID}: ${capture}${this.endPositionID}`)
        } 
        
        else {
          // vvvv -- IF DROPS ARE NOT VALID -- vvvv
          this.tempGameArray = [...this.gameArray]
          this.draggedElement.classList.add(this.startPositionID)
          this.dropped = false 

          console.log(`${this.boardID}: illegal-move`)
        }
  
      } else {
        
        // vvvv -- IF DROPS ARE NOT WITHIN BOARD -- vvvv
        console.log(`${this.boardID}: off-board`)
        this.draggedElement.classList.add(this.startPositionID) 
        this.tempGameArray = [...this.gameArray]
        this.dropped = false
      }
    }
    

    // -- RESETTING VISUALS (HIGHLIGHTING SQUARES)
    {
      //this.dropped? this.MoveFromSquare.remove() :{}  // use if you want highlight square to stay on
      this.MoveFromSquare.remove()
      this.MoveToSquare.remove()
      this.MoveToSquareOnClick.remove()

      if(this.peicePickup) {

        this.draggedElement.style = null
        this.draggedElement.style.zIndex = null 
      }
    }

    
    // -- RESETTING VARIABLES -- DO THIS LAST
    {
      this.clickCount2 += 1
      this.clickCount2 > 1 ? this.clickCount2 = 0 : {}
      this.dragging = false
      this.outOfBounds = undefined
      this.peicePickup = false
      this.startPositionID = undefined   
      this.endPositionID = undefined    
      this.draggedElement = undefined    
      this.dropped = undefined  
      //this.draggedPieceType = undefined  
      //this.droppedPieceType = undefined 
      //this.tempGameArray       
      this.F1 = undefined                 
      this.R1 = undefined               
      this.F2 = undefined                
      this.R2 = undefined  

    }


  }

  

}














function test(){


}


test()
