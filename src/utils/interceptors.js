import Taro from '@tarojs/taro';
import { HTTP_STATUS } from './config';

let count = 0;

const customInterceptor = chain => {
  const requestParams = chain.requestParams;

  return chain.proceed(requestParams).then(res => {
    // 只要请求成功，不管返回什么状态码，都走这个回调
    if (
      res.statusCode === HTTP_STATUS.INVALID_TOKEN &&
      /jwt expired|invalid token|invalid signature/.test(res.data.error)
    ) {
      if (++count > 1) return Promise.reject(res.data);
      Taro.showModal({
        title: '提示',
        content: '登录状态过期,请重新登录',
        confirmText: '登录',
        confirmColor: '#f67280'
      })
        .then(({ confirm }) => {
          if (confirm)
            Taro.navigateTo({
              url: '/pages/user/login/index'
            });
        })
        .finally(() => {
          count = 0;
        });
      return Promise.reject(res.data);
    } else if (res.statusCode >= 200 && res.statusCode <= 204) {
      return res.data;
    } else if (res.statusCode >= 500) {
      Taro.setClipboardData({
        data: JSON.stringify(res.data)
      });
      Taro.showModal({
        title: '提示',
        content: '出错了,错误信息已复制',
        confirmText: '返回',
        confirmColor: '#f67280',
        showCancel: false
      }).then(() => {
        Taro.navigateBack({ delta: 1 });
      });
      return Promise.reject(res.data);
    } else {
      return Promise.reject(res.data);
    }
  });
};

// Taro 提供了两个内置拦截器
// logInterceptor - 用于打印请求的相关信息
// timeoutInterceptor - 在请求超时时抛出错误。
const interceptors =
  process.env.NODE_ENV === 'development' ? [customInterceptor, Taro.interceptors.logInterceptor] : [customInterceptor];

export default interceptors;
