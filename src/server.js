import Express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import config from './config';
import favicon from 'serve-favicon';
import compression from 'compression';
import httpProxy from 'http-proxy';
import path from 'path';
import createStore from './redux/create';
import Html from './helpers/Html';
import PrettyError from 'pretty-error';
import http from 'http';
import { match } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { ReduxAsyncConnect, loadOnServer } from 'redux-async-connect';
import createHistory from 'react-router/lib/createMemoryHistory';
import {Provider} from 'react-redux';
import getRoutes from './routes';

const targetUrl = 'http://' + config.apiHost + ':' + config.apiPort;
const pretty = new PrettyError();
const app = new Express();
const server = new http.Server(app);
const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  ws: true,
  xfwd: true
});

app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));

app.use(Express.static(path.join(__dirname, '..', 'static')));

// Proxy to API server
app.use('/graphql', (req, res) => {
  proxy.web(req, res, {target: targetUrl + '/graphql'});
});

app.use('/ws', (req, res) => {
  proxy.web(req, res, {target: targetUrl + '/ws'});
});

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {
  let json;
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }
  if (!res.headersSent) {
    res.writeHead(500, {'content-type': 'application/json'});
  }

  json = {error: 'proxy_error', reason: error.message};
  res.end(JSON.stringify(json));
});

app.use((req, res) => {
  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }
  const memoryHistory = createHistory(req.originalUrl);
  const store = createStore(memoryHistory, req);
  const history = syncHistoryWithStore(memoryHistory, store);
  const getBrowserInfo = () => {
    const agent = req.headers['user-agent'].toLowerCase();
    const regStrIe = /msie [\d.]+;/gi;
    const regStrFf = /firefox\/[\d.]+/gi;
    const regStrChrome = /chrome\/[\d.]+/gi;
    const regStrSaf = /safari\/[\d.]+/gi;
    const regStrEdg = /trident\/[\d.]+/gi;
    // IE
    if (agent.indexOf('msie') > 0) {
      return agent.match(regStrIe);
    }

    // edge
    if (agent.indexOf('trident') > 0) {
      return agent.match(regStrEdg);
    }

    // firefox
    if (agent.indexOf('firefox') > 0) {
      return agent.match(regStrFf);
    }

    // Chrome
    if (agent.indexOf('chrome') > 0) {
      return agent.match(regStrChrome);
    }

    // Safari
    if (agent.indexOf('safari') > 0 && agent.indexOf('chrome') < 0) {
      return agent.match(regStrSaf);
    }
  };
  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store}/>));
  }
  if (!req.headers['user-agent']) {
    res.send(
      `
      <!DOCTYPE html>
      <html>
      <head>
      	<title>无法访问</title>
      </head>
      <body>
      	<h1>无法访问到该页面</h1>
      	<p>无法定位访问该页面的浏览器，所以无法渲染。请用正常浏览器访问！</p>
      </body>
      </html>
      `
    );
  }
  const browser = getBrowserInfo();
  const verinfo = (browser + '').replace(/[^0-9.]/ig, '');
  if (~browser[0].indexOf('msie') && parseInt(verinfo, 10) < 11) {
    res.sendfile('static/brower-warn.html');
    return;
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient();
    return;
  }

  match({ history, routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      console.error('ROUTER ERROR:', pretty.render(error));
      res.status(500);
      hydrateOnClient();
    } else if (renderProps) {
      loadOnServer({...renderProps, store}).then(() => {
        const component = (
          <Provider store={store} key="provider">
            <ReduxAsyncConnect {...renderProps} />
          </Provider>
        );

        res.status(200);

        global.navigator = {userAgent: req.headers['user-agent']};

        res.send('<!doctype html>\n' +
          ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store}/>));
      });
    } else {
      res.status(404).send('Not found');
    }
  });
});

if (config.port) {
  server.listen(config.port, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.apiPort);
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
