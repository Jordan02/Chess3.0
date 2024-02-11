
// todo: probably need to add out of bound error catches here?
//  --- returns [file,row] from single array index of 64 element array
export function returnArrayPos(pos){

  const row = 7 - Math.floor((pos/8)) + 1
  const file = pos - Math.floor((pos/8))*8 + 1
  return [file,row]

}

//  --- returns single array index of 64 element array ****
export function returnSingleArrayPos(file,row)
{
  var F = file - 1
  var R = row - 1
  return (F + (7-R)*8)
}

//  --- we expect this function to recieve classes in the form FX-RX ****
export function returnPiecePos(pieceClassID){

  return [Number(pieceClassID[1]), Number(pieceClassID[4]) ]
}

//  --- creates text id from number index
export function returnClassPos(file, rank){
  return "F" + file.toString() + "-R" + rank.toString()
}

// --- returns boolean value if move from pos 1-2 is valid ****
export function isValid(F1, R1, F2, R2, newGameArray, gameArray) {

  // check if end position has a piece 
  const endPosPieceType = gameArray[returnSingleArrayPos(F2,R2)]
  const startPosPieceType = gameArray[returnSingleArrayPos(F1,R1)]
  
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

      var a = gameArray[returnSingleArrayPos(x,y)] // checking if square has a peice
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

      var a = gameArray[returnSingleArrayPos(x,y)] // checking if square has a peice
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

      var a = gameArray[returnSingleArrayPos(x,y)] // checking if square has a peice
      if (a !== '') {return 1} // if there is a peice, break

      x+=dx
      y+=dy
    }

    

  }

  return 0
}



export function tryCapture(){

  const targetPeice = gameBoard.getElementsByClassName(endPositionID)[0]

  if (targetPeice == undefined) {return 0} //if it is empty, break

  else {

    // remove peice
    targetPeice.remove()
    return 1
  }

}

