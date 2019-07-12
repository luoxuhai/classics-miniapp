import store from '@/store'
import { BASE_URL } from '@/config'
import { showToast } from '@/libs/utils'

function successHandle(resolve, reject, res) {
  if (res.statusCode >= 200 && res.statusCode < 400) resolve(res.data)
  else {
    reject(res.data)
    if (res.statusCode === 401)
      wx.showModal({
        title: '警告',
        content: '授权过期,请重新登录',
        showCancel: false,
        confirmText: '确认',
        success: res => {
          0
          if (res.confirm) {
            wx.reLaunch({ url: '/pages/Login/main' })
          }
        }
      })
    else
      showToast({
        title: '网络连接错误',
        type: 'error'
      })
  }
}

function failHandle(reject, err) {
  wx.showModal({
    title: '未知错误',
    content: JSON.stringify(err),
    showCancel: false,
    confirmText: '确认'
  })
  reject(err)
}

export const uploadFile = (url, fileInfo, formData, header) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      header,
      url,
      filePath: fileInfo.filePath,
      name: fileInfo.name || 'file',
      formData,
      success: successHandle.bind(this, resolve, reject),
      fail: failHandle.bind(this, reject)
    })
  })
}

export const request = (method, url, data, headers) => {
  return new Promise((resolve, reject) => {
    wx.request({
      method,
      url,
      data,
      header: headers,
      success: successHandle.bind(this, resolve, reject),
      fail: failHandle.bind(this, reject)
    })
  })
}
