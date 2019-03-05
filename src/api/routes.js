require('../common/env');
const apiRouter = require('./apiRouter');

/**
 * Rutas generales del microservicio
 */
module.exports = function routes(app) {
  /** Route de API */
  app.use(process.env.API_BASEPATH, apiRouter);

  /** Route admin */
  // app.use('/admin', );
};
