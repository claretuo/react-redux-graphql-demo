import httpClient from '../utils/httpClient';

export const query = (operator) => httpClient.auth.get('/system',
  {
    params: {
      operator: operator
    }
  }
);

export const getById = (id) => httpClient.auth.get(`/system/${id}`);

export const create = (sys) => httpClient.auth.post('/system',
  {data: sys}
);

export const update = (id, args) => httpClient.auth.put(`/system/${id}`,
  {
    data: args
  }
);

export const del = (id) => httpClient.auth.del(`/system/${id}`);
