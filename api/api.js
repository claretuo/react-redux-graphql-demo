import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import config from './config';
import expressGraphQL from 'express-graphql';
import http from 'http';
import SocketIo from 'socket.io';
import schemas from './schemas';
import redis from 'connect-redis';
// import { addLog } from './service/auth.log.service';

const RedisStore = redis(session);
const app = express();
const server = new http.Server(app);

const io = new SocketIo(server);
io.path('/ws');

app.use(session({
  secret: 'qeQWWE3412312312dsdqewqwsdkjdfkoiudaskdyud90833PP',
  resave: false,
  rolling: true,
  saveUninitialized: false,
  store: new RedisStore({
    host: config.sessionHost,
    port: config.sessionPort,
    prefix: 'auth:',
  }),
  cookie: { maxAge: 1800 * 1000 }
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  if (req.body && req.body.query && ~req.body.query.indexOf('mutation login')) {
    req.optAuth = {
      name: '登录',
      authNum: 'login'
    };
  }
  if (req.body && req.body.query && ~req.body.query.indexOf('mutation modifyPassword')) {
    req.optAuth = {
      name: '修改密码',
      authNum: 'modifyPassword'
    };
  }
  if (req.body && req.body.query && ~req.body.query.indexOf('mutation resetPassword') && req.session && req.session.user) {
    req.optAuth = {
      name: '重置密码',
      authNum: 'resetPassword'
    };
    req.user = req.session.user;
  }
  if (req.body && req.body.query && !~req.body.query.indexOf('mutation login') && !~req.body.query.indexOf('mutation resetPassword') && !~req.body.query.indexOf('mutation logout')) {
    if (!req.session.user) {
      return res.status(401).send('没有登录');
    }
    req.user = req.session.user;
    if (/^(\s+)?mutation/.test(req.body.query) && !~req.body.query.indexOf('mutation modifyPassword')) {
      const regExp = /^\s*mutation\s(\w+)?\s*\{([\w+\W+]+)+\}/;
      const authCode = req.body.query.match(regExp) && req.body.query.match(regExp)[1];
      const optAuth = req.session.operatorAuths.filter((item) => item.authNum === authCode);
      if (!(optAuth && optAuth.length)) {
        return res.status(403).send('无对应操作权限！');
      }
      req.optAuth = optAuth[0];
    }
  }
  next();
});

// app.use((req, res, next) => {
//   const originalEnd = res.end;
//   res.end = function newEndFunc(chunk, encoding) {
//     const body = new Buffer(chunk).toString(encoding || 'utf-8');
//     if (req.body && req.body.query && ~req.body.query.indexOf('mutation') && !~req.body.query.indexOf('mutation logout')) {
//       addLog(req, res.statusCode, body);
//     }
//     originalEnd.apply(res, arguments);
//   };
//   next();
// });

app.use(`/graphql`, expressGraphQL({
  schema: schemas,
  graphiql: process.env.NODE_ENV !== 'production',
  pretty: process.env.NODE_ENV !== 'production',
}));

const bufferSize = 100;
const messageBuffer = new Array(bufferSize);
let messageIndex = 0;

if (config.apiPort) {
  const runnable = app.listen(config.apiPort, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> 🌎  API is running on port %s', config.apiPort);
    console.info('==> 💻  Send requests to http://%s:%s', config.apiHost, config.apiPort);
  });

  io.on('connection', (socket) => {
    socket.emit('news', {msg: `'Hello World!' from server`});

    socket.on('history', () => {
      for (let index = 0; index < bufferSize; index++) {
        const msgNo = (messageIndex + index) % bufferSize;
        const msg = messageBuffer[msgNo];
        if (msg) {
          socket.emit('msg', msg);
        }
      }
    });

    socket.on('msg', (data) => {
      data.id = messageIndex;
      messageBuffer[messageIndex % bufferSize] = data;
      messageIndex++;
      io.emit('msg', data);
    });
  });
  io.listen(runnable);
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
