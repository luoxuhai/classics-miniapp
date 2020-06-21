import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

import BookList from '@/components/BookList';
import { State } from './data';
import { queryBooks } from './services';

import './index.less';

class BookListViewPage extends Component<null, State> {
  config: Config = {
    navigationBarTitleText: '分类',
    enablePullDownRefresh: true
  };

  state = {
    books: [],
    loading: true,
    sort: 'createdAt',
    order: -1
  };

  pagination: Pagination = {
    current: 1,
    pageSize: 10,
    pageTotal: 1
  };

  bookType = '';

  componentWillMount() {
    const { bookType } = this.$router.params;
    if (!bookType) return;
    this.bookType = bookType === '唐传奇' ? '传奇小说' : bookType;
    Taro.setNavigationBarTitle({ title: bookType });
    this.handleLoadData(false);
  }

  onPullDownRefresh() {
    this.pagination.current = 1;
    this.handleLoadData(false);
  }

  onReachBottom() {
    this.handleLoadData(true);
  }

  handleLoadData = reachBottom => {
    if (this.pagination.current > this.pagination.pageTotal) {
      this.setState({
        loading: false
      });
      return;
    } else
      this.setState({
        loading: true
      });

    const handleFinally = () => {
      Taro.stopPullDownRefresh();
      this.setState({
        loading: false
      });
    };

    queryBooks({
      current: this.pagination.current,
      pageSize: this.pagination.pageSize,
      type: this.bookType,
      sortMethod: `${this.state.sort}_${this.state.order}`
    })
      .then(res => {
        handleFinally();
        const { books, current, pageTotal } = res;
        this.setState({
          books: reachBottom ? [...this.state.books, ...books] : books
        });
        this.pagination.current = current + 1;
        this.pagination.pageTotal = pageTotal || 1;
      })
      .catch(handleFinally);
  };

  handleActionSheetSort = () => {
    Taro.showActionSheet({
      itemList: ['上架时间', '评分', '书名']
    })
      .then(({ errMsg, tapIndex }) => {
        let sort = 'createdAt';
        if (errMsg === 'showActionSheet:ok')
          switch (tapIndex) {
            case 1:
              sort = 'bookScore';
              break;
            case 2:
              sort = 'bookName';
              break;
          }
        this.setState(
          {
            sort,
            books: []
          },
          () => {
            this.pagination.current = 1;
            this.handleLoadData(false);
          }
        );
      })
      .catch(() => null);
  };

  handleActionSheetOrder = () => {
    Taro.showActionSheet({
      itemList: ['倒序', '正序']
    })
      .then(({ errMsg, tapIndex }) => {
        if (errMsg === 'showActionSheet:ok')
          this.setState(
            {
              order: tapIndex === 0 ? -1 : 1,
              books: []
            },
            () => {
              this.pagination.current = 1;
              this.handleLoadData(false);
            }
          );
      })
      .catch(() => null);
  };

  render() {
    const { loading, books, sort, order } = this.state;

    return (
      <View className="book-list-view">
        <View className="book-list-view__header grey main-bg-color">
          <Text onClick={this.handleActionSheetSort}>
            {
              {
                createdAt: '上架时间',
                bookScore: '评分',
                bookName: '书名'
              }[sort]
            }
            <Text className="icon">&#xe703;</Text>
          </Text>
          <Text onClick={this.handleActionSheetOrder}>
            {order === -1 ? '倒序' : '正序'}
            <Text className="icon">&#xe703;</Text>
          </Text>
        </View>
        <BookList books={books} loading={loading} />
      </View>
    );
  }
}

export default BookListViewPage;
