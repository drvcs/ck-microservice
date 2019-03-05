const Express = require('express');
const expressWinston = require('winston-express-middleware');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const cookieParser = require('cookie-parser'); 
const swaggerify = require('../api/swagger/swagger');
const l = require('../common/logger');

/**
 * Configuraciones de Express encapsuladas en la clase ExpressServer
 */
const app = new Express();

class ExpressServer {
  constructor() {
    const root = path.normalize(`${__dirname}/../..`);
    l.info(`  Preparación Server, root definido: ${root}`);
    app.set('appPath', `${root}client`);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    l.debug(`  páginas estaticas: ${root}/public`);
    app.use(`${process.env.API_BASEPATH}${process.env.API_SWAGGER_PUBLICATION}`, Express.static(`${root}/public`));
    app.use(expressWinston.logger({
      winstonInstance: l,
      meta: true,
      msg: '{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}',
      expressFormat: true,
      colorStatus: true,
    }));
  }

  /**
   * Activa Swagger
  */
  router(routes) {
    l.debug(' Invoca procesamiento de Swagger');
    swaggerify(app, routes);
    return this;
  }

  /**
   * es el listen del ExpressServer. Siempre en TLS con variables de ambiente
   * env.CERT_PATH, env.CERT_PASSPHRSE,env.SECURE_PROTOCOL
   * @param {*} port puerto en el que se inicia HTTPS
   */
  listen(port = process.env.PORT) {
    const welcome = p => () => {
      l.info(` Listen servicio HTTP microservicio. Puerto: ${p}`);
    };
    http.createServer(app).listen(port, welcome(port));
    return app;
  }

  close() {
    return new Promise((resolve, reject) => {
      l.info('Deteniendo HTTP');
      http.close(err => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
}

module.exports = ExpressServer;
