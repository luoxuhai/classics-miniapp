import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';

import BookList from '@/components/BookList';
import LoginMask from '@/components/LoginMask';
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
    navigationBarTitleText: '书城',
    navigationStyle: 'custom',
    enablePullDownRefresh: true,
    usingComponents: {
      ['navigation-bar']: '../../components/weui/navigation-bar/navigation-bar'
    }
  };

  shareConfig: ShareConfig = {};

  componentDidMount() {
    let freeAD = 0;
    try {
      freeAD = Taro.getStorageSync('freeAD');
    } catch (error) {}
    // if (!books.length) this.fetchData();
    if (freeAD !== 1) {
      const interstitialAd = Taro.createInterstitialAd({
        adUnitId: 'adunit-83c7d09dcd1bd671'
      });
      interstitialAd.onError(() => null);
      interstitialAd.load().catch(() => null);
      setTimeout(() => {
        interstitialAd.show().catch(() => null);
      }, 500);
    }
  }

  fetchData = () => {
    fetchRecommend({
      current: 1,
      pageSize: 20
    })
      .then(res => {
        const { bookstoreStore } = this.props;
        bookstoreStore.saveData({
          books: res.books
        });
      })
      .finally(() => {
        Taro.stopPullDownRefresh();
      });
    fetchBanner()
      .then(res => {
        const { bookstoreStore } = this.props;
        bookstoreStore.saveData({
          banners: res.banners
        });
      })
      .finally(() => {
        Taro.stopPullDownRefresh();
      });
  };

  onPullDownRefresh() {
    this.fetchData();
  }

  render() {
    const {
      data: { books, banners },
      loading
    } = this.props.bookstoreStore;
    const { check } = this.props.userStore;

    return (
      <View className="bookstore">
        <navigation-bar id="nav" title="古典文学名著阅读" back={false} background="#fff" show />
        <Search />
        <Banner banners={banners} check={check} />
        <Text className="title">分类</Text>
        <Classify />
        <Text className="title">推荐</Text>
        <BookList books={books} loading={loading} />
        <LoginMask />
      </View>
    );
  }
}

export default BookstorePage;
