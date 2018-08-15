$().ready(() => {
  updateColors(); 
  getProjects();
});

let currentColors = [];

$('.generate').click(updateColors);
$('.pallete-form').submit(savePallete);

function updateColors() {
  currentColors = [];
  $('.color-square-big').each(function() {
    let color = generateColor();
    $(this).css('background-color', color)
    $(this).find('.color-code').text(color)
    currentColors.push(color);
  })
}

function generateColor() {
  const nums = '0123456789abcdef';
  let color = ['#'];
  for(let i = 0; i < 6; i++) {
    let index = Math.floor(Math.random() * 15);
    color.push(nums[index]);
  }
  return color.join('');
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
      .then(result => populateProjects(result))
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
    getPalletes(project).then( palletes => {
      let article = `
        <article class='project'>
          <h3 class='project-name'>${name}</h3>
          <div class='mini-pallete'>
          ${createSmallPalletes(palletes)}
          </div>
        </article>
      `
      $('.project-section').prepend(article)
    });
  })
}

function getPalletes(project) {
  let value;
  return fetch('http://localhost:3000/api/v1/palletes/' + project.name)
    .then(response => response.json())
    .then(result => result)
}

function createSmallPalletes(arr) {
  arr.reverse();
  return arr.map(pallete => {
    let {name, colors} = pallete;
    return(
      `
        <p class='small-pallete-name'>${name}</p>
        <div class='color-square-small' style='background-color:${colors[0]}'></div>
        <div class='color-square-small' style='background-color:${colors[1]}'></div>
        <div class='color-square-small' style='background-color:${colors[2]}'></div>
        <div class='color-square-small' style='background-color:${colors[3]}'></div>
        <div class='color-square-small' style='background-color:${colors[4]}'></div> 
        <img class='delete-button' src='images/delete.svg'/>
      `
    )
  }).join('');
}











