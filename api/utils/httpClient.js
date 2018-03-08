import { services } from '../config';
import superagent from 'superagent';
import JSONbig from 'json-bigint';

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(service, path) {
  const adjestedPath = path[0] !== '/' ? '/' + path : path;
  const port = service.port || '';
  const protol = service.protol || 'http';
  return `${protol}://${service.host}${port ? (':' + port) : ''}${adjestedPath}`;
}

class HttpClient {
  constructor(service) {
    methods.forEach((method) =>
      this[method] = (path, { params, data } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(service, path));
        request.set('Accept', 'text/plain');
        if (params) {
          request.query(params);
        }
        if (data) {
          request.send(data);
        }
        request.end((err, { text }) => {
          const body = JSONbig.parse(text);
          if (err) {
            return reject(new Error('服务器异常'));
          }
          if (body[service.successCodeField] !== service.successCode) {
            return reject(new Error(body[service.errorMsgField]));
          }
          resolve(body);
        });
      }));
  }

  empty() {}
}

const serviceClients = Object.keys(services).reduce((preVal, item) => {
  preVal[item] = new HttpClient(services[item]);
  return preVal;
}, {});

export default serviceClients;
