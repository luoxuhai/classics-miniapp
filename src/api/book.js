import { request } from '@/lib/request'

export default {
  getRecommend: data => {
    return request.get('/v1/books/recommend', data)
  },
  getNewbook: data => {
    return request.get('/v1/books/newbook', data)
  },
  getRanking: data => {
    return request.get('/v1/books/ranking', data)
  },
  getBook: data => {
    return request.get('/v1/books', data)
  },
  getBanner: data => {
    return request.get('/v1/push/banner', data)
  },
  getBookDetail: id => {
    return request.get(`/v1/books/${id}`)
  },
  addBookRack: data => {
    return request.post('/v1/bookrack', data)
  },
  deleteBookRack: id => {
    return request.delete(`/v1/bookrack/${id}`)
  },
  addBookMark: data => {
    return request.post('/v1/bookmarks', data)
  },
  deleteBookMark: (id, data) => {
    return request.delete( `/v1/bookmarks/${id}`, data)
  },
  getBookRack: data => {
    return request.get( '/v1/bookrack', data)
  },
  getAphorism: data => {
    return request.get('/v1/push/aphorism', data)
  },
  addComment: data => {
    return request.post('/v1/comments', data)
  },
  deleteComment: (id, data) => {
    return request.delete(`/v1/comments/${id}`, data)
  },
  getComments: data => {
    return request.get('/v1/comments', data)
  },
  getComment: id => {
    return request.get(`/v1/comments/${id}`)
  },

  addBrowse: data => {
    return request.post('/v1/browses', data)
  },
  getBrowse: data => {
    return request.get('/v1/browses', data)
  },
  addRead: data => {
    return request.post('/v1/read', data)
  },
  getRead: data => {
    return request.get('/v1/read', data)
  },
  putReadProgress: data => {
    return request.put('/v1/read/progress', data)
  },
  search: data => {
    return request.get('/v1/books/search', data)
  },
  searchByIsbn: data => {
    return request.get('/v1/books/search/isbn', data)
  },
  getUserComment: data => {
    return request.get('/v1/comment/user', data)
  },
  getUserCommentDetail: (id, data) => {
    return request.get(`/v1/comment/user/${id}`, data)
  },
  addLike: data => {
    return request.post('/v1/comments/like', data)
  },
  deleteLike: id => {
    return request.delete(`/v1/comments/like/${id}`)
  },
  getBookContentInfo: data => {
    return request.get('/v1/book/content', data)
  },

  getOSSContent: url => {
    return request.get(url)
  }
}
