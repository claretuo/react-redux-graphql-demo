import httpClient from '../utils/httpClient';
import * as new4g from './new4g.service';

export const create = async (dept) => {
  const new4gDeptId = await new4g.createDept(dept.name);
  try {
    const deptResult = await httpClient.auth.post('/dept', {
      data: {
        ...dept,
        new4gDeptId: new4gDeptId,
      }
    });
    return deptResult;
  } catch (err) {
    new4g.delDept(new4gDeptId);
    throw new Error(err.message);
  }
};

export const del = async (id) => {
  const deptResult = await httpClient.auth.get(`/dept/${id}`);
  const deleteResult = await httpClient.auth.del(`/dept/${id}`);
  new4g.delDept(deptResult.data.new4gDeptId);
  return deleteResult;
};

export const getById = (id) => httpClient.auth.get(`/dept/${id}`);

export const update = async (id, dept) => {
  const deptResult = await httpClient.auth.put(`/dept/${id}`, {
    data: dept
  });
  new4g.updateDept(deptResult.data.new4gDeptId, {
    name: deptResult.data.name
  });
  return deptResult;
};

export const query = () => httpClient.auth.get('/dept');
