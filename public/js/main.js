$().ready(generateColors);

let currentColors = [];

$('.generate').click(generateColors);

function generateColors() {
  for (let i=1; i < 6; i++) {
    let id = "#color" + i;
    let color = Math.floor(Math.random()*16777215).toString(16);
    $(id).css('background-color', '#'+color)
    $(id + '  .color-code').text(color)
    currentColors.push(color);
    console.log(currentColors)
  }
}

