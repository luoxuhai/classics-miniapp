import request from '../../../utils/http';

export const queryRichContent = (params: { url: string }) => {
  return request.get(params.url);
};
