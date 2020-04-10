import Taro from '@tarojs/taro';
import { observable } from 'mobx';
import { queryBookrack } from '../services/servers';

const bookrackStore = observable({
  bookrack: [],
  loading: false,

  setBookrack(data) {
    this.bookrack = data;
  },

  fetchBookRack(pagination, reachBottom) {
    if (pagination.current > pagination.pageTotal) {
      this.loading = false;
      return;
    } else this.loading = true;

    queryBookrack({ current: pagination.current, pageSize: pagination.pageSize })
      .then(res => {
        const { books, current, pageTotal } = res;

        this.bookrack = reachBottom ? [...this.state.booklists, ...books] : books;
        pagination.current = current + 1;
        pagination.pageTotal = pageTotal || 1;
      })
      .catch(() => null)
      .finally(() => {
        Taro.stopPullDownRefresh();
        this.loading = false;
      });
  }
});
export default bookrackStore;
