import httpClient from '../utils/httpClient';
import * as new4g from './new4g.service';
const grapeduReg = /@grapedu\.cn$/;

export const create = async (user) => {
  if (grapeduReg.test(user.innerEmail)) {
    const deptResult = await httpClient.auth.get(`/dept/${user.departmentId}`);
    try {
      await new4g.createUser({
        userid: user.innerEmail,
        name: user.realName,
        department: deptResult.data.new4gDeptId,
        mobile: user.phone,
        gender: user.sex
      });
    } catch (err) {
      console.log(err.message);
      throw new Error('new4g企业邮箱异常:' + err.message);
    }
  }
  try {
    const userResult = await httpClient.auth.post('/user',
      { data: user }
    );
    return userResult;
  } catch (err) {
    if (grapeduReg.test(user.innerEmail)) {
      new4g.delUser(user.innerEmail);
    }
    throw err;
  }
};

export const getById = (id) => httpClient.auth.get(`/user/${id}`);

export const login = (userNum, password) => httpClient.auth.post(`/user/login`,
  {
    data: {
      userNum: userNum,
      number: 'authSys',
      password: password
    }
  }
);

export const modifyPassword = (id, password, newPass, reNewPass) => httpClient.auth.put(`/user/${id}/password`,
  {
    data: {
      password: password,
      rePassword: newPass,
      newPassword: reNewPass
    }
  }
);

export const freeze = (id) => httpClient.auth.put(`/user/${id}/lock`);

export const cancel = async (id) => {
  const userResult = await httpClient.auth.get(`/user/${id}`);
  await httpClient.auth.put(`/user/${id}/cancel`);
  if (grapeduReg.test(userResult.data.innerEmail)) {
    new4g.delUser(userResult.data.innerEmail);
  }
};

export const resetPassword = (email) => httpClient.auth.put(`/user/password/reset`, {
  data: {
    innerEmail: email
  }
});

export const update = async (id, user) => {
  const updateResult = await httpClient.auth.put(`/user/${id}`, {
    data: user
  });
  if (grapeduReg.test(updateResult.data.innerEmail)) {
    const deptResult = await httpClient.auth.get(`/dept/${updateResult.data.departmentId}`);
    try {
      await new4g.updateUser(updateResult.data.innerEmail, {
        name: updateResult.data.realName,
        department: deptResult.data.new4gDeptId
      });
    } catch (err) {
      console.log(err.message);
      throw new Error('new4g企业邮箱异常:' + err.message);
    }
  }
  return updateResult;
};

export const active = (id) => httpClient.auth.put(`/user/${id}/unlock`);

export const search = (filters) => httpClient.auth.get('/user/search',
  {
    params: filters
  }
);
