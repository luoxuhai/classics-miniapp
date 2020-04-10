import request from '../../../utils/http';

export const queryBookrack = params => {
  return request.get('/v1/bookrack', { params });
};

export const delBookrack = id => {
  return request.delete(`/v1/bookrack/${id}`);
};
