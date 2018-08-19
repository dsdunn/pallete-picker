const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));

app.get('/api/v1/palletes/:id', (request, response) => {
  const { id } = request.params;
  database('palletes').where('project_id', id).select()
  .then(palletes => {
    if(palletes.length) {
      response.status(200).json(palletes);
    } else {
      response.status(404).json({
        error: `No palette with project-id ${id}`
      });
    }
  })
  .catch(error => {
    resonse.status(500).json({ error });
  })
});

app.post('/api/v1/palletes', (request, response) => {
  const pallete = request.body;
  for (let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5', 'project_id']) {
    if (!pallete[requiredParameter]) {
      return response.status(422).send({error: `You're missing a "${requiredParameter}" property` });
    }
  }

  database('palletes').insert(pallete, 'id')
  .then(id => {
    response.status(201).json(id[0])
  })
  .catch(error => {
    response.status(500).json({error});
  });
});

app.delete('/api/v1/palletes/:id', (request, response) => {
  const { id } = request.params;

  database('palletes').where('id', id).del()
  .then(response.sendStatus(202))
  .catch(error => response.status(404).json({error}));
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
  });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
})

module.exports = app;






