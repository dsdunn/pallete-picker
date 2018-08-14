const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Pallete Picker';

app.use(express.static('public'));

app.get('/', (request, response) => {
  return response.status(200).send('hi')
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
})