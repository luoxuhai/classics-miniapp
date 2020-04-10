import Taro from '@tarojs/taro';
import interceptors from './interceptors';
import { BASE_URL } from './config';

interceptors.forEach(interceptorItem => Taro.addInterceptor(interceptorItem));

class HttpRequest {
  baseOptions(url, { params = {}, header = {} }, method = 'GET') {
    const option = {
      url: /^https:\/\//.test(url) ? url : BASE_URL + url,
      data: params,
      method: method,
      header: {
        'content-type': 'application/json',
        Authorization: `Bearer ${global.$token}`,
        ...header
      }
    };
    return Taro.request(option);
  }

  get(url, option = {}) {
    return this.baseOptions(url, option);
  }

  post(url, option = {}) {
    return this.baseOptions(url, option, 'POST');
  }

  put(url, option = {}) {
    return this.baseOptions(url, option, 'PUT');
  }

  delete(url, option = {}) {
    return this.baseOptions(url, option, 'DELETE');
  }
}

export default new HttpRequest();
