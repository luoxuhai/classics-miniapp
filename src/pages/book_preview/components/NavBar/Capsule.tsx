import Taro, { PureComponent } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';

import { addBookrack, delBookmark, addBookmark } from '@/services/book';
import './Capsule.less';

@inject('bookPreviewStore')
@observer
class Capsule extends PureComponent {
  static options = {
    addGlobalClass: true
  };

  handleAddBookrackClick = () => {
    const { bookPreviewStore } = this.props;
    bookPreviewStore.setBook({ isStar: true });
    addBookrack({ bookID: bookPreviewStore.book._id });
    Taro.showToast({
      title: '已加入书架',
      icon: 'success'
    });
  };

  handleAddBookmarkClick = () => {
    const {
      bookPreviewStore: { currentChapter, book, bookmarks }
    } = this.props;
    const { bookPreviewStore } = this.props;

    if (!book.isStar) this.handleAddBookrackClick();
    if (bookmarks.includes(currentChapter)) {
      bookPreviewStore.setBookmarkIndex(bookmarks.filter(item => item !== currentChapter));
      delBookmark(book._id, { bookID: book._id, bookmarkIndex: currentChapter });
    } else {
      bookPreviewStore.setBookmarkIndex([currentChapter, ...bookmarks]);
      addBookmark({ bookID: book._id, bookmarkIndex: currentChapter });
      Taro.showToast({
        title: '已添加书签',
        icon: 'success'
      });
    }
  };

  render() {
    const {
      bookPreviewStore: { currentChapter, bookmarks }
    } = this.props;
    const {
      book: { isStar }
    } = this.props.bookPreviewStore;

    return (
      <View>
        <Button className="capsule" type="primary" disabled={isStar} onClick={this.handleAddBookrackClick}>
          {isStar ? '已在书架' : '加入书架'}
        </Button>
        <View className="capsule-bookmark" onClick={this.handleAddBookmarkClick}>
          <Text className="icon" style={{ color: bookmarks.includes(currentChapter) ? '#f67280' : undefined }}>
            &#xe61c;
          </Text>
        </View>
      </View>
    );
  }
}

export default Capsule;
