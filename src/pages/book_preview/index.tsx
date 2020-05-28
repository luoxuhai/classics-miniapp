import Taro, { Component } from '@tarojs/taro';
import { View, Button } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';

import LoginMask from '@/components/LoginMask';
import { fetchBookContent, putProgress } from '@/services/book';
import { shareMixin } from '@/utils/utils';
import { queryRichContent } from '../rich_content/services';
import NavBar from './components/NavBar';
import './index.less';
import { Props } from './data';

const tagStyle = {
  h2: 'font-size: 1.2em;line-height: 1.2em;font-weight: 700;margin-bottom: 1.5em;color: rgb(107, 47, 17)',
  p: 'margin: 1em 0;'
};

let scrollTop = 0;
@shareMixin
@inject('bookPreviewStore')
@inject('globalStore')
@observer
class BookPreview extends Component<Props> {
  config = {
    navigationBarTitleText: '',
    usingComponents: {
      parser: '../../components/parser/parser'
    }
  };

  state = {};

  shareConfig: ShareConfig = {};

  parser: any;
  videoAd: any;
  windowWidth = global.systemInfo.windowWidth;
  currentChapter = -1;

  componentDidMount() {
    const { id, bookName, index } = this.$router.params;
    Taro.setNavigationBarTitle({ title: bookName });
    Taro.showLoading({ title: '加载中', mask: true });
    // Taro.showLoading({ title: '加载中' });
    const {
      bookPreviewStore: { theme }
    } = this.props;
    Taro.setNavigationBarColor({
      frontColor: theme.name === '暗黑' ? '#ffffff' : '#000000',
      backgroundColor: theme.backgroundColor
    });
    this.shareConfig = {
      title: bookName,
      path: `/pages/book_detail/index?bookName=${bookName}&id=${id}`
    };
    fetchBookContent({ bookID: id }).then(res => {
      const { bookPreviewStore } = this.props;
      let _index = Number(index);
      // 选择章节进入
      if (_index >= 0) {
        res.progress = [0, 0, 0];
        //点击阅读进入记住上次位置
      } else if (res.isStar) {
        _index = res.progress[0];
        // 未加入书架而点击阅读进入
      } else {
        _index = 0;
      }
      bookPreviewStore.setProgress(res.progress);
      bookPreviewStore.setBookmarkIndex(res.bookmarkIndex);
      bookPreviewStore.setChapters(res.catalogue);
      bookPreviewStore.setBook({ _id: id, bookName, isStar: res.isStar, content: res.content });
      bookPreviewStore.setCurrentChapter(_index);
    });
  }

  componentWillUnmount() {
    const { bookPreviewStore } = this.props;
    const { book, currentChapter } = bookPreviewStore;
    if (book.isStar) putProgress({ bookID: book._id, progress: [currentChapter, scrollTop, this.windowWidth] });
    scrollTop = 0;
    bookPreviewStore.setCurrentChapter(null);
    if (Taro.getCurrentPages()[Taro.getCurrentPages().length - 2].route !== 'pages/catalogue/index') {
      bookPreviewStore.setChapters([]);
      bookPreviewStore.setBook({ _id: '', bookName: '', isStar: false, content: '' });
    }
    bookPreviewStore.setProgress([]);
    bookPreviewStore.setBookmarkIndex([]);
    bookPreviewStore.setAnimation(null);
    this.currentChapter = -1;
  }

  componentWillUpdate() {
    const {
      bookPreviewStore: { currentChapter, chapters, book }
    } = this.props;
    if (this.currentChapter !== currentChapter && currentChapter !== null) {
      Taro.showLoading({ title: '加载中', mask: true });
      this.currentChapter = currentChapter;
      Taro.setNavigationBarTitle({ title: chapters[Number(currentChapter)] });
      queryRichContent({
        url: `${book.content}/${currentChapter}.html`
      })
        .then(content => {
          this.parser.setContent(content);
          console.log('setContent');
        })
        .catch(() => {
          try {
            Taro.hideLoading();
          } catch (error) {}
        });
    }
  }

