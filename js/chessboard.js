import * as chess3 from "./chess3_utils.js"

export default class chessboard {

  // --- Instance gloval variables ---

  
  // --- constructor ---
  
  constructor(boardID, containerID){  

    // --- Instance gloval variables ---

    this.boardID = boardID                                               // Board ID, String
    this.gameBoard                                             // container for gameboard, </div> object
    this.boardImage                                            // container for board image, </img> object
    this.boardImageURl = "src/chessboards/resin_ocean.png"     // Location to board png, string
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
    this.F1           // MoveFrom Square file, int
    this.R1             // MoveFrom Square rank, int 
    this.F2             // MoveTo Square file, int
    this.R2             // MoveTo Square file, int

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
          piece.addEventListener("dragstart",this.dragStart)
          piece.addEventListener("dragend",this.dragEnd)
          //piece.addEventListener("dragover",dragOver)
    
          this.gameBoard.append(piece)
        }
      })
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

  dragEnd(e){
    // this stops drop from occuring in two squares/ imporant
    //e.stopPropgation() 
  
    //  -- get x and y coordinates within board
    {
      var x = e.clientX - this.boardImage.getBoundingClientRect().left;
      var y = e.clientY - this.boardImage.getBoundingClientRect().top;
    }
    //  -- check if drop outside of gamebaord
    {
      var a = (x > this.boardImage.clientWidth)  || (x < 0)  //x-axis
      var b = (y > this.boardImage.clientHeight) || (y < 0)  //y-axis
    
      if( a || b ) {
    
        console.log("out of bounds")
    
        return 0
    }
    }
    
    //  -- convert x & y coords into board pos, relative to boad rotation
    {
      if(this.boardViewDir == "white") {
    
        var file = Math.floor(x*8/(this.boardImage.clientWidth)) + 1
        var rank = 8 - Math.floor(y*8/(this.boardImage.clientHeight))
    
      } else {
    
        var file = Math.abs(Math.floor(x*8/this.boardImage.clientWidth) - 7) + 1
        var rank = Math.floor(y*8/(this.boardImage.clientHeight)) + 1
      }
    }
    // -- checks and validations before confirming class/position change
    {
      this.endPositionID = 'F' + file.toString() + '-R' + rank.toString()
      this.F2 = file
      this.R2 = rank
    
      this.droppedPieceType = this.gameArray[chess3.returnSingleArrayPos(this.F2, this.R2)]
    
      this.updateTempArray() // update gameboardaarry for validation checks before comitting

      const validation = chess3.isValid(this.F1, this.R1, this.F2, this.R2, this.tempGameArray, this.gameArray)

      if ( validation == true) {
    
        const capture = this.tryCapture()
        this.draggedElement.classList.remove(this.startPositionID)
        this.draggedElement.classList.add(this.endPositionID)
        
        this.gameArray = [...this.tempGameArray]  //Update real game array. (...) is needed to prevent reference copy
        if(capture) {console.log("captures")}
        console.log(this.draggedPieceType,this.endPositionID)
    
      } else {
    
        
        this.tempGameArray = [...this.gameArray] // reset tempGameArray                      ///start here, WHY IS THE TEMP AND GAME ARRAY NOT UPDATING PROPERLY, Got it working, not work on using arrays for gameboard logic, and storing possible moves
        // console.log(draggedPieceType,endPositionID)
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


}