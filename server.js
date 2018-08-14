const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Pallete Picker';
app.locals.projects = [
  {"name": "best project",
  "id": "202020",
  "palletes": 
    [{ "name": "pallete 1",
      "colors": ["#000", "#111", "#222", "#333", "#444"]
    },
    { "name": "pallete 2",
      "colors": ["#333", "#444", "#555", "#666", "#aaa"]
    }]
  } 
  ];

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));

app.get('/projects', (request, response) => {
  return response.status(200).json(app.locals.projects);
})

app.post('/projects', (request, response) => {
  const newPallete = request.body;
  if (app.locals.projects.find(project => project.name === newPallete)
  return response.json(app.locals.projects);
})

app.delete('/projects', (request, response) => {
  app.locals.projects = app.locals.projects.filter(project => project.id !== request.body.id)
  response.status(201).json(app.locals.projects);
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
})