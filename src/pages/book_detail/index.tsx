import Taro, { Component } from '@tarojs/taro';
import { View, Text, Navigator } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';
import Skeleton from 'taro-skeleton';

import LoginMask from '@/components/LoginMask';
import Collapse from '@/components/Collapse';
import { fetchBookDetail, addBookrack } from '@/services/book';
import { shareMixin } from '@/utils/utils';
import Recommend from './components/Recommend';
import Header from './components/Header';
import Footer from './components/Footer';
import { fetchBookRecommend } from './services';
import { State, Props } from './data';
import './index.less';

@shareMixin
@inject('userStore')
@observer
class BookDetail extends Component<Props, State> {
  config = {
    navigationBarTitleText: ''
  };

  shareConfig: ShareConfig = {};

  state = {
    book: {
      _id: '',
      bookScore: 0,
      catalogueSum: 0,
      author: { name: '', intro: '' },
      bookCover: '',
      bookName: '',
      bookDesc: '',
      isStar: false
    },
    recommend: [],
    loading: true
  };

  componentWillMount() {
    const { bookName, id, cover } = this.$router.params;
    Taro.setNavigationBarTitle({ title: bookName || '' });
    this.setState({
      book: { _id: id, bookCover: cover, bookName, ...this.state.book }
    });
    Taro.showLoading({ title: '加载中', mask: true });
    fetchBookDetail({ id: id || bookName })
      .then(res => {
        if (res.book) {
          this.setState({
            book: res.book,
            loading: false
          });
          this.shareConfig = {
            title: res.book.bookName,
            path: `/pages/book_detail/index?bookName=${res.book.bookName}&id=${res.book._id}&cover=${res.book.bookCover}`
          };
        }
      })
      .finally(() => {
        Taro.hideLoading();
      });
    fetchBookRecommend({ bookName }).then(({ books }) => {
      this.setState({
        recommend: books
      });
    });
  }

  handleBookrackClick = () => {
    const { book } = this.state;
    Taro.showToast({
      title: '已加入书架',
      icon: 'success'
    });
    this.setState({
      book: { ...book, isStar: !book.isStar }
    });
    addBookrack({ bookID: book._id });
  };

  render() {
    const { book, recommend, loading } = this.state;
    const {
      userStore: { check }
    } = this.props;
    return (
      <View className="book-detail">
        <Skeleton title avatar avatarShape="square" row={2} loading={loading}>
          <Header name={book.bookName} cover={book.bookCover} author={book.author} score={book.bookScore} />
        </Skeleton>
        {!check && (
          <Navigator className="catalogue" url={`/pages/catalogue/index?id=${book._id}`}>
            目录<Text className="chapter-count grey">共{book.catalogueSum}章</Text>
            <Text className="icon">&#xe636;</Text>
          </Navigator>
        )}
        <Skeleton title row={3} loading={loading}>
          <Text className="title">简介</Text>
          <View id="collapse">
            <Collapse _id="collapse" content={book.bookDesc} />
          </View>
        </Skeleton>
        <Text className="title">作者</Text>
        <View id="collapse-1">
          <Collapse _id="collapse-1" content={book.author.intro} />
        </View>
        <Text className="title">推荐</Text>
        <Recommend books={recommend} />
        <Footer
          isStar={book.isStar}
          _id={book._id}
          bookName={book.bookName}
          check={check}
          onBookrackClick={this.handleBookrackClick}
        />
        <LoginMask />
      </View>
    );
  }
}
export default BookDetail;
