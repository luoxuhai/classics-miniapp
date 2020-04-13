import Taro from '@tarojs/taro';
import { observable } from 'mobx';
import { fetchUser, login, updateUser } from '../services/user';
import bookrackStore from './bookrack';
import globalStore from './global';

const userStore = observable({
  user: {},
  token: '',
  check: false,

  setUser(data) {
    this.user = { ...this.user, ...data };
    Taro.setStorage({
      key: 'user',
      data: this.user
    });
  },

  setToken(token) {
    global.$token = token;
    this.token = token;
    Taro.setStorage({
      key: 'token',
      data: token
    });
  },

  setCheck(check) {
    this.check = check;
    Taro.setStorage({
      key: 'check',
      data: check
    });
  },

  login({ code, client, data }) {
    login({ code, client })
      .then(res => {
        Taro.hideLoading();
        const { userID, token } = res;
        this.setToken(token);
        if (res.status === 'register') {
          delete data.code;
          data.client = client;
          updateUser(userID, data);
          this.setUser({ _id: userID, ...data });
        } else this.fetchUser(userID);
        if (Taro.getCurrentPages().length > 1)
          Taro.navigateBack({
            delta: 1
          });
        else Taro.switchTab({ url: '/pages/bookstore/index' });
      })
      .catch(() => {
        Taro.hideLoading();
        Taro.showModal({
          title: '提示',
          content: '登录失败!请重试',
          showCancel: false,
          confirmText: '确认'
        });
      })
  },

  logout() {
    Taro.clearStorage();
    this.user = {};
    this.token = '';
    global.$token = '';
    bookrackStore.setBookrack([]);
    globalStore.setFreeAD(0);
    Taro.reLaunch({
      url: '/pages/bookstore/index'
    });
  },

  fetchUser(id) {
    fetchUser({ id }).then(res => {
      this.setUser(res.userInfo);
    });
  }
});
export default userStore;
