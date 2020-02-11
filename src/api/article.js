import { request } from '@/lib/request'

export default {
  getArticle: id => {
    return request.get(`/v1/articles/${id}`)
  },
  getArticles: data => {
    return request.get('/v1/articles', data)
  },
  getAffiche: id => {
    return request.get(`/v1/push/affiche/${id}`)
  },
}