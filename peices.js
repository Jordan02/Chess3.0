
function createPlayer(pieceID) {

  if (pieceID === '') {
    return '';
  } else {

    // create player object
    const player = document.createElement("div")
    player.classList.add("player")
    player.setAttribute("type", pieceID)
    player.setAttribute('kills', 0)

    // const svgfile = fetch(pieceID)j
    // .then(response => response.text())
    // .then(text => {image.innerHTML = text}) 

    // create selectable object
    const selection = document.createElement("div")
    selection.classList.add("draggable")
    selection.setAttribute("draggable", true)
    player.append(selection)


    // make selection object draggable
    selection.setAttribute("draggable",true)
    selection.addEventListener("dragstart",dragStart)
    selection.addEventListener("dragover",dragOver)
    selection.addEventListener("drag", drag)
    selection.addEventListener("drop",dragDrop)


    //add peice image to player object with it's own class
    const piece = document.createElement("img")
    const url = 'src/peices/merida/' + pieceID + '.svg'
    piece.setAttribute("src", url)
    piece.classList.add("piece")
    player.append(piece)

    //create perks container and add perks
    const perks = document.createElement("div")
    perks.classList.add("perks")
    // perks.setAttribute("draggable",false)

    const perk1 = document.createElement("img")
    perk1.setAttribute("src","src/killstreaks/stockholm_syndrome.png")
    perks.append(perk1)

    const perk2 = document.createElement("img")
    perk2.setAttribute("src","src/killstreaks/duckingjam.png")
    perks.append(perk2)

    const perk3 = document.createElement("img")
    perk3.setAttribute("src","src/killstreaks/msc_trinity.png")
    perks.append(perk3)

    player.append(perks)

    return player
  }
}

let startPositionID
let draggedElement
let endPositionID


/**
 * @param {DragEvent} e - The drag event object
 */

function dragStart(e){

  // selection object should be on front, the parent parent (grandfather node) is the square id which is stored
  startPositionID = startPositionID = e.target.parentNode.parentNode.getAttribute('square-id')
  console.log(startPositionID)
  draggedElement = e.target
}

function drag(e){

  const elementName = e.target.parentNode.getAttribute("id")
  const a = document.getElementById(elementName)
  
  a.style.left = 0
  a.style.top = 0

}

function dragOver(e){

  // this prevents default option that will contiously log object being dragged over
  e.preventDefault()
  // from selection, we get a reference to player id, and move it cursor location
  const elementName = e.target.parentNode.getAttribute("id")
 
  console.log(elementName)
  // e.target.parentNode.
}

function dragDrop(e){
  // this stops drop from occuring in two squares/ imporant
  //e.stopPropgation() 
  console.log(e.target.parentNode.parentNode.getAttribute('square-id'))
  //e.target.append(draggedElement)
 
}