import Taro from '@tarojs/taro';
import { observable } from 'mobx';

const globalStore = observable({
  freeAD: 0,

  setFreeAD(value) {
    this.freeAD = value;
    Taro.setStorage({ key: 'freeAD', data: value });
  }
});
export default globalStore;
