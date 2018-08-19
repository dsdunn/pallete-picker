const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const knex = require('../db/knex');

chai.use(chaiHttp);

describe('Client routes', () => {
  it('should return an html homepage', done => {
    chai.request(server)
    .get('/')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.html;
      done();
    })
  })

  it('should return a 404 for a route that doesnt exist', done => {
    chai.request(server)
    .get('/bullhonkey')
    .end((err, response) => {
      response.should.have.status(404);
      done();
    })
  })
})

describe(' API routes', () => {

  beforeEach(done => {
    knex.migrate.rollback()
    .then(() => knex.migrate.latest())
      .then(() => knex.seed.run())
      .then(() => done())
  })
  
  describe(' GET api/v1/projects', () => {

    it('should return all projects', done => {  
      chai.request(server)
      .get('/api/v1/projects')
      .end((error, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.should.be.a('object');
        res.body[0].id.should.be.a('number');
        res.body[0].should.have.property('name');
        res.body[0].name.should.be.a('string');
        done();
      });
    });
  });

  describe(' POST api/v1/projects', () => {

    it('should add a project to the database', done => {
      chai.request(server)
      .post('/api/v1/projects')
      .send({
        name: "Cool Project"
      })
      .end((error, res) => {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.have.property('id');
        res.body.id.should.equal(2);
        done();
      })
    })

    it('should return an error if required params are missing', done => {
      chai.request(server)
      .post('/api/v1/projects')
      .end((error, res) => {
        res.should.have.status(422);
        res.should.be.json;
        res.body.should.have.property('error');
        res.body.error.should.equal('Expected format: {name: <STRING> }. You\'re missing a "name" property');
        done();
      })
    })

  })

  describe('GET api/v1/palletes/:id', () => {

    it('should return a palette with the correct id', done => {
      chai.request(server)
      .get('/api/v1/palletes/1')
      .end((error, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].should.have.property('id');
        res.body[0].id.should.equal(1);
        done();
      })
    })

    it('should return an error if id doesn\'t exist', done => {
      chai.request(server)
      .get('/api/v1/palletes/8')
      .end((error, res) => {
        res.should.have.status(404);
        res.should.be.json;
        res.body.should.have.property('error');
        res.body.error.should.equal('No palette with project-id 8');
        done();
      })
    })
  })

  describe('POST api/v1/palletes', () => {
    it('should return a palette object on success', done => {
      chai.request(server)
      .post('/api/v1/palletes')
      .send({
        'name': 'sweet',
        'color1': '#000',
        'color2': '#000',
        'color3': '#000',
        'color4': '#000',
        'color5': '#000',
        'project_id': 1
      })
      .end((error, res) => {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('number');
        res.body.should.equal(3);
        done()
      })
    })

    it('should return an error if required params are missing', done => {
      chai.request(server)
      .post('/api/v1/palletes')
      .send({
        'name': 'sweet',
        'color1': '#000',
        'color2': '#000',
        'color3': '#000',
        'color4': '#000',
        'color5': '#000'
      })
      .end((error, res) => {
        res.should.have.status(422);
        res.should.be.json;
        res.body.should.have.property('error');
        res.body.error.should.equal('You\'re missing a "project_id" property');
        done();
      })
    })
  })

  describe('DELETE /api/v1/palletes/:id', () => {
    it('should delete a palette by id', done => {
      chai.request(server)
      .delete('/api/v1/palletes/1')
      .end((error, res) => {
        res.should.have.status(202);
        done();
      })
    })
  })

});


























