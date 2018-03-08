import path from 'path';
import caller from 'grpc-caller';
import { services as serviceConfig } from '../config';
const logStub = caller(`${serviceConfig.logs.host}:${serviceConfig.logs.port}`, path.resolve(__dirname, '../proto/log.proto'), 'LogService');

export const addLog = (req, resStatusCode, resBody) => {
  let status;
  let errMsg;
  if (JSON.parse(resBody).errors && JSON.parse(resBody).errors.length) {
    status = 'FAIL';
    errMsg = JSON.stringify(JSON.parse(resBody).errors[0].message);
  } else {
    status = 'SUCCESS';
  }
  const newReqBody = req.body;
  if (newReqBody && newReqBody.query && ~newReqBody.query.indexOf('password')) {
    newReqBody.query = null;
  }
  const logData = {
    opType: req.optAuth ? req.optAuth.name : '未知',
    reqBody: JSON.stringify(newReqBody),
    userId: req.user && req.user.id,
    userName: req.user && req.user.realName,
    sysId: req.user && req.user.sys && req.user.sys.id,
    sysName: req.user && req.user.sys && req.user.sys.name,
    deptId: req.user && req.user.department && req.user.department.id,
    deptName: req.user && req.user.department && req.user.department.name,
    ipAddr: req.headers['x-forwarded-for'],
    errMsg: errMsg,
    reqMethod: req.method.toUpperCase(),
    status: status,
    reqUrl: req.optAuth && req.optAuth.url || req.url,
    httpCode: JSON.parse(resBody).errors && JSON.parse(resBody).errors.length ? '400' : '200'
  };
  logStub.add(logData);
};
