import request from '../../../utils/http';

export const queryBookrack = params => {
  return request.get('/v2/bookrack', { params });
};

export const delBookrack = id => {
  return request.delete(`/v2/bookrack/${id}`);
};
