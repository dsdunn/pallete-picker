$().ready(() => {
  updateColors(); 
  getProjects();
});

let currentColors = [];

$('.generate').click(updateColors);
$('.pallete-form').submit(savePallete);
$('.project-form').submit(saveProject);
$('.lock-button').click(lockColor);
$('.project-section').on('click','.delete-button',deletePallete);
$('.project-section').on('click', '.mini-colors', displayPallete);

function displayPallete() {
  let arr = [];
  $(this).children().each(function(i) {
    let color = $(this).css('background-color');
    console.log(color)
    arr.push(color);
  })
  updateColors(arr);
}

function updateColors(colors = []) {
  console.log(colors)
  currentColors = [];
  $('.color-square-big').each(function(i) {
    if( $(this).hasClass('locked')){
      return;
    }
    let color;
    if(colors.length) {
     color =  colors[i] 
    } else { 
      color = generateColor() 
    }
  // console.log(color)
    $(this).css('background', `linear-gradient(${color} 78%, #fffbe8)`)
    $(this).find('.color-code').text(color)
    currentColors.push(color);
  })
  updateBackground();
}

function updateBackground() {
  const background = `
    linear-gradient(to right, ${currentColors[0]},${currentColors[1]} 35%,${currentColors[2]} 55%,${currentColors[3]} 65%,${currentColors[4]} 85%) 
  `;

  $('.jumbotron').css('background-image', background);
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

function lockColor(event) {
  const color = $(event.target).closest('.color-square-big')

  color.toggleClass('locked');
  const icon = color.hasClass('locked') ? '../images/lock.svg' : '../images/lock-open.svg';

  $(event.target).attr('src', icon);
}

function deletePallete(event) {
  const id = $(this).attr('id');

  fetch(`/api/v1/palletes/${id}`, {
    method: 'DELETE'
  })

  $(event.target).closest('.mini-pallete').remove();
}

function saveProject(event) {
  event.preventDefault();

  const name = $('[name="project-name"]').val();
  const body = {
    name: name
  }
  let selector = `.${name}`;
  let alert = $('.name-alert');

  alert.attr('hidden',true);
  if ($(selector).length) {
    alert.attr('hidden', false);
    return;
  }

  fetch('/api/v1/projects', {
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
        <h3 class='project-name ${name}'>${name}</h3>
        <div class='mini-pallete'>
        no palletes yet
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

  fetch('/api/v1/palletes', {
    method: 'POST',
    body: JSON.stringify(pallete),
    headers: {
      'Content-Type': 'application/json'
    }
    }).then(() => getProjects())
      .catch(error => console.log(error));
}

function getProjects() {
  fetch('/api/v1/projects')
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
          ${createSmallPalletes(palletes)}
        </article>
      `
      $('.project-section').prepend(article)
    });
  })
}

function getPalletes(project) {
  const { id } = project;
  return fetch('/api/v1/palletes/' + id)
    .then(response => response.json())
    .then(result => result)
}

function createSmallPalletes(arr) {
  // arr.reverse();
  return arr.map(pallete => {
    let { name, color1, color2, color3, color4, color5, id } = pallete;
    return(
      `
        <div class='mini-pallete'>
          <p class='small-pallete-name'>${name}</p>
          <div class='mini-row'>
            <img id=${id} class='delete-button' src='images/delete.svg'/>
            <div class='mini-colors'>
              <div class='color-square-small id=${color1}' style='background-color:${color1}'></div>
              <div class='color-square-small id=${color2}' style='background-color:${color2}'></div>
              <div class='color-square-small id=${color3}' style='background-color:${color3}'></div>
              <div class='color-square-small id=${color4}' style='background-color:${color4}'></div>
              <div class='color-square-small id=${color5}' style='background-color:${color5}'></div>
            </div> 
          </div>
        </div>
      `
    )
  }).join('');
}











