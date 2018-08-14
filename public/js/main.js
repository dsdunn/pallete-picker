$().ready(generateColors);

let currentColors = [];

$('.generate').click(generateColors);

function generateColors() {
  $('.color-square-big').each(function() {
    let color = Math.floor(Math.random()*16777215).toString(16);
    $(this).css('background-color', '#'+color)
    $(this).text(color)
    currentColors.push(color);
    console.log(currentColors)
    
  })
}

