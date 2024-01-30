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

    const image = document.createElement("div")
    image.classList.add("piece")
  
    const svgfile = fetch(url)
    .then(response => response.text())
    .then(text => {image.innerHTML = text})
  
    return image
  }
}










