import { request } from '@/libs/request'

export default {
  getEnv: data => {
    return request.get('/v1/app/env', data)
  },
  getTypes: data => {
    return request.get('/v1/app/types', data)
  },
  getHotSearch: () => {
    return request.get('/v1/push/hot')
  },
  about: data => {
    return request.get('/v1/push/about', data)
  },
}