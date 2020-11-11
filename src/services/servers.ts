/* eslint-disable import/prefer-default-export */
import request from '../utils/http';

export const queryBooklists = params => {
  return request.get('/v2/articles', { params });
};

export const queryBookrack = params => {
  return request.get('/v2/bookrack', { params });
};

export const setFreeAD = params => {
  return request.post('/v2/free_ad', { params });
};

export const queryFreeAD = () => {
  return request.get('/v2/free_ad');
};

export const queryCheck = () => {
  return request.get('/v2/app/check');
};

export const queryAdCheck = () => {
  return request.get('/v2/app/ad_check');
};
