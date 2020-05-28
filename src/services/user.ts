import request from '../utils/http';

export const login = params => {
  return request.post('/v2/users', { params });
};

export const updateUser = (id, params) => {
  return request.put(`/v2/users/${id}`, { params });
};

export const fetchUser = params => {
  return request.get(`/v2/users/${params.id}`, {});
};

export const putUser = ({ id, params }) => {
  return request.put(`/v2/users/${id}`, { params });
};

export const refreshToken = () => {
  return request.put('/v2/users/token');
};
