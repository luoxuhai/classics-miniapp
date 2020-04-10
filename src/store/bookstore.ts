import { observable } from 'mobx';

const bookstoreStore = observable({
  data: {
    books: [],
    banners: [],
  },
  loading: true,

  saveData(data) {
    this.data = { ...this.data, ...data };
    this.loading = false;
  },
});

export default bookstoreStore;
