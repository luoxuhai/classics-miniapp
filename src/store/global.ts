import Taro from '@tarojs/taro';
import { observable } from 'mobx';

import { queryFreeAD, queryAdCheck } from '@/services/servers';

const globalStore = observable({
  freeAD: 0,
  adCheck: false,

  setFreeAD(value) {
    this.freeAD = value;
    Taro.setStorage({ key: 'freeAD', data: value });
  },

  queryFreeAD() {
    queryFreeAD().then(res => {
      this.setFreeAD(res.freeAD);
    });
  },

  setAdCheck() {
    queryAdCheck().then(({ adCheck }: any) => {
      this.adCheck = adCheck;
    });
  }
});
export default globalStore;