  onParserLoad = () => {
    const { bookPreviewStore } = this.props;
    const { progress } = bookPreviewStore;
    try {
      Taro.hideLoading();
    } catch (error) {}
    Taro.pageScrollTo({
      scrollTop: progress[1] * (progress[2] / global.systemInfo.windowWidth),
      duration: 0
    });
    bookPreviewStore.setProgress([0, 0, 0]);
    if (!this.videoAd) this.loadAd();
  };

  loadAd = () => {
    const {
      globalStore: { freeAD }
    } = this.props;
    if (process.env.NODE_ENV === 'development' || freeAD) return;
    this.videoAd = Taro.createRewardedVideoAd({
      adUnitId: 'adunit-7f9e5a42537d055c'
    });
    // 激励广告调用失败后调用插屏广告
    this.videoAd.onError(() => {
      const interstitialAd = Taro.createInterstitialAd({
        adUnitId: 'adunit-088b6992cc976c00'
      });
      interstitialAd.show().catch(() => null);
    });

    this.videoAd
      .load()
      .then(() => {
        this.videoAd.show();
        this.videoAd.onClose(({ isEnded }) => {
          if (!isEnded) {
            Taro.navigateBack({
              delta: 1
            });
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  onPageScroll(e) {
    scrollTop = e.scrollTop;
  }

  handleContentClick = e => {
    if (!e || (e.detail.x > this.windowWidth / 5 && e.detail.x < this.windowWidth * (4 / 5))) {
      const { bookPreviewStore } = this.props;
      const isStart = !bookPreviewStore.animation;
      const animation = Taro.createAnimation({
        transformOrigin: '50% 50%',
        duration: 200,
        timingFunction: isStart ? 'ease-out' : 'ease-in'
      })
        .translateY(isStart ? (bookPreviewStore.currentPane !== 'default' ? -106 : -230) : 0)
        .opacity(isStart ? 1 : 0.5)
        .step()
        .export();
      if (!isStart) {
        setTimeout(() => {
          bookPreviewStore.setCurrentPane('default');
          bookPreviewStore.setAnimation(undefined);
        }, 200);
      }
      bookPreviewStore.setAnimation(animation);
    } else this.handleToggleChapterClick(e.detail.x < this.windowWidth / 5 ? false : true);
  };

  handleToggleChapterClick = (next = true) => {
    const { bookPreviewStore } = this.props;
    if (
      (next && bookPreviewStore.currentChapter !== bookPreviewStore.chapters.length - 1) ||
      (!next && bookPreviewStore.currentChapter !== 0)
    ) {
      bookPreviewStore.setCurrentChapter(
        next ? bookPreviewStore.currentChapter + 1 : bookPreviewStore.currentChapter - 1
      );
    }
  };

  handleFooterClick = ({ target }) => {
    const type = target.dataset.type;
    if (!type) return;
    switch (type) {
      case 'previous':
        this.handleToggleChapterClick(false);
        break;
      case 'next':
        this.handleToggleChapterClick();
        break;
      case 'menu':
        this.handleContentClick(null);
    }
  };

  render() {
    const {
      bookPreviewStore: { font, theme, chapters, currentChapter }
    } = this.props;
    return (
      <View className="book-preview" style={{ backgroundColor: theme.backgroundColor, color: theme.color }}>
        <View className="parser">
          <View className="content" onClick={this.handleContentClick} style={{ fontSize: font.fontSize + 'px' }}>
            <parser ref={e => (this.parser = e)} tag-style={tagStyle} selectable onLoad={this.onParserLoad} />
          </View>
          <View className="footer" onClick={this.handleFooterClick}>
            <Button className="footer__previous" disabled={currentChapter === 0} data-type="previous">
              上一章
            </Button>
            <Button className="footer__menu" data-type="menu">
              菜单
            </Button>
            <Button className="footer__next" disabled={currentChapter === chapters.length - 1} data-type="next">
              下一章
            </Button>
          </View>
          <NavBar onToggleChapterClick={this.handleToggleChapterClick} />
        </View>
        {chapters.length === 0 && <LoginMask login={false} />}
      </View>
    );
  }
}
export default BookPreview;
