const middleware = require('swagger-express-middleware');
const path = require('path');
const send = require('../../common/sendInfo');
const l = require('../../common/logger');

/**
 * Funcionalidades asociadas al Swagger constado.
 */
// eslint-disable-next-line func-names
module.exports = function (app, routes) {
  l.info(`  Swagger: ${path.join(__dirname, 'api.yaml')}`);
  l.debug(`  publicacion ${process.env.API_BASEPATH}${process.env.API_SWAGGER_DOC}`);
  middleware(path.join(__dirname, 'api.yaml'), app, (err, mw) => {
    app.enable('case sensitive routing');
    app.enable('strict routing');
    app.use(mw.metadata());
    app.use(mw.files({
      caseSensitive: false,
      strict: false,
    }, {
      useBasePath: true,
      apiPath: process.env.API_SWAGGER_DOC,
    }));

    /** Definido en ExpressServer */
    app.use(mw.parseRequest({
      cookie: {
        secret: process.env.SESSION_SECRET,
      },
      json: {
        limit: process.env.REQUEST_LIMIT,
      },
    }));

    /** Capacidades de CORS, Validacion y Mock */
    app.use(
      mw.CORS(),
      mw.validateRequest(),
    );

    // app.use('/mock', mw.mock());

    // Error handler
    app.use(async (errSwagger, req, res, next) => {
      l.error(`error swagger ${errSwagger}`);
      send.sendErr(res, errSwagger.status || 400, errSwagger);
      const subject = `Warn on ${process.env.APP}`;
      await send.sendMail({
        to: process.env.MAIL_TO,
        subject: subject.toUpperCase().trim(),
        text: { message: `${errSwagger}` },
      }, req, errSwagger.status);
    });

    routes(app);
  });
};
