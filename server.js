const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Pallete Picker';
app.locals.projects = [
  {"name": "best project",
  "id": "202020", 
  "colors": ["#000", "#111", "#222", "#333", "#444"]}];

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));

app.get('/projects', (request, response) => {
  return response.status(200).json(app.locals.projects);
})

app.post('/projects', (request, response) => {
  const newProject = request.body;
  app.locals.projects.push(newProject);
  return response.json(app.locals.projects);
})

app.delete('/projects', (request, response) => {
  app.locals.projects = app.locals.projects.filter(project => project.id !== request.body.id)
  response.status(201).json(app.locals.projects);
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
})