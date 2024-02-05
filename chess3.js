
// returns file and row(rank) index of single array of board
function returnArrayPos(pos){

  const row = 7 - Math.floor((pos/8)) + 1
  const file = pos - Math.floor((pos/8))*8 + 1
  return [file,row]

  // todo: probably need to add out of bound error catches here?

}

// we expect this function to recieve classes in the form FX-RX
function returnPiecePos(pieceClassID){

  return [Number(pieceClassID[1]), Number(pieceClassID[4]) ]
}

// this uses varibles defined within dragging event functions
function isValid() {

  const pos1_f = returnPiecePos(startPositionID)[0]
  const pos1_r = returnPiecePos(startPositionID)[1]

  const pos2_f = returnPiecePos(endPositionID)[0]
  const pos2_r = returnPiecePos(endPositionID)[1]

  let V = 0

  // check if end position has a piece 
  const isOccupied = gameBoard.getElementsByClassName(endPositionID)[0]

  if (isOccupied !== undefined ) {

    // check if both peices are are the same color
    if(isOccupied.classList[0][0] == draggedElement.classList[0][0]) {
      
      return 0
    }
  } 


  switch(draggedPeiceType){

    case 'wP' :
      //no passive diagonal
      if(pos2_f !== pos1_f && isOccupied == undefined) {return 0}

      //first move 2 step exception, plus 1 step rule
      if(pos1_r == 2) {
        
        if(pos2_r-pos1_r>2) {return 0}

      } else if (pos2_r - pos1_r > 1) {return 0}

      break

    case 'wN' :
    case 'bN' :
      
      var a = Math.abs(pos2_r - pos1_r) == 1 && Math.abs(pos2_f - pos1_f) == 2
      var b = Math.abs(pos2_r - pos1_r) == 2 && Math.abs(pos2_f - pos1_f) == 1

      console.log(a)
      console.log(b)

      if ( !(a || b)) { return 0 }

      break

    case'wb' :

    break


  }

   


  return 1

}
