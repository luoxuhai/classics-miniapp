import Taro, { PureComponent } from '@tarojs/taro';
import { View, SwiperItem, Swiper, ScrollView } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';

import './index.less';
import Chapter from './components/Chapter';
import CatalogueHeader from './components/CatalogueHeader';
import { fetchBookDetail } from '../../services/book';
import { Props } from './data';

const tabBar = ['目录', '书签'];

@inject('bookPreviewStore')
@observer
class Catalogue extends PureComponent<Props> {
  config = {
    navigationBarTitleText: '目录',
    disableScroll: true
  };

  state = {
    ascend: true,
    selectIndex: 0,
    simple: true
  };

  componentWillMount() {
    const { id } = this.$router.params;
    if (id) {
      Taro.showNavigationBarLoading();
      fetchBookDetail({ id, select: 'catalogue,bookName' })
        .then(({ book }) => {
          if (book.catalogue.length) {
            const { bookPreviewStore } = this.props;
            bookPreviewStore.setChapters(book.catalogue);
            bookPreviewStore.setBook({ _id: id, bookName: book.bookName });
          }
          Taro.hideNavigationBarLoading();
        })
        .catch(() => {
          Taro.hideNavigationBarLoading();
        });
    } else {
      this.setState({
        simple: false
      });
    }
  }

  componentWillUnmount() {
    if (Taro.getCurrentPages()[Taro.getCurrentPages().length - 2].route === 'pages/book_detail/index') {
      const { bookPreviewStore } = this.props;
      bookPreviewStore.setChapters([]);
      bookPreviewStore.setBook({ _id: '', bookName: '' });
    }
  }

  handleOrderClick = () => {
    this.setState({
      ascend: !this.state.ascend
    });
    const { bookPreviewStore } = this.props;
    bookPreviewStore.setChapters(bookPreviewStore.chapters.reverse());
  };

  handleSelectTab = e => {
    const id = e.target.dataset.id;
    if (!id) return;

    let selectIndex = 0;
    if (id === 'bookmark') selectIndex = 1;
    this.setState({
      selectIndex
    });
  };

  handleSwiperChange = e => {
    this.setState({
      selectIndex: e.detail.current
    });
  };

  handleChapterClick = index => {
    const { bookPreviewStore } = this.props;
    bookPreviewStore.setCurrentChapter(index);
  };

  render() {
    const { selectIndex, simple } = this.state;
    const {
      bookPreviewStore: { bookmarks, chapters, currentChapter, book }
    } = this.props;

    return (
      <View className="catalogue" style={{ paddingTop: simple ? 0 : undefined }}>
        {simple ? (
          <View>
            <CatalogueHeader chapters={chapters} />
            <ScrollView scroll-y className="scorll-view" style="height: calc(100vh - 50px)">
              <Chapter list={chapters} book={book} selectIndex={0} onChapterClick={this.handleChapterClick} />
            </ScrollView>
          </View>
        ) : (
          <View>
            <View className="tab-bar" onClick={this.handleSelectTab}>
              {tabBar.map((item, index) => (
                <View
                  data-id={index === 0 ? 'chapter' : 'bookmark'}
                  className={`tab-bar__item ${selectIndex === index ? 'tab-bar__item-active' : undefined}`}
                  key={index}
                >
                  {item}
                </View>
              ))}
            </View>
            <Swiper
              className="swiper"
              onChange={this.handleSwiperChange}
              skipHiddenItemLayout
              current={selectIndex}
              duration={350}
            >
              <SwiperItem className="swiper-item">
                <CatalogueHeader chapters={chapters} />
                <ScrollView
                  scrollY
                  className="scorll-view"
                  scrollTop={currentChapter * 100 + 'rpx'}
                  style="height: calc(100vh - 100rpx - 50px)"
                >
                  <Chapter
                    simple={false}
                    list={chapters}
                    book={book}
                    currentChapter={currentChapter}
                    selectIndex={selectIndex}
                    onChapterClick={this.handleChapterClick}
                  />
                </ScrollView>
              </SwiperItem>
              <SwiperItem className="swiper-item">
                <View className="catalogue__header">共{bookmarks.length}个书签</View>
                <ScrollView scroll-y className="scorll-view" style="height: calc(100vh - 100rpx - 50px)">
                  <Chapter
                    simple={false}
                    list={bookmarks.map(item => ({ title: chapters[item], bookmarkIndex: item }))}
                    book={book}
                    selectIndex={selectIndex}
                    currentChapter={currentChapter}
                    onChapterClick={this.handleChapterClick}
                  />
                </ScrollView>
              </SwiperItem>
            </Swiper>
          </View>
        )}
      </View>
    );
  }
}
export default Catalogue;
