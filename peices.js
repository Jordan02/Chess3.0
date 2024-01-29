const king = getPeiceImage()



function getPeiceImage () {

  fetch('src\\peices\\cburnett\\bP.svg')
    .then(response => response.text())
    .then(svgString => {
        // Use svgString as needed in your JavaScript code
        console.log(svgString);
    })
    .catch(error => console.error('Error fetching peice SVG:', error));
}