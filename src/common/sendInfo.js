/* eslint-disable no-param-reassign */
const needle = require('needle');
const l = require('./logger');


function sendErr(res, statusId, msg) {
  const status = parseInt(statusId, 10) || 500;
  l.debug(`Error: ${status} ${msg}`);
  const errorData = { errorId: status,
    appId: process.env.APP_ID,
    errorMsg: msg || 'error en microservicio',
  };
  console.log(errorData);
  res.status(status).json(errorData);
}

function sendMail(jsonOri, req, status) {
  jsonOri.text.status = status || '';
  jsonOri.text.uri = req.originalUrl || req.baseUrl || '';
  jsonOri.text.protocol = req.protocol || '';
  jsonOri.method = req.method || '';
  jsonOri.text.host = req.hostname || '';
  jsonOri.text.remoteAddress = req.connection.remoteAddress || '';
  jsonOri.to = jsonOri.to;
  jsonOri.subject = jsonOri.subject;
  jsonOri.text = JSON.stringify(jsonOri.text, null, 2);
  jsonOri.html = `<pre>${jsonOri.text}</pre>`;

  return new Promise((resolve, reject) => {
    needle.post(`${process.env.MAIL_URI}`, jsonOri,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        open_timeout: 5000,
      },
      error => {
        if (error) {
          reject(true);
        } else {
          return resolve(true);
        }
      });
  });
}

module.exports = { sendErr, sendMail };
