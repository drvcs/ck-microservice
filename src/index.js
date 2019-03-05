const dotenv = require('dotenv');
const Server = require('./server/ExpressServer');
const db = require('./server/dbMgr');
const routes = require('./api/routes');
const l = require('./common/logger');
/**
 * Inicia el microservicio:
 *  Inicia conexión DB
 *  Inicia Express Server con routes asociados al api
 * */
process.env.UV_THREADPOOL_SIZE = +process.env.ORACLEDB_POOL_MAX +
                                  +process.env.DEFAULT_UV_THREADPOOL_SIZE;

dotenv.config();

/** Inicialización de microservicio, lanza definición de route en api */
async function startup() {
  l.info('Control de inicialización de microservicio VCSoft');
  l.info(`Log-Level: ${l.level}`);

  l.debug(`UV_THREADPOOL_SIZE=${process.env.UV_THREADPOOL_SIZE}`);
  try {
    l.info('Inicia conexión a DB');
    await db.initialize();
  } catch (err) {
    l.error(`Falla en conexión a Oracle. El microservicio no se iniciará: ${err}`);
    process.exit(1); // Non-zero failure code
  }
  try {
    l.info('Inicia HTTP');
    new Server().router(routes).listen(process.env.PORT);
  } catch (err) {
    l.error(`Falla en inicializacion HTTP. El microservicio no se iniciará: ${err}`);
    process.exit(1); // Non-zero failure code
  }
}

/** Se detiene de forma controlada el microservicio */
async function shutdown(e) {
  let err = e;
  l.info('Control de shutdown de Microservicio');
  try {
    l.info(' Cerrado de HTTP');
    await Server.close();
  } catch (eHttpClose) {
    l.info('Falla en cerrado de HTTP', eHttpClose);
    err = err || eHttpClose;
  }
  try {
    l.info('Cerrado de Conexión Oracle');
    await db.close();
  } catch (eDB) {
    l.error('Falla en cerrado de Conexión Oracle', eDB);
    err = err || eDB;
  }
  l.info('Ejecutado shutdown de Microservicio');

  if (err) {
    process.exit(1); // Non-zero failure code
  } else {
    process.exit(0);
  }
}


process.on('SIGINT', () => {
  l.info('Recibida una señal de interrupción ctrl-c: SIGINT');
  shutdown();
});
process.on('SIGTERM', () => {
  l.info('Recibida una señal de terminación (posiblemente K8S): SIGTERM');
  shutdown();
});
process.on('uncaughtException', err => {
  l.error('Excepcion no controlada obliga shutdown');
  l.error(err);
  shutdown(err);
});


/** Inicialización del microservicio */
startup();
