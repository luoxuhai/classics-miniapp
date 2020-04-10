
/* eslint-disable import/prefer-default-export */
import request from '../utils/http';

export const queryBooklists = params => {
  return request.get('/v1/articles', { params });
};

export const queryBookrack = params => {
  return request.get('/v1/bookrack', { params });
};
