
// returns file and row(rank) index of single array of board
// todo: probably need to add out of bound error catches here?

function returnArrayPos(pos){

  const row = 7 - Math.floor((pos/8)) + 1
  const file = pos - Math.floor((pos/8))*8 + 1
  return [file,row]

}

function returnSingleArrayPos(file,row)
{
  F = file - 1
  R = row - 1
  return (F + (7-R)*8)

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
  switch(draggedPieceType){

    case 'wP' :
      
      //1 step forward rule
      if(R1 !== 2) {
        
        if(R2 - R1 > 1) {return 0}                          // only allow 1 step forard
        if(isOccupied !== undefined && F2 == F1) {return 0} // prevent moving forward into peice
        if(F2 !== F1 && isOccupied == undefined || R2 == R1) {return 0} // diagonal capture rule

      } 

      // first move exception for 2 steps
      else {
        
        if(R2-R1>2)   {return 0}                            // allow two step
        if(isOccupied !== undefined && F2 == F1) {return 0} // prevent moving forward into peice
        if((F2 !== F1) && (R2-R1 == 2)) {return 0}  // prevent diagonal moves when stepping twice
        if(F2 !== F1 && isOccupied == undefined) {return 0} // diagonal capture rule
      }

      //no moving backwards
      if(R2 < R1) {return 0}
      

      break

    case 'bP' :
      // same as white, but  reverses
      //1 step forward rule
      if(R1 !== 7) {
        
        if(R1 - R2 > 1) {return 0}                          // only allow 1 step forard
        if(isOccupied !== undefined && F2 == F1) {return 0} // prevent moving forward into peice
        if(F2 !== F1 && isOccupied == undefined || R2 == R1) {return 0} // diagonal capture rule
      } 

      // first move exception for 2 steps
      else {
        
        if(R1-R2>2)   {return 0}                            // allow two step
        if(isOccupied !== undefined && F2 == F1) {return 0} // prevent moving forward into peice
        if((F2 !== F1) && (R2-R1 == 2)) {return 0}  // prevent diagonal moves when stepping twice
        if(F2 !== F1 && isOccupied == undefined) {return 0} // diagonal capture rule
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
      if(testCollision(F1,R1,F2,R2)) {return 0}              // test collision
      break

    case 'wR':
    case 'bR' :
      
      if (!(F2 == F1 || R2 == R1)) {return 0}    // checking if movement is not veritcal or horizontal
      if(testCollision(F1,R1,F2,R2)) {return 0}  // checking if collision has occured
      break

    case 'wQ':
    case 'bQ':
      
      var a = !(F2 == F1 || R2 == R1)              // horizontal, vertical check
      var b = Math.abs((R2 - R1)/(F2 - F1)) !== 1  // diagonal check
      if ( a && b) {return 0}                                      // combine both
  
      if(testCollision(F1,R1,F2,R2)) {return 0}    // test collision
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



function updateTempArray() {

  startPosArrayValue = returnSingleArrayPos(F1,R1)
  endPosArrayValue = returnSingleArrayPos(F2,R2)
  tempGameArray[startPosArrayValue] = ''
  tempGameArray[endPosArrayValue] = draggedPieceType

}

