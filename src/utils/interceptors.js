import Taro from '@tarojs/taro';
import { HTTP_STATUS } from './config';
import userStore from '../store/user';

let count = 0;

const customInterceptor = chain => {
  const requestParams = chain.requestParams;

  return chain.proceed(requestParams).then(res => {
    // 只要请求成功，不管返回什么状态码，都走这个回调
    if (res.statusCode === HTTP_STATUS.INVALID_TOKEN && res.data.error === 'invalid token') {
      if (++count > 1) return;
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
      return Promise.reject('需要鉴权');
    } else if (res.statusCode >= 200 && res.statusCode <= 204) {
      return res.data;
    } else {
      Taro.showModal({
        title: '提示',
        content: '小程序出错了!',
        confirmText: '重新启动',
        confirmColor: '#f67280',
        showCancel: false
      }).then(({ confirm }) => {
        if (confirm) userStore.logout();
      });
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
