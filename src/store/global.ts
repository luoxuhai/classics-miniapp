import Taro from '@tarojs/taro';
import { observable } from 'mobx';

import { queryFreeAD } from '@/services/servers';

const globalStore = observable({
  freeAD: 0,

  setFreeAD(value) {
    this.freeAD = value;
    Taro.setStorage({ key: 'freeAD', data: value });
  },

  queryFreeAD() {
    queryFreeAD().then(res => {
      this.setFreeAD(res.freeAD);
    });
  }
});
export default globalStore;
