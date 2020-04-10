import request from '../utils/http';

export const fetchBookDetail = (params: { id: string; select?: string }) => {
  return request.get(`/v1/books/${params.id}`, { params: { select: params.select } });
};

export const fetchBookContent = (params: { bookID: string }) => {
  return request.get(`/v1/book/content`, { params });
};

export const addBookrack = (params: { bookID: string }) => {
  return request.post('/v1/bookrack', { params });
};

export const delBookrack = (id: string) => {
  return request.delete(`/v1/bookrack/${id}`);
};

export const addBookmark = (params: { bookID: string; bookMarkIndex: number }) => {
  return request.post('/v1/bookmarks', { params });
};

export const delBookmark = (id, params: { bookID: string; bookMarkIndex: number }) => {
  return request.delete(`/v1/bookmarks/${id}`, { params });
};

export const fetchReadInfo = (params: { bookID: string; progress: any[] }) => {
  return request.put('/v1/read', { params });
};

export const putProgress = (params: { bookID: string; progress: any[] }) => {
  return request.put('/v1/read/progress', { params });
};
