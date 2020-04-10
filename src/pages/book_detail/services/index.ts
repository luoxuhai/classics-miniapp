import request from '../../../utils/http';
import { FetchBookRecommendParams } from '../data';

export const fetchBookRecommend = ({ bookName, pageSize = 3 }: FetchBookRecommendParams) => {
  return request.get(`/v1/books/recommend`, { params: { bookName, pageSize } });
};
