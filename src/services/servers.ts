/* eslint-disable import/prefer-default-export */
import request from '../utils/http';

export const queryBooklists = params => {
  return request.get('/v1/articles', { params });
};

export const queryBookrack = params => {
  return request.get('/v1/bookrack', { params });
};

export const setFreeAD = params => {
  return request.post('/v1/free_ad', { params });
};

export const queryFreeAD = () => {
  return request.get('/v1/free_ad');
};
