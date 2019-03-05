const oracledb = require('oracledb');
const l = require('../common/logger');

/**
 * Inicializacion y control del pool de conexiones Oracle
 */
function createNewPool() {
  return new Promise((resolve, reject) => {
    try {
      resolve(oracledb.getPool(process.env.APP));
    } catch (error) {
      oracledb.createPool({
        poolAlias: process.env.APP,
        poolMax: +process.env.ORACLEDB_POOL_MAX || 30,
        user: process.env.ORACLEDB_USER || '',
        password: process.env.ORACLEDB_PASS || '',
        connectString: process.env.ORACLEDB_CONN || '',
      }, (errorPool, newPool) => {
        if (errorPool) {
          reject(errorPool);
        }
        return resolve(newPool);
      });
    }
  });
}

async function initialize() {
  await createNewPool();
}

async function close() {
  await oracledb.getPool().close();
}

async function getConn() {
  const active = await oracledb.getConnection(process.env.APP);
  return active;
}
/**
 * Ejecuta una sentencia SQL. Entrega una promesa con el resultado
 * @param {*} statement SQL
 * @param {*} binds parametros
 * @param {*} opts eventuales opciones
 */
function executeSQL(statement, conn, binds = [], opts = {}) {
  return new Promise(async (resolve, reject) => {
    // eslint-disable-next-line no-param-reassign
    opts.outFormat = oracledb.OBJECT;
    // eslint-disable-next-line no-param-reassign
    try {
      l.debug(`Intento de ejecucion sql: ${statement} ${binds}`);
      const result = await conn.execute(statement, binds, opts);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { initialize, executeSQL, close, getConn };
