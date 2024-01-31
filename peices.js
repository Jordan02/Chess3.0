const bR = 'src/peices/merida/bR.svg'
const bN = 'src/peices/merida/bN.svg'
const bB = 'src/peices/merida/bB.svg'
const bQ = 'src/peices/merida/bQ.svg'
const bK = 'src/peices/merida/bK.svg'
const bP = 'src/peices/merida/bP.svg'

const wR = 'src/peices/merida/wR.svg'
const wN = 'src/peices/merida/wN.svg'
const wB = 'src/peices/merida/wB.svg'
const wQ = 'src/peices/merida/wQ.svg'
const wK = 'src/peices/merida/wK.svg'
const wP = 'src/peices/merida/wP.svg'


function returnImage(url) {

  if (url === '') {
    return '';
  } else {

    // create player object
    const image = document.createElement("div")
    image.classList.add("player")
    image.setAttribute('kills', 0)
  
    // const svgfile = fetch(url)
    // .then(response => response.text())
    // .then(text => {image.innerHTML = text}) 

    //add peice image to player object with it's own class
    const piece = document.createElement("img")
    piece.setAttribute("src", url)
    piece.classList.add("piece")
    image.append(piece)

    //create perks container and add perks
    const perks = document.createElement("div")
    perks.classList.add("perks")

    const perk1 = document.createElement("img")
    perk1.setAttribute("src","src/killstreaks/stockholm_syndrome.png")
    perks.append(perk1)

    const perk2 = document.createElement("img")
    perk2.setAttribute("src","src/killstreaks/duckingjam.png")
    perks.append(perk2)

    const perk3 = document.createElement("img")
    perk3.setAttribute("src","src/killstreaks/msc_trinity.png")
    perks.append(perk3)

    image.append(perks)

    return image
  }
}










