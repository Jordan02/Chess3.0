
// returns file and row(rank) index of single array of board
function returnArrayPos(pos){

  const row = 7 - Math.floor((pos/8)) + 1
  const file = pos - Math.floor((pos/8))*8 + 1
  return [file,row]

  // todo: probably need to add out of bound error catches here?

}

//  -- we expect this function to recieve classes in the form FX-RX
function returnPiecePos(pieceClassID){

  return [Number(pieceClassID[1]), Number(pieceClassID[4]) ]
}

//  -- creates text id from number index
function returnClassPos(file, rank){
  return "F" + file.toString() + "-R" + rank.toString()
}

// -- this uses varibles defined within dragging event functions
function isValid() {

  const pos1_f = returnPiecePos(startPositionID)[0]
  const pos1_r = returnPiecePos(startPositionID)[1]

  const pos2_f = returnPiecePos(endPositionID)[0]
  const pos2_r = returnPiecePos(endPositionID)[1]

  // check if end position has a piece 
  const isOccupied = gameBoard.getElementsByClassName(endPositionID)[0]

  if (isOccupied !== undefined ) {

    // check if both peices are are the same color
    if(isOccupied.classList[0][0] == draggedElement.classList[0][0]) {
      
      return 0
    }
  } 

  // TODO need to add enpassent and castling to finish this
  // TODO need to add isKinginCheck conditions
  switch(draggedPeiceType){

    case 'wP' :
      
      //1 step forward rule
      if(pos1_r !== 2) {
        
        if(pos2_r - pos1_r > 1) {return 0}                          // only allow 1 step forard
        if(isOccupied !== undefined && pos2_f == pos1_f) {return 0} // prevent moving forward into peice
        if(pos2_f !== pos1_f && isOccupied == undefined) {return 0} // diagonal capture rule

      } 

      // first move exception for 2 steps
      else {
        
        if(pos2_r-pos1_r>2)   {return 0}                            // allow two step
        if(isOccupied !== undefined && pos2_f == pos1_f) {return 0} // prevent moving forward into peice
        if((pos2_f !== pos1_f) && (pos2_r-pos1_r == 2)) {return 0}  // prevent diagonal moves when stepping twice
        if(pos2_f !== pos1_f && isOccupied == undefined) {return 0} // diagonal capture rule
      }

      //no moving backwards
      if(pos2_r < pos1_r) {return 0}
      

      break

    case 'bP' :
      // same as white, but  reverses
      //1 step forward rule
      if(pos1_r !== 7) {
        
        if(pos1_r - pos2_r > 1) {return 0}                          // only allow 1 step forard
        if(isOccupied !== undefined && pos2_f == pos1_f) {return 0} // prevent moving forward into peice
        if(pos2_f !== pos1_f && isOccupied == undefined) {return 0} // diagonal capture rule
      } 

      // first move exception for 2 steps
      else {
        
        if(pos1_r-pos2_r>2)   {return 0}                            // allow two step
        if(isOccupied !== undefined && pos2_f == pos1_f) {return 0} // prevent moving forward into peice
        if((pos2_f !== pos1_f) && (pos2_r-pos1_r == 2)) {return 0}  // prevent diagonal moves when stepping twice
        if(pos2_f !== pos1_f && isOccupied == undefined) {return 0} // diagonal capture rule
      }

      //no moving backwards
      if(pos2_r > pos1_r) {return 0}  

      break

    case 'wN' :
    case 'bN' :
      
      var a = Math.abs(pos2_r - pos1_r) == 1 && Math.abs(pos2_f - pos1_f) == 2
      var b = Math.abs(pos2_r - pos1_r) == 2 && Math.abs(pos2_f - pos1_f) == 1
      if ( !(a || b)) { return 0 }
      break

    case'wB' :
    case'bB' :

      if ( Math.abs((pos2_r - pos1_r)/(pos2_f - pos1_f)) !== 1) {return 0}   // checking for diagonal move, uisng dx/dy == 1
      if(testCollision(pos1_f,pos1_r,pos2_f,pos2_r)) {return 0}              // test collision
      break

    case 'wR':
    case 'bR' :
      
      if (!(pos2_f == pos1_f || pos2_r == pos1_r)) {return 0}    // checking if movement is not veritcal or horizontal
      if(testCollision(pos1_f,pos1_r,pos2_f,pos2_r)) {return 0}  // checking if collision has occured
      break

    case 'wQ':
    case 'bQ':
      
      var a = !(pos2_f == pos1_f || pos2_r == pos1_r)              // horizontal, vertical check
      var b = Math.abs((pos2_r - pos1_r)/(pos2_f - pos1_f)) !== 1  // diagonal check
      if ( a && b) {return 0}                                      // combine both
  
      if(testCollision(pos1_f,pos1_r,pos2_f,pos2_r)) {return 0}    // test collision
      break

    case 'wK':
    case 'bK':  
      
      var a = Math.abs(pos2_r - pos1_r) > 1  // vertical 1 step check
      var b = Math.abs(pos2_f - pos1_f) > 1  // vertical 1 step check
      if(a || b) {return 0}

      break
    
  }

  return 1

}

function testCollision(pos1_f,pos1_r,pos2_f,pos2_r){

  // check if vertical movement
  if (pos2_f == pos1_f) { 

    pos2_r/pos1_r > 1? dy = 1 : dy = -1 //movement dir

    var x = pos1_f       // vert movement has constant x
    let y = pos1_r + dy  //start loop 1 from start position       

    // loop through all pos between start and end, and break if piece is encounted
    while ( y !== pos2_r) {

      var a = gameBoard.getElementsByClassName(returnClassPos(x,y))[0] // checking if square has a peice
      if (a !== undefined) {return 1} // if there is a peice, break
      y+=dy
    }
  }

  // check if horziontal movement
  else if (pos2_r == pos1_r) {
    
    pos2_f/pos1_f > 1? dx = 1 : dx = -1 //movement dir

    var y = pos1_r       // horz movement has constant y
    var x = pos1_f + dx  //start loop 1 from start position

    // loop through all pos between start and end, and break if piece is encounted
    while ( x !== pos2_f) {

      var a = gameBoard.getElementsByClassName(returnClassPos(x,y))[0] // checking if square has a peice
      if (a !== undefined) {return 1} // if there is a peice, break
      x+=dx
    }


  }

  // else movement is diagonal
  else {
    pos2_r/pos1_r > 1? dy = 1 : dy = -1
    pos2_f/pos1_f > 1? dx = 1 : dx = -1

    var y = pos1_r + dy  //start loop 1 from start position
    var x = pos1_f + dx  //start loop 1 from start position

    // loop through all pos between start and end, and break if piece is encounted
    while ( x !== pos2_f) {

      var a = gameBoard.getElementsByClassName(returnClassPos(x,y))[0] // checking if square has a peice
      if (a !== undefined) {return 1} // if there is a peice, break

      x+=dx
      y+=dy
    }

    

  }

  return 0
}

function tryCapture(){

  const targetPeice = gameBoard.getElementsByClassName(endPositionID)[0]

  if (targetPeice == undefined) {return 0} //if it is empty, break

  else {

    // remove peice
    targetPeice.remove()
    return 1
  }

}
