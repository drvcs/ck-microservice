const l = require('../../common/logger');
const Service = require('../services/customer');
const sendError = require('../../common/sendInfo');
/**
 * Se encarga de obtener los parametros y realizar la invocación al servicio.
 */
module.exports = class Controller {
  async getTime(req, res) {
    const response = await new Service().getDate();
    l.debug(`Resultado para consulta fue: ${response}, `);
    if (response) {
      res.status(200).json(response);
    } else {
      sendError.sendErr(res, 404, 'Wrong response');
    }
  }
};
