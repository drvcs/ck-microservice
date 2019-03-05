const sentences = require('../queries/customerSentences');
const db = require('../../server/dbMgr');
const l = require('../../common/logger');

/** Encapsula consultas a Oracle */
module.exports = class CustomerService {
  async getDate() {
    let response;
    let conn;
    try {
      conn = await db.getConn(process.env.APP);
      l.debug(`la sentencia es: \n ${sentences}`);
      const queryResult = await db.executeSQL(sentences, conn);
      if (queryResult.rows.length > 0) {
        response = queryResult.rows;
        return response;
      }
      l.debug('No hay datos disponibles para la conuslta');
      return false;
    } catch (error) {
      l.error('Falla en operacion contra DB');
      l.debug(error);
      throw Error(`No se logra consulta DB ${error}`);
    } finally {
      if (conn) { // conn assignment worked, need to close
        try {
          await conn.close();
        } catch (err) {
          l.error(err);
        }
      }
    }
  }
};
