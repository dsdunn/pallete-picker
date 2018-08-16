$().ready(() => {
  updateColors(); 
  getProjects();
});

let currentColors = [];

$('.generate').click(updateColors);
$('.pallete-form').submit(savePallete);
$('.project-form').submit(saveProject);

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

function saveProject(event) {
  event.preventDefault();
  const name = $('[name="project-name"]').val();
  const body = {
    name: name
  }
  fetch('http://localhost:3000/api/v1/projects', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(result => {
    $('#project-select').prepend(`<option value=${result.id}>${name}</option>`)
    $(`option[value=${result.id}]`).prop('selected', true);
    let article = `
      <article class='project'>
        <h3 class='project-name'>${name}</h3>
        <div class='mini-pallete'>
        no palettes yet
        </div>
      </article>
    `
    $('.project-section').prepend(article)
  })
}

function savePallete(event) {
  event.preventDefault();
  let project_id = $('#project-select').val();
  let name = $('[name="pallete-name"]').val();
  let pallete = { 
    project_id,
    name, 
    color1: currentColors[0],
    color2: currentColors[1],
    color3: currentColors[2],
    color4: currentColors[3],
    color5: currentColors[4]
    };

  fetch('http://localhost:3000/api/v1/palletes', {
    method: 'POST',
    body: JSON.stringify(pallete),
    headers: {
      'Content-Type': 'application/json'
    }
    }).then(() => getProjects())
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
    $('#project-select').prepend(
        `<option value=${project.id}>${project.name}</option>`
      )
    getPalletes(project).then( palletes => {
      let article = `
        <article class='project'>
          <h3 class='project-name'>${project.name}</h3>
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
  const { id } = project;
  return fetch('http://localhost:3000/api/v1/palletes/' + id)
    .then(response => response.json())
    .then(result => result)
}

function createSmallPalletes(arr) {
  // arr.reverse();
  return arr.map(pallete => {
    let { name, color1, color2, color3, color4, color5 } = pallete;
    return(
      `
        <p class='small-pallete-name'>${name}</p>
        <div class='color-square-small' style='background-color:${color1}'></div>
        <div class='color-square-small' style='background-color:${color2}'></div>
        <div class='color-square-small' style='background-color:${color3}'></div>
        <div class='color-square-small' style='background-color:${color4}'></div>
        <div class='color-square-small' style='background-color:${color5}'></div> 
        <img class='delete-button' src='images/delete.svg'/>
      `
    )
  }).join('');
}











