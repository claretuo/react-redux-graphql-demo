import httpClient from '../utils/httpClient';

export const queryAuth = (sysId, userId) => httpClient.auth.get(`/system/${sysId}/users/${userId}/auths`);

export const querySysAuth = (sysId) => httpClient.auth.get(`/system/${sysId}/auths`);

export const getById = (id) => httpClient.auth.get(`/auths/${id}`);

export const getResourceById = (id) => httpClient.auth.get(`/resource/${id}`);

export const queryRoleAuth = (id) => httpClient.auth.get(`/roles/${id}/auths`);

export const queryUserResource = (sysId, id) => httpClient.auth.get(`/system/${sysId}/users/${id}/resource`);

export const createAuth = (auth, operator) => httpClient.auth.post('/auths',
  {
    params: {
      operator: operator
    },
    data: auth
  }
);

export const createResource = (resource, operator) => httpClient.auth.post('/resource',
  {
    params: {
      operator: operator
    },
    data: resource
  }
);

export const delAuth = (id) => httpClient.auth.del(`/auths/${id}`);

export const delResource = (id) => httpClient.auth.del(`/resource/${id}`);

export const updateRoleAuth = (id, checkedAuths, halfCheckedAuths) => httpClient.auth.put(`/roles/${id}/auths`,
  {
    data: {
      checkedAuths: checkedAuths,
      halfCheckedAuths: halfCheckedAuths
    }
  }
);

export const updateUserResource = (sysId, id, checkedResource, halfCheckedResource) => httpClient.auth.put(`system/${sysId}/users/${id}/resource`,
  {
    data: {
      checkedResource: checkedResource,
      halfCheckedResource: halfCheckedResource
    }
  }
);


export const batchUpdateAuth = (sysId, list, operator) => httpClient.auth.put(`/auths/bulk`,
  {
    params: {
      operator: operator
    },
    data: {
      data: list.map((item) => Object.assign(item, { sysId: sysId }))
    }
  }
);


export const batchUpdateResource = (sysId, list, operator) => httpClient.auth.put(`/resource/bulk`,
  {
    params: {
      operator: operator
    },
    data: {
      data: list.map((item) => Object.assign(item, { sysId: sysId }))
    }
  }
);
