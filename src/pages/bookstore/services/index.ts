import request from '../../../utils/http';
import { FetchRecommendParams, SearchParams } from '../data';

export const fetchRecommend = (params: FetchRecommendParams) => {
  return request.get('/v2/books/recommend', { params });
};

export const search = (params: SearchParams) => {
  return request.get('/v2/books/search', { params });
};

export const fetchBanner = () => {
  return request.get('/v2/push/banner');
};
