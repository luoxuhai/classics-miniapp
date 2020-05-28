import request from '../../../utils/http';
import { QueryBooksParams } from '../data';

export const queryBooks = (params: QueryBooksParams) => {
  return request.get('/v2/books', { params });
};
