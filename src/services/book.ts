import request from '../utils/http';

export const fetchBookDetail = (params: { id: string; select?: string }) => {
  return request.get(`/v2/books/${params.id}`, { params: { select: params.select } });
};

export const fetchBookContent = (params: { bookID: string }) => {
  return request.get(`/v2/book/content`, { params });
};

export const addBookrack = (params: { bookID: string }) => {
  return request.post('/v2/bookrack', { params });
};

export const delBookrack = (id: string) => {
  return request.delete(`/v2/bookrack/${id}`);
};

export const addBookmark = (params: { bookID: string; bookmarkIndex: number }) => {
  return request.post('/v2/bookmarks', { params });
};

export const delBookmark = (id, params: { bookID: string; bookmarkIndex: number }) => {
  return request.delete(`/v2/bookmarks/${id}`, { params });
};

export const fetchReadInfo = (params: { bookID: string; progress: any[] }) => {
  return request.put('/v2/read', { params });
};

export const putProgress = (params: { bookID: string; progress: any[] }) => {
  return request.put('/v2/read/progress', { params });
};
