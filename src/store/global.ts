import { observable } from 'mobx';

const globalStore = observable({
  ad: 0,

  setAd(value) {
    this.ad = value;
  }
});
export default globalStore;
