import {request, upload} from '@/libs/request'

export default {
  login: data => {
    return request.post('/v1/users', data)
  },

  updateUserInfo: (id, data) => {
    return request.put(`/v1/users/${id}`, data)
  },
  updateAvatar: (fileInfo, formData) => {
    return upload('/v1/upload', fileInfo, formData)
  },
  getUserInfo: (id) => {
    return request.get(`/v1/users/${id}`)
  },
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
  getEnv: data => {
    return request.get('/v1/app/env', data)
  },
  getTypes: data => {
    return request.get('/v1/app/types', data)
  },
  getAffiche: id => {
    return request.get(`/v1/push/affiche/${id}`)
  },
  getHotSearch: () => {
    return request.get('/v1/push/hot')
  },
  about: data => {
    return request.get('/v1/push/about', data)
  },
  getBookContent: url => {
    return request.get(url)
  }
}
