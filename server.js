//import all necessary libraries and connect files
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

//define port at which server will be available as specified by environment or 3000 by default
//configure express app and bodyparser
app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));
app.locals.title = 'Palette Picker';

//define endpoint for getting palettes by project id
app.get('/api/v1/palettes/:id', (request, response) => {
  // assign the dinamic id provided by the request path to a variable
  const { id } = request.params;
  // select palettes that have matching project_id values
  database('palettes').where('project_id', id).select()
  // asynchronously check for results
  .then(palettes => {
    if(palettes.length) {
      //when results exist, respond with 200 status and the array of results
      response.status(200).json(palettes);
    } else {
      //when no results exist, respond with 404 error code and message
      response.status(404).json({
        error: `No palette with project-id ${id}`
      });
    }
  })
  //handle server error
  .catch(error => {
    resonse.status(500).json({ error });
  })
});

//define endpoint for posting new palettes
app.post('/api/v1/palettes', (request, response) => {
  //assign request body to variable
  const palette = request.body;
  //define required parameters and check that all are present
  for (let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5', 'project_id']) {
    //respond with error code and message if req params are missing
    if (!palette[requiredParameter]) {
      return response.status(422).send({error: `You're missing a "${requiredParameter}" property` });
    }
  }
  //add palette to database and generate id for it
  database('palettes').insert(palette, 'id')
  //confirm successful post and return id
  .then(id => {
    response.status(201).json(id[0])
  })
  //handle server error
  .catch(error => {
    response.status(500).json({error});
  });
});

//define endpoint for deleting palettes by id
app.delete('/api/v1/palettes/:id', (request, response) => {
  // assign the dinamic id provided by the request path to a variable
  const { id } = request.params;
  //delete item from palette table with matching id
  database('palettes').where('id', id).del()
  //confirm success of deletion with status code
  .then(response.sendStatus(202))
  //respond with error if no matching id exists (will never happen...?)
  .catch(error => response.status(404).json({error}));
})

//define endpoint for getting all projects
app.get('/api/v1/projects', (request, response) => {
  //select all projects from projects table
  database('projects').select()
  //respond with success code and array of project objects
    .then((projects) => {
      response.status(200).json(projects);
    })
    //handle server error
    .catch((error) => {
      response.status(500).json({error});
    });
});

//define endpoint for adding projects
app.post('/api/v1/projects', (request, response) => {
  //assign request body to variable
  const project = request.body;
  //define required parameters and check that all are present
  for (let requiredParameter of ['name']) {
    //respond with error code and message if req params are missing
    if (!project[requiredParameter]) {
      return response.status(422).send({error: `Expected format: {name: <STRING> }. You're missing a "${requiredParameter}" property`});
    }
  }
  //add new project to projects table along with generated id
  database('projects').insert(project, 'id')
  .then(project => {
    //confirm addition of project and respond with success code and project id
    response.status(201).json({id: project[0] })
  })
  //handle server error
  .catch(error => {
    response.status(500).json({ error });
  });
});

// expose server endpoints at defined port, log confirmation message on server start
app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
})
//make express server available to db files
module.exports = app;






