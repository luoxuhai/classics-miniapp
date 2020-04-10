import request from '../../../utils/http';
import { QueryReadHistoryParams } from '../data';

export const queryReadHistory = (params: QueryReadHistoryParams) => {
  return request.get('/v1/browses', { params });
};
