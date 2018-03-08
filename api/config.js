require('babel-polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

export default Object.assign({
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  sessionHost: process.env.SESSION_HOST || 'localhost',
  sessionPort: process.env.SESSION_PORT,
  services: {
    auth: {
      protol: 'http',
      host: process.env.SERVICE_HOST || 'localhost',
      port: process.env.SERVICE_PORT,
      successCodeField: 'code',
      successCode: 200,
      errorMsgField: 'msg'
    },
    logs: {
      protol: 'http',
      host: process.env.LOG_SERVICE_HOST || 'localhost',
      port: process.env.LOG_SERVICE_PORT,
      successCodeField: 'code',
      successCode: 200,
      errorMsgField: 'msg'
    },
    new4g: {
      protol: 'https',
      host: process.env.NEW4G_HOST,
      appId: process.env.NEW4G_APP_ID,
      appSecret: process.env.NEW4G_APP_SECRET,
      successCodeField: 'errcode',
      successCode: 0,
      errorMsgField: 'errmsg'
    },
  }
}, environment);
