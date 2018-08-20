
exports.seed = function(knex, Promise) {
  return knex('palettes').del()
    .then( () => knex('projects').del())
    .then( () => {
      return Promise.all([

          knex('projects').insert({
            name: 'Awesome Project 1'
          }, 'id')
          .then( project => {
            return knex('palettes').insert([
              { name: 'dark as hell', color1: '#015', color2: '#152', color3: '#233', color4: '#222', color5: '#232', project_id: project[0] },
              { name: 'lighter', color1: '#f15', color2: '#f52', color3: '#f33', color4: '#f22', color5: '#f32', project_id: project[0] }
            ])
          })
          .then(() => console.log('Seeding complete!'))
          .catch(error => console.log(`Error seeding data: ${error}`))
        ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
