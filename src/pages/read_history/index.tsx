import Taro, { Component, Config } from '@tarojs/taro';
import { View} from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';

import BookList from '@/components/BookList';
import { State, Props } from './data';
import { queryReadHistory } from './services';
import './index.less';

@inject('userStore')
@observer
class ReadHistoryPage extends Component<Props, State> {
  config: Config = {
    navigationBarTitleText: '阅读历史',
    enablePullDownRefresh: true
  };

  state: State = {
    books: [],
    loading: true
  };

  pagination: Pagination = {
    current: 1,
    pageSize: 6,
    pageTotal: 1
  };

  componentWillMount() {
    this.handleLoadData(false);
  }

  onPullDownRefresh() {
    this.pagination.current = 1;
    this.handleLoadData(false);
  }

  onReachBottom() {
    this.handleLoadData(true);
  }

  handleLoadData(reachBottom) {
    if (this.pagination.current > this.pagination.pageTotal) {
      this.setState({
        loading: false
      });
      return;
    } else
      this.setState({
        loading: true
      });

    queryReadHistory({
      current: this.pagination.current,
      pageSize: this.pagination.pageSize
    })
      .then(res => {
        const { books, current, pageTotal } = res;

        this.setState({
          books: reachBottom ? [...this.state.books, ...books] : books
        });
        this.pagination.current = current + 1;
        this.pagination.pageTotal = pageTotal || 1;
      })
      .catch(() => null)
      .finally(() => {
        Taro.stopPullDownRefresh();
        this.setState({
          loading: false
        });
      });
  }

  render() {
    const { books, loading } = this.state;

    return (
      <View className="read-history">
        <BookList books={books} loading={loading} />
      </View>
    );
  }
}

export default ReadHistoryPage;
