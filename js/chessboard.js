import * as chess3 from "./chess3_utils.js"

export default class chessboard {

  // --- Instance gloval variables ---
  static dragging = false
  static piecePickUp = false
  static boardPlayed
  
  // --- constructor ---
  
  constructor(boardID, containerID){  

    // --- Instance gloval variables ---

    this.boardID = boardID                                               // Board ID, String
    this.gameBoard                                             // container for gameboard, </div> object
    this.boardImage                                            // container for board image, </img> object
    this.boardImageURl = "src/chessboards/green_white.png"     // Location to board png, string
    this.pieceFolderURL = "src/peices/merida/"                 // Location to piece image folder, string 
    this.boardViewDir = 'white'                                // board direction, (black or white), string
    this.playerGo = 'white'                                    // player go, (black or white), string
    this.gameArray          // offical game array layout, string Array
  
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
          const getpos = chess3.IndexToPos(i)
          const squareclass = 'F' + getpos[0].toString() + '-R' +getpos[1].toString()
          piece.classList.add(startpiece)
          piece.classList.add(squareclass)
          piece.style = ""
    
          // adding image
          const pieceImage = document.createElement("img")
          const url = this.pieceFolderURL + startpiece + '.svg'
          pieceImage.setAttribute("src", url)
          pieceImage.classList.add("pieceIcon")
          pieceImage.setAttribute("draggable",false)
          piece.append(pieceImage)
    
          //final actions

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
      this.gameArray = [...this.START_PIECES]
      this.tempGameArray = [...this.START_PIECES]

      this.gameBoard.addEventListener("pointerdown",this._passChessboard.bind(this))
      document.addEventListener("UpdateChessBoard",this._recieveUpdate.bind(this))

      container.append(this.gameBoard)
    }
  }


  _passChessboard(){

    // passes this object when clicked on
    const event = new CustomEvent('passValue', {detail: this})
    document.dispatchEvent(event)
    
  }

  _recieveUpdate(e){


    if(e.detail.boardID == this.boardID){

      this.gameBoard = e.detail.gameBoard;
      this.boardViewDir = e.detail.boardViewDir;
      this.playerGo = e.detail.playerGo;
      this.gameArray = [...e.detail.gameArray];
      //console.log(`${this.boardID}-recieved-update`);
      
    }

  }

}