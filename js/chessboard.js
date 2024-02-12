import * as chess3 from "./chess3_utils.js"

export default class chessboard {

  // --- Instance gloval variables ---

  
  // --- constructor ---
  
  constructor(boardID, containerID){  

    // --- Instance gloval variables ---

    this.boardID = boardID                                               // Board ID, String
    this.gameBoard                                             // container for gameboard, </div> object
    this.boardImage                                            // container for board image, </img> object
    this.boardImageURl = "src/chessboards/green_white.png"     // Location to board png, string
    this.pieceFolderURL = "src/peices/merida/"                 // Location to piece image folder, string 
    this.boardViewDir = 'white'                                // board direction, (black or white), string
    this.playerGo                                              // player go, (black or white), string
    
    this.startPositionID    // MoveFrom square [F]ileX-[R]owX sytax, string
    this.endPositionID      // MoveTo square [F]ileX-[R]owX sytax, string
    this.draggedElement     // Piece element being moved, </piece> or </div> object
    this.draggedPieceType   // Dragged piece type, string
    this.droppedPieceType   // Dropped square piece type, string

    this.gameArray          // offical game array layout, string Array
    this.tempGameArray      // temporary board array to allows attemepted moves to be verified, string Array
    this.F1             // MoveFrom Square file, int
    this.R1             // MoveFrom Square rank, int 
    this.F2             // MoveTo Square file, int
    this.R2             // MoveTo Square file, int

    this.MoveToSquare     // highlighted move to square
    this.MoveFromSquare   // highlighted move from square

    // piece matrix is always populated from whites perspective. DON'T CHANGE, string array 
    this.START_PIECES = [

      'bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR',
      'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP',
      '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '',
      'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP',
      'wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'
      
    ]

    // --- instancing gamebaord
  
    const container = document.querySelector(containerID) 

    //creating board container
    {
      this.gameBoard = document.createElement("div")        
      this.gameBoard.setAttribute("id",boardID)
      this.gameBoard.classList.add("gameboard")
    }
    
    //creating board image
    {
      this.boardImage = document.createElement("img")    
      this.boardImage.setAttribute("src", this.boardImageURl)
      this.boardImage.classList.add("chessboard")
      this.gameBoard.append(this.boardImage)
    }

    //creating piece stylesheet view 
    //(THIS IS JUST IN CASE THEY ARENT ALREADY DEFINED, THEY SHOULD IN HTML)
    {
      //create style sheet isn't found
      if(document.querySelector("#boadDirStyle") == null) {

        const header = document.querySelector("head")
        const viewStyle = document.createElement("link")
        viewStyle.setAttribute("href","./css/squares_white.css")   //default to white
        viewStyle.setAttribute("rel", "stylesheet")   
        viewStyle.setAttribute("id", "boadDirStyle")
        header.append(viewStyle)
      } 

      //create style sheet isn't found
      if(document.querySelector("#boardStyle") == null) {

        const header = document.querySelector("head")
        const viewStyle = document.createElement("link")
        viewStyle.setAttribute("href","./css/boardStyle.css")   //default to white
        viewStyle.setAttribute("rel", "stylesheet")   
        viewStyle.setAttribute("id", "boardStyle")
        header.append(viewStyle)
      }

      //set view style sheet
      if(this.boardViewDir == 'white') {

        document.querySelector("#boadDirStyle").setAttribute("href", "css/squares_white.css")
      } else {
        document.querySelector("#boadDirStyle").setAttribute("href", "css/squares_black.css")
      }
    


    } 

    // creating pieces
    {
      this.START_PIECES.forEach((startpiece, i) => {

        if(startpiece !== '') {
    
          const piece = document.createElement('piece')
    
          // instantiate intial peices 
          const getpos = chess3.returnArrayPos(i)
          const squareclass = 'F' + getpos[0].toString() + '-R' +getpos[1].toString()
          piece.classList.add(startpiece)
          piece.classList.add(squareclass)
          piece.setAttribute("draggable",true)
    
          // adding image
          const pieceImage = document.createElement("img")
          const url = this.pieceFolderURL + startpiece + '.svg'
          pieceImage.setAttribute("src", url)
          pieceImage.classList.add("pieceIcon")
          pieceImage.setAttribute("draggable",false)
          piece.append(pieceImage)
    
          //adding event listeners
          this.dragStart = this.dragStart.bind(this)
          this.dragEnd = this.dragEnd.bind(this)
          this.drag = this.drag.bind(this)
          piece.addEventListener("dragstart",this.dragStart)
          piece.addEventListener("dragend",this.dragEnd)
          piece.addEventListener("drag",this.drag)
    
          this.gameBoard.append(piece)
        }
      })
    } 

    // creating square objects
    {
      //moveTo square, don't append dragged
      this.MoveToSquare = document.createElement("div")
      this.MoveToSquare.setAttribute("id","move-to")

      this.MoveFromSquare = document.createElement("div")
      this.MoveFromSquare.setAttribute("id","move-from")
      
    }
  
    // Appending containers, event listeners and variable setting
    {
      container.append(this.gameBoard)

      // adding any extra event listeners once objects are appeneded/created

      //this.returnBoardPos = this.returnBoardPos.bind(this)  // this replaces old function, ensuring this context is correct object
      //this.gameBoard.addEventListener('mousemove', this.returnBoardPos)

      this.gameArray = [...this.START_PIECES]
      this.tempGameArray = [...this.START_PIECES]
    
    }


  }


