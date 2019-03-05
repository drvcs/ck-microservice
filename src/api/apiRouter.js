const express = require('express');
const Controller = require('../api/controllers/controller');

const controller = new Controller();
/**
 * Enrutador, definición de paths.
 * 
 * Ejemplos:
 * .get('/time', controller.functionA);
 * .post('/time', controller.funcitonB);
 * .put('/time', controller.functionC);
 * .delete('/time', controller.functionD);
 */
module.exports = express
  .Router()
  .get('/time', controller.getTime);
