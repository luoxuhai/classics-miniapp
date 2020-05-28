import Taro, { Component } from '@tarojs/taro';
import { View, Text, Navigator } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';
import Skeleton from 'taro-skeleton';

import LoginMask from '@/components/LoginMask';
// import RateModal from '@/components/RateModal';
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
@inject('globalStore')
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
      bookName: '',
      description: '',
      isStar: false
    },
    recommend: [],
    loading: true
  };

  componentWillMount() {
    const { bookName, id } = this.$router.params;
    Taro.setNavigationBarTitle({ title: bookName || '' });
    Taro.showNavigationBarLoading();
    this.setState({
      book: { _id: id, bookName, ...this.state.book }
    });
    fetchBookDetail({ id: id || bookName })
      .then(res => {
        if (res.book) {
          this.setState({
            book: res.book,
            loading: false
          });
          this.shareConfig = {
            title: res.book.bookName,
            path: `/pages/book_detail/index?bookName=${res.book.bookName}&id=${res.book._id}`
          };
        }
        Taro.hideNavigationBarLoading();
      })
      .catch(() => {
        Taro.hideNavigationBarLoading();
      });
    fetchBookRecommend({ bookName }).then(({ books }) => {
      this.setState({
        recommend: books
      });
    });
    if (this.props.globalStore.freeAD !== 1) {
      const interstitialAd = Taro.createInterstitialAd({
        adUnitId: 'adunit-499948561354a7b4'
      });
      interstitialAd.show().catch(() => null);
    }
  }

  handleBookrackClick = () => {
    const { book } = this.state;
    if (!book._id) return;
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
          <Header name={book.bookName} author={book.author} score={book.bookScore} />
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
            <Collapse _id="collapse" content={book.description} />
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
        {/* <RateModal /> */}
      </View>
    );
  }
}
export default BookDetail;
