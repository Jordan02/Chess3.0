import chessboard from "./chessboard.js"
import { chess_controller } from "./chess3_utils.js"

const container = document.querySelector("#container2")


function main() {

  
  
  const controller = new chess_controller()
  
  var board = new chessboard('GB1','#container2')
  var board = new chessboard('GB2','#container2')
  
}

main()

