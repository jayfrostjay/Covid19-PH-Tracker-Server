const https = require('https')

module.exports = {
  REQUEST_SUCCESS: 200,
  REQUEST_BAD: 500,
  REQUEST_RETURN_JSON: "application/json",
  buildOptions: function (hostname, path = '/', headers, method = 'GET', port = '', ) {
    return {
      hostname: hostname,
      path: path,
      method: method,
      port: port,
      headers: headers
    };
  },
  apiRequestWrapper: function (options, callback) {
    const apiRequest = https.request(options, res => {
      let body = "";
      let statusCode = res.statusCode;

      res.setEncoding('utf8');
      res.on('data', (data) => {
        body += data;
      })

      res.on('end', () => {
        try {
          body = JSON.parse(body)
          callback(statusCode, body)
        } catch (e) {
          callback(this.REQUEST_BAD, {
            message: 'Something went wrong...'
          })
        }
      })
    })

    apiRequest.on('error', error => {
      callback(this.REQUEST_BAD, {
        message: error
      })
    })

    apiRequest.end();
  }
}