import store from '@/store'
import { BASE_URL } from '@/config'
import { request as _request, uploadFile } from '@/libs/httpUtil'

const unless = ['/login']

export const upload = (url, fileInfo, formData, header = {}) => {
  const headers = {
    'Cache-Control': 'public, max-age=31536000',
    Pragma: 'public, max-age=31536000',
    Authorization: `Bearer ${store.state.token}`,
    ...header
  }

  if (!/^http/.test(url)) url = BASE_URL + url

  return uploadFile(url, fileInfo, formData, headers)
}

export const request = (method, url, data = {}, header = {}) => {
  const headers = {
    'Cache-Control': 'public, max-age=31536000',
    Pragma: 'public, max-age=31536000',
    Authorization: `Bearer ${store.state.token}`,
    ...header
  }

  if (!/^http/.test(url)) url = BASE_URL + url

  return _request(method, url, data, headers)
}
