const chai = require('chai');
const chaiHttp = require('chai-http');
require('../src/common/env');
const request = require('supertest');
const Server = require('../src/server/ExpressServer');

chai.use(chaiHttp);
const expect = chai.expect;
/** Prueba del GET
*/
describe(`/GET ${process.env.API_BASEPATH}/time`, () => {

  it('Consultas de prueba que deben existir en la Base de datos', () => {
    const app = new Server();
    request(app.listen())
      .get(`${process.env.API_BASEPATH}/time`)
      .expect('Content-Type', /json/)
      .end(res => {
        expect(res.body)
          .to.be.an.an('array')
          .of.length(2)
          .should.have.status(200);
      });
  });
});
