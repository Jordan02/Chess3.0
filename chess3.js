
// returns file and row(rank) index of single array of board
function returnArrayPos(pos){

  const row = 7 - Math.floor((pos/8))
  const file = pos - Math.floor((pos/8))*8
  return [file,row]

  // todo: probably need to add out of bound error catches here?

}