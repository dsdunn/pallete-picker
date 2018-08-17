const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const knex = require('../db/knex');

chai.use(chaiHttp);

describe(' GET api/v1/projects', () => {

  beforeEach(done => {
    knex.migrate.rollback()
    .then(() => knex.migrate.latest())
      .then(() => knex.seed.run())
      .then(() => done())
  })

  it('should return all projects', (done) => {  
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
    })
  })

});