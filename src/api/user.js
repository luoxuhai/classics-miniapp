import { request, upload } from '@/libs/request'

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
}