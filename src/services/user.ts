import request from '../utils/http';

export const login = params => {
  return request.post('/v1/users', { params });
};

export const updateUser = (id, params) => {
  return request.put(`/v1/users/${id}`, { params });
};

export const fetchUser = params => {
  return request.get(`/v1/users/${params.id}`, {});
};

export const putUser = ({ id, params }) => {
  return request.put(`/v1/users/${id}`, { params });
};

export const refreshToken = () => {
  return request.put('/v1/users/token');
};
