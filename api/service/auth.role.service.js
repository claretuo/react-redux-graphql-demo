import httpClient from '../utils/httpClient';

export const create = (role, operator) => {
  return httpClient.auth.post('/roles',
    {
      params: {
        operator: operator
      },
      data: role
    }
  );
};

export const del = (id) => httpClient.auth.del(`/roles/${id}`);

export const getBySystemWithUsers = (sysId, userId) => httpClient.auth.get(`/system/${sysId}/users/${userId}/roles/users`);

export const getByUser = (sysId, userId) => httpClient.auth.get(`/system/${sysId}/users/${userId}/roles`);

// TODO  编辑角色名称
export const update = (id, name) => httpClient.auth.put(`/roles/${id}`,
  {
    data: {
      name: name
    }
  }
);

export const updateUserRoles = (sysId, userId, list) => httpClient.auth.put(`system/${sysId}/users/${userId}/roles`,
  {
    data: {
      roles: list
    }
  }
);
