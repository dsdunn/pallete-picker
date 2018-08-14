$().ready(() => {
  generateColors(); 
  getProjects();
});

let currentColors = [];

$('.generate').click(generateColors);
$('.pallete-form').submit(savePallete);

function generateColors() {
  $('.color-square-big').each(function() {
    let color = Math.floor(Math.random()*16777215).toString(16);
    $(this).css('background-color', '#'+color)
    $(this).find('.color-code').text(color)
    currentColors.push('#' + color);
  })
}

function savePallete(event) {
  let projectName = $('[name="project-select"]').val();
  event.preventDefault();
  let palleteName = $('[name="pallete-name"]').val();
  let pallete = { 
    projectName,
    palleteName, 
    colors: currentColors };
  fetch('http://localhost:3000/api/v1/projects', {
    method: 'POST',
    body: JSON.stringify(pallete),
    headers: {
      'Content-Type': 'application/json'
    }
    }).then(response => response.json())
      .then(result => {
        console.log(result)
        populateProjects(result)})
      .catch(error => console.log(error));

}

function getProjects() {
  fetch('http://localhost:3000/api/v1/projects')
    .then(response => response.json())
    .then(result => populateProjects(result))
    .catch(error => console.log(error));
}

function populateProjects(projects){
  $('.project-section').html('');
  projects.forEach(project => {
    let { name, palletes } = project;
    let article = `
      <article class='project'>
        <h3 class='project-name'>${name}</h3>
        <div class='mini-pallete'>
        ${createSmallPalletes(palletes)}
          <img class='delete-button'/>
        </div>
      </article>
    `
    $('.project-section').prepend(article)
  })
}

function createSmallPalletes(arr) {
  return arr.map(pallete => {
    let {name, colors} = pallete;
    console.log(pallete)
    return(
      `
        <p class='small-pallete-name'>${name}</p>
        <div class='color-square-small' style='background-color:${colors[0]}'></div>
        <div class='color-square-small' style='background-color:${colors[1]}'></div>
        <div class='color-square-small' style='background-color:${colors[2]}'></div>
        <div class='color-square-small' style='background-color:${colors[3]}'></div>
        <div class='color-square-small' style='background-color:${colors[4]}'></div>
      `
    )
  })
}











