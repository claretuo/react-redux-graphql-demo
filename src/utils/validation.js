import { trim } from 'lodash';
// const isEmpty = value => value === undefined || value === null || value === '';
// const join = (rules) => (value, data) => rules.map(rule => rule(value, data)).filter(error => !!error)[0 /* first error */ ];
const phoneReg = /^0?1([3|5|7|8][0-9]\d{8}$)|(47\d{8}$)/;
export function maxRealLen(string, len) {
  const str = trim(string);
  if (!str) return true;
  return str && str.replace(/[^\x00-\xff]/g, '__').length <= len;
}
export function minRealLen(string, len) {
  const str = trim(string);
  if (!str) return true;
  return str && str.replace(/[^\x00-\xff]/g, '__').length >= len;
}
export function isPhone(string) {
  const str = trim(string);
  if (!str) return true;
  return str && phoneReg.test(str);
}
export function onlyCharAndNum(string) {
  const str = trim(string);
  const reg = /^[0-9a-zA-Z]*$/g;
  return str && reg.test(str);
}
