import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';

import BookList from '@/components/BookList';
import LoginMask from '@/components/LoginMask';
import TipAddApp from '@/components/TipAddApp';
// import RateModal from '@/components/RateModal';
import { shareMixin } from '@/utils/utils';
import Search from './components/Search';
import Banner from './components/Banner';
import Classify from './components/Classify';
import { fetchBanner, fetchRecommend } from './services';
import { State, Props } from './data';
import './index.less';

@shareMixin
@inject('bookstoreStore')
@inject('userStore')
@observer
class BookstorePage extends Component<Props, State> {
  config: Config = {
    navigationBarTitleText: '古典文学名著阅读',
    enablePullDownRefresh: true
  };

  shareConfig: ShareConfig = {};

  interstitialAd: any;

  componentWillMount() {
    this.fetchData();
  }

  componentDidMount() {
    let freeAD = 0;
    try {
      freeAD = Taro.getStorageSync('freeAD');
    } catch (error) {}
    if (freeAD !== 1) {
      this.interstitialAd = Taro.createInterstitialAd({
        adUnitId: 'adunit-83c7d09dcd1bd671'
      });
      this.interstitialAd.onError(() => null);
      this.interstitialAd.show().catch(() => null);
    }
  }

  fetchData = (refresh = false) => {
    fetchRecommend({
      current: 1,
      pageSize: 20
    })
      .then(res => {
        Taro.stopPullDownRefresh();
        const { bookstoreStore } = this.props;
        if (!bookstoreStore.data.books.length || refresh)
          bookstoreStore.saveData({
            books: res.books
          });
      })
      .catch(() => {
        Taro.stopPullDownRefresh();
      });
    fetchBanner()
      .then(res => {
        Taro.stopPullDownRefresh();
        const { bookstoreStore } = this.props;
        if (!bookstoreStore.data.banners.length || refresh)
          bookstoreStore.saveData({
            banners: res.banners
          });
      })
      .catch(() => {
        Taro.stopPullDownRefresh();
      });
  };

  onPullDownRefresh() {
    this.fetchData(true);
  }

  render() {
    const {
      data: { books, banners },
      loading
    } = this.props.bookstoreStore;
    const { check } = this.props.userStore;

    return (
      <View className="bookstore">
        <Search />
        <Banner banners={banners} check={check} />
        <Text className="title">分类</Text>
        <Classify />
        <Text className="title">推荐</Text>
        <BookList books={books} loading={loading} />
        <LoginMask onClick={() => this.interstitialAd.destroy()} />
        {/* <RateModal /> */}
        <TipAddApp />
      </View>
    );
  }
}

export default BookstorePage;
