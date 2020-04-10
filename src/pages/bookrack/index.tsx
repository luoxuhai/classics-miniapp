import Taro, { Component, Config } from '@tarojs/taro';
import { View, Button, Image, Text } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';

import Empty from '@/components/Empty';
import BookView from './components/BookView';
import { delBookrack } from './services';
import { State, Props } from './data';
import './index.less';

@inject('bookrackStore')
@inject('userStore')
@observer
class Bookrack extends Component<Props, State> {
  config: Config = {
    navigationBarTitleText: '书架',
    navigationStyle: 'custom',
    enablePullDownRefresh: true,
    navigationBarTextStyle: 'white',
    usingComponents: {
      loading: '../../components/weui/loading/loading'
    }
  };

  state = {
    isEdit: false
  };

  pagination: Pagination = {
    current: 1,
    pageSize: 10,
    pageTotal: 1
  };

  componentDidShow() {
    if (global.$token) {
      const { bookrackStore } = this.props;
      this.pagination.current = 1;
      bookrackStore.fetchBookRack(this.pagination, false);
    }
  }

  componentDidHide() {
    this.setState({
      isEdit: false
    });
  }

  onPullDownRefresh() {
    const { bookrackStore } = this.props;
    this.pagination.current = 1;
    bookrackStore.fetchBookRack(this.pagination, false);
  }

  onReachBottom() {
    const { bookrackStore } = this.props;
    bookrackStore.fetchBookRack(this.pagination, true);
  }

  handleEditClick = () => {
    this.setState({
      isEdit: !this.state.isEdit
    });
  };

  handleClick = (id, e) => {
    if (e.target.dataset.id === 'delete') this.handleDelete(id);
    else this.handleGotoRead(id);
  };

  handleDelete = id => {
    const { bookrackStore } = this.props;
    bookrackStore.setBookrack(bookrackStore.bookrack.filter(item => item.book._id !== id));
    delBookrack(id);
    Taro.showToast({
      title: '删除成功',
      icon: 'success',
      duration: 2000
    });
  };

  handleGotoRead = id => {
    if (!id) return;
    const { userStore, bookrackStore } = this.props;
    if (userStore.check)
      Taro.showModal({
        title: '提示',
        content: '本小程序不支持阅读,请打开"微信读书"搜索本书名阅读'
      });
    else {
      const book = bookrackStore.bookrack.find(item => item.book._id === id).book;
      Taro.navigateTo({
        url: `/pages/book_preview/index?bookName=${book.bookName}&id=${id}`
      });
    }
  };

  handleActionSheet = id => {
    Taro.vibrateShort();
    Taro.showActionSheet({
      itemList: ['打开', '删除']
    })
      .then(({ errMsg, tapIndex }) => {
        if (errMsg === 'showActionSheet:ok')
          switch (tapIndex) {
            case 0:
              this.handleGotoRead(id);
              break;
            case 1:
              this.handleDelete(id);
          }
      })
      .catch(() => null);
  };

  render() {
    const {
      bookrackStore: { bookrack, loading }
    } = this.props;
    const { isEdit } = this.state;

    return (
      <View className="bookrack">
        <View className="bookrack__header">
          <Image
            className="header__cover"
            src={`https://classics.oss-cn-beijing.aliyuncs.com/${bookrack[0].book.bookCover}`}
            mode="aspectFill"
            onClick={() => this.handleGotoRead(bookrack[0] && bookrack[0].book._id)}
          />
          {bookrack.length ? (
            <View className="header__detail">
              <Text className="detail__bookName">{bookrack[0].book.bookName}</Text>
              <Text className="header__author">作者: {bookrack[0].book.author.name}</Text>
              <Text className="header__progress">读至: {bookrack[0].progress}</Text>
            </View>
          ) : null}
        </View>
        <View className="manage">
          <Text className="manage__text">共{bookrack.length}本</Text>
          <Button
            className="manage__button"
            onClick={this.handleEditClick}
            disabled={!bookrack.length}
            size="mini"
            type="primary"
          >
            {isEdit ? '完成' : '管理'}
          </Button>
        </View>
        <BookView book={bookrack} isEdit={isEdit} onClick={this.handleClick} onLongPress={this.handleActionSheet} />
        {!loading && !bookrack.length ? <Empty /> : <loading show={loading} type="circle" tips="加载中..." />}
      </View>
    );
  }
}

export default Bookrack;
