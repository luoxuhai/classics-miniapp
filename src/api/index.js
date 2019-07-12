import { request, upload } from './interceptors'

export default {
  login: data => {
    let url = '/v1/users'
    return request('POST', url, data)
  },
  updateUserInfo: (id, data) => {
    let url = `/v1/users/${id}`
    return request('PUT', url, data)
  },
  updateAvatar: (fileInfo, formData) => {
    let url = '/v1/upload'
    return upload(url, fileInfo, formData)
  },
  getUserInfo: (id) => {
    let url = `/v1/users/${id}`
    return request('GET', url)
  },
  getBook: data => {
    let url = '/v1/books'
    return request('GET', url, data)
  },
  getBanner: data => {
    let url = '/v1/push/banner'
    return request('GET', url, data)
  },
  getBookDetail: id => {
    let url = `/v1/books/${id}`
    return request('GET', url)
  },
  addBookRack: data => {
    let url = '/v1/bookrack'
    return request('POST', url, data)
  },
  deleteBookRack: id => {
    let url = `/v1/bookrack/${id}`
    return request('DELETE', url)
  },
  addBookMark: data => {
    let url = '/v1/bookmarks'
    return request('POST', url, data)
  },
  deleteBookMark: (id, data) => {
    let url = `/v1/bookmarks/${id}`
    return request('DELETE', url, data)
  },
  getBookRack: data => {
    let url = '/v1/bookrack'
    return request('GET', url, data)
  },
  getAphorism: data => {
    let url = '/v1/push/aphorism'
    return request('GET', url, data)
  },
  addComment: data => {
    let url = '/v1/comments'
    return request('POST', url, data)
  },
  deleteComment: (id, data) => {
    let url = `/v1/comments/${id}`
    return request('DELETE', url, data)
  },
  getComments: data => {
    let url = '/v1/comments'
    return request('GET', url, data)
  },
  getComment: id => {
    let url = `/v1/comments/${id}`
    return request('GET', url)
  },

  addBrowse: data => {
    let url = '/v1/browses'
    return request('POST', url, data)
  },
  getBrowse: data => {
    let url = '/v1/browses'
    return request('GET', url, data)
  },
  addRead: data => {
    let url = '/v1/read'
    return request('POST', url, data)
  },
  getRead: data => {
    let url = '/v1/read'
    return request('GET', url, data)
  },
  search: data => {
    let url = '/v1/book/search'
    return request('GET', url, data)
  },
  searchByIsbn: data => {
    let url = '/v1/book/search/isbn'
    return request('GET', url, data)
  },
  getUserComment: data => {
    let url = '/v1/comment/user'
    return request('GET', url, data)
  },
  getUserCommentDetail: (id, data) => {
    let url = `/v1/comment/user/${id}`
    return request('GET', url, data)
  },
  addLike: data => {
    let url = '/v1/comments/like'
    return request('POST', url, data)
  },
  deleteLike: id => {
    let url = `/v1/comments/like/${id}`
    return request('DELETE', url)
  },
  getBookContentInfo: data => {
    let url = '/v1/book/content'
    return request('get', url, data)
  },
  getEnv: data => {
    let url = '/v1/app/env'
    return request('get', url, data)
  },
  getTypes: data => {
    let url = '/v1/app/types'
    return request('get', url, data)
  },
  getAffiche: data => {
    let url = '/v1/push/affiche'
    return request('get', url, data)
  },
  about: data => {
    let url = '/v1/push/about'
    return request('get', url, data)
  },
  getBookContent: url => {
    return request('get', url)
  }
}
