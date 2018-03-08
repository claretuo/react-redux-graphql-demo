import httpClient from '../utils/httpClient';
import { sessionHost, sessionPort, services } from '../config';
import redis from 'redis';

const redisClient = redis.createClient({
  host: sessionHost,
  port: sessionPort
});
const NEW4G_TOKEN_KEY = 'NEW4G:TOKEN';
const KEY_EXPIRE = 7000;
const PARENT_DEPT_ID = '8087463799351182917';
const DEFAULT_PWD = 'Time.9818';

const getToken = () => {
  return new Promise((resolve, reject) => {
    redisClient.get(NEW4G_TOKEN_KEY, (err, reply) => {
      if (err) {
        return reject(err);
      }
      if (reply) {
        return resolve(reply);
      }
      httpClient.new4g.get('/cgi-bin/gettoken', {
        params: {
          corpid: services.new4g.appId,
          corpsecret: services.new4g.appSecret
        }
      }).then((tokenResult) => {
        redisClient.set(NEW4G_TOKEN_KEY, tokenResult.access_token);
        redisClient.expire(NEW4G_TOKEN_KEY, KEY_EXPIRE);
        resolve(tokenResult.access_token);
      });
    });
  });
};

export const createDept = async (name) => {
  const token = await getToken();
  const deptResult = await httpClient.new4g.post('/cgi-bin/department/create', {
    params: {
      access_token: token
    },
    data: `{ "parentid": ${PARENT_DEPT_ID}, "name": "${name}"}`
  });
  return deptResult.id.toString();
};

export const updateDept = async (id, dept) => {
  const token = await getToken();
  httpClient.new4g.post('/cgi-bin/department/update', {
    params: {
      access_token: token
    },
    data: `{ "id": ${id}, "name": "${dept.name}" }`
  });
};

export const delDept = async (id) => {
  const token = await getToken();
  httpClient.new4g.get('/cgi-bin/department/delete', {
    params: {
      access_token: token,
      id: id
    }
  });
};

export const createUser = async (user) => {
  const token = await getToken();
  httpClient.new4g.post('/cgi-bin/user/create', {
    params: {
      access_token: token
    },
    data: `{
      "userid": "${user.userid}",
      "name": "${user.name}",
      "department": [${user.department}],
      "mobile": "${user.mobile}",
      "gender": "${user.gender}",
      "password": "${DEFAULT_PWD}",
      "cpwd_login": 1
    }`
  });
};

export const updateUser = async (id, user) => {
  const token = await getToken();
  httpClient.new4g.post('/cgi-bin/user/update', {
    params: {
      access_token: token
    },
    data: `
      {
        "userid": "${id}",
        "name": "${user.name}",
        "department": [${user.department}]
      }
    `
  });
};

export const delUser = async (id) => {
  const token = await getToken();
  httpClient.new4g.get('/cgi-bin/user/delete', {
    params: {
      access_token: token,
      userid: id
    }
  });
};