  // --- methods ---

  returnBoardPos(e) {

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

  dragStart(e){

    // selection object should be on front, the parent parent (grandfather node) is the square id which is stored
    this.startPositionID = e.target.classList[1]
    this.draggedPieceType = e.target.classList[0]
    this.draggedElement = e.target
    console.log(this.draggedPieceType,this.startPositionID)
    this.F1 = chess3.returnPiecePos(this.startPositionID)[0]    // update numerical start position
    this.R1 = chess3.returnPiecePos(this.startPositionID)[1] 
  }

  drag(e){
    e.stopPropagation()
    e.stopImmediatePropagation()
    
    // getting x,y coordinates and checking outofBounds
    {
      var x = this.getBoardXY(e)[0]
      var y = this.getBoardXY(e)[1]
      var outOfBounds = this.getBoardXY(e)[2]
      
      var file = this.getBoardFR(x,y)[0]
      var rank = this.getBoardFR(x,y)[1]
    }
    
    // add rendering during drag
    {
      // last drag event has coords of 0,0 for some reason, this will ignore that last event
      if(e.clientX !== 0 ) {

        // if out of bounds
          if (outOfBounds) {
            this.MoveToSquare.remove()
            this.MoveFromSquare.remove()
  
          } else {
  
            this.gameBoard.append(this.MoveToSquare)
            this.MoveToSquare.classList.remove(this.MoveToSquare.classList.item(0))
            this.MoveToSquare.classList.add(chess3.returnClassPos(file,rank))

            this.gameBoard.append(this.MoveFromSquare)
            this.MoveFromSquare.classList.remove(this.MoveFromSquare.classList.item(0))
            this.MoveFromSquare.classList.add(chess3.returnClassPos(this.F1,this.R1))

            // dragging piece
            this.draggedElement.classList.remove(this.startPositionID)            //remove  class temporarly for movement   
            this.draggedElement.style.left = (e.clientX - this.boardImage.getBoundingClientRect().left + 'px')
            this.draggedElement.style.top = (e.clientY - this.boardImage.getBoundingClientRect().top + 'px')
            console.log(this.draggedElement.style.top)
          
          }
      } 
    } 
    
  }

  dragEnd(e){
    // this stops drop from occuring in two squares/ imporant
    //e.stopPropgation() 
  
    // -- remove movement visuals. THIS MUST BE DONE FIRST
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
      this.endPositionID = chess3.returnClassPos(file,rank)
      this.droppedPieceType = this.gameArray[chess3.returnSingleArrayPos(this.F2, this.R2)]
    
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

  updateTempArray(){

    const startPosArrayValue = chess3.returnSingleArrayPos(this.F1,this.R1)
    const endPosArrayValue = chess3.returnSingleArrayPos(this.F2,this.R2)
    this.tempGameArray[startPosArrayValue] = ''
    this.tempGameArray[endPosArrayValue] = this.draggedPieceType
  }

  flipBoard(){

    if(this.boardViewDir == 'white') {

      document.querySelector("#boadDirStyle").setAttribute("href", "css/squares_black.css")
      this.boardViewDir = 'black'
    } else {

      document.querySelector("#boadDirStyle").setAttribute("href", "css/squares_white.css")
      this.boardViewDir = 'white'
    }
  }

  tryCapture(){

    const targetPeice = this.gameBoard.getElementsByClassName(this.endPositionID)[0]

    if (targetPeice == undefined) {return 0} //if it is empty, break

    else {
      // remove peice
      targetPeice.remove()
      return 1
    }

  }

  getBoardXY(e){

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

  getAbsBoardXY(e){

    const offsetX = e.clientX - this.boardImage.getBoundingClientRect().left;
    const offsetY = e.clientY - this.boardImage.getBoundingClientRect().top;

    const newLeft = e.clientX - offsetX
    const newTop = e.clientY - offsetY

    return [newLeft,newTop]
  }

  getBoardFR(x,y){

    if(this.boardViewDir == "white") {
    
      var file = Math.floor(x*8/(this.boardImage.clientWidth)) + 1
      var rank = 8 - Math.floor(y*8/(this.boardImage.clientHeight))
  
    } else {
      
      var file = Math.abs(Math.floor(x*8/this.boardImage.clientWidth) - 7) + 1
      var rank = Math.floor(y*8/(this.boardImage.clientHeight)) + 1
    }

    return [file,rank]

  }

}