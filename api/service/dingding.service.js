import httpClient from '../utils/httpClient';
import { sessionHost, sessionPort, services } from '../config';
import redis from 'redis';

const redisClient = redis.createClient({
  host: sessionHost,
  port: sessionPort
});
const DING_TOKEN_KEY = 'DING:TOKEN';
const KEY_EXPIRE = 7000;

const getToken = () => {
  return new Promise((resolve, reject) => {
    redisClient.get(DING_TOKEN_KEY, (err, reply) => {
      if (err) {
        return reject(err);
      }
      if (reply) {
        return resolve(reply);
      }
      httpClient.dingding.get('gettoken', {
        params: {
          corpid: services.dingding.appId,
          corpsecret: services.dingding.appSecret,
        }
      }).then((tokenResult) => {
        redisClient.set(DING_TOKEN_KEY, tokenResult.access_token);
        redisClient.expire(DING_TOKEN_KEY, KEY_EXPIRE);
        resolve(tokenResult.access_token);
      });
    });
  });
};

export const createDept = async (name) => {
  const token = await getToken();
  const dingDeptResult = await httpClient.dingding.post('department/create', {
    params: {
      access_token: token
    },
    data: {
      name: name,
      parentid: '1',
      createDeptGroup: true,
      autoAddUser: true
    }
  });
  console.log(dingDeptResult.id);
  return dingDeptResult.id;
};

export const delDept = async (id) => {
  const token = await getToken();
  httpClient.dingding.get('department/delete', {
    params: {
      access_token: token,
      id: id
    }
  });
};

export const updateDept = async (id, dept) => {
  const token = await getToken();
  httpClient.dingding.post('department/update', {
    params: {
      access_token: token
    },
    data: {
      id: id,
      ...dept
    }
  });
};

export const createUser = async (user) => {
  const token = await getToken();
  const dingUserCreateResult = await httpClient.dingding.post('/user/create', {
    params: { access_token: token },
    data: user
  });
  return dingUserCreateResult.userid;
};

export const delUser = async (id) => {
  const token = await getToken();
  httpClient.dingding.get('user/delete', {
    params: {
      userid: id,
      access_token: token
    }
  });
};

export const updateUser = async (id, user) => {
  const token = await getToken();
  httpClient.dingding.post('user/update', {
    params: {
      access_token: token
    },
    data: {
      ...user,
      userid: id
    }
  });
};
