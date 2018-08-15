const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);


app.set('port', process.env.PORT || 3000);
app.locals.title = 'Pallete Picker';
// app.locals.projects = [
//   {"name": "1",
//   "id": "202020",
//   "palletes": 
//     ["pallete 1", "pallete 2"]
//   }];

// app.locals.palletes = {
//   "pallete 1" : {
//     "name": "pallete 1",
//     "project": "1",
//     "colors": ["#000", "#111", "#222", "#333", "#444"]
//   },
//   'pallete 2' : {
//     "name": "pallete 2",
//     "project":  "1",
//     "colors": ["#333", "#444", "#555", "#666", "#aaa"]
//   }
// }

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));

app.get('/api/v1/palletes/:id', (request, response) => {
  const { id } = request.params;
  return response.status(200).json(Object.values(app.locals.palletes).filter(pallete => pallete.project === id))
})

app.post('/api/v1/palletes', (request, response) => {
  const pallete = request.body;
  if (!app.locals.palletes[pallete.name]) {  
    app.locals.palletes[pallete.name] = pallete;
    app.locals.projects.forEach(project => {
      if (project.name === pallete.projectName) {
        project.palletes = [...project.palletes, pallete.name];
      }
    });
  }
  response.status(200).json(app.locals.projects);
})

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then((projects) => {
      response.status(200).json(projects);
    })
    .catch((error) => {
      response.status(500).json({error});
    });
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['name']) {
    if (!project[requiredParameter]) {
      return response.status(422).send({error: `Expected format: {name: <STRING> }. You're missing a "${requiredParameter}" property`});
    }
  }

  database('projects').insert(project, 'id')
    .then(project => {
      response.status(201).json({id: project[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    })
})

app.delete('/projects', (request, response) => {
  app.locals.projects = app.locals.projects.filter(project => project.id !== request.body.id)
  response.status(201).json(app.locals.projects);
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
})










