$().ready(() => {
  generateColors(); 
  populateProjects();
});

let currentColors = [];

$('.generate').click(generateColors);
$('.pallete-form').submit(savePallete);

function generateColors() {
  $('.color-square-big').each(function() {
    let color = Math.floor(Math.random()*16777215).toString(16);
    $(this).css('background-color', '#'+color)
    $(this).find('.color-code').text(color)
    currentColors.push(color);
  })
}

function savePallete(event) {
  let project = $('[name="project-select"]').val();
  event.preventDefault();
  let name = $('[name="pallete-name"]').val();
  let id = Date.now();
  let pallete = { id, project, name, colors: currentColors };
  fetch('http://localhost:3000/projects', {
    method: 'POST',
    body: JSON.stringify(pallete),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json())
      .then(result => console.log(result))
      .catch(error => console.log(error));
}

function populateProjects() {
  console.log('ok')
  fetch('http://localhost:3000/projects')
    .then(response => response.json())
    .then(result => console.log(result))
}
