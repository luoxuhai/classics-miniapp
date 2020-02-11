import Fly from "flyio/dist/npm/wx";
import store from "@/store";
import { BASE_URL } from '@/config'

const _request = new Fly();

const errCodeMessage = {
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。"
};
function errorHandle(statusCode) {
  if (statusCode === 401) {
    wx.showModal({
      title: '警告',
      content: '授权过期,请重新登录',
      showCancel: false,
      confirmText: '确认',
      success: res => {
        if (res.confirm) {
          wx.reLaunch({ url: '/pages/Login/index' })
        } else {
          wx.navigateBack({
            delta: 1
          });
        }
      }
    })
  } else
    if (process.env.NODE_ENV === 'development' || statusCode >= 500)
      wx.showModal({
        title: '错误',
        content: `${statusCode}: ${errCodeMessage[statusCode]}`,
        showCancel: false,
        confirmText: '返回',
        confirmColor: '#3CC51F',
        success: res => {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            });
          }
        }
      });
}
//实例级配置
_request.config.baseURL = BASE_URL;

//添加请求拦截器
_request.interceptors.request.use(request => {
  //给所有请求添加自定义header
  request.headers = {
    "Cache-Control": "public, max-age=31536000",
    Pragma: "public, max-age=31536000",
    Authorization: `Bearer ${store.state.token}`
  };

  //打印出请求体
  // console.log(request.body);
  //终止请求
  //var err=new Error("xxx")
  //err.request=request
  //return Promise.reject(new Error(""))

  //可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
  return request;
});

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
 _request.interceptors.response.use(
  response => {
    //只将请求结果的data字段返回
    return response.data;
  },
  err => {
    errorHandle(err.status);
  }
);

export const request = _request

function successHandle(resolve, reject, res) {
  if (res.statusCode >= 200 && res.statusCode < 400) resolve(res.data)
  else {
    reject(res);
    errorHandle(res.statusCode);
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

export const upload = (url, fileInfo, formData, headers = {}) => {
  const header = {
    'Cache-Control': 'public, max-age=31536000',
    Pragma: 'public, max-age=31536000',
    Authorization: `Bearer ${store.state.token}`,
    ...headers
  }

  if (!/^http/.test(url)) url = BASE_URL + url

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


