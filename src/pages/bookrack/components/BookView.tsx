import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Label } from '@tarojs/components';

import { BookViewProps } from '../data';
import './BookView.less';

export default class BookView extends Component<BookViewProps> {
  static defaultProps = {
    book: [],
    isEdit: false
  };

  render() {
    const { book, isEdit, onClick, onLongPress } = this.props;
    return (
      <View className="book-view">
        {book.map(item => (
          <View
            className="book-view__item"
            onClick={e => onClick(item.book._id, e)}
            onLongPress={() => onLongPress(item.book._id)}
            hoverClass="none"
            hoverStopPropagation
            key={item.book._id}
          >
            <Image
              className="book-view__cover"
              src={`https://classics.oss-cn-beijing.aliyuncs.com/${item.book.bookCover}`}
              mode="aspectFill"
            >
              <View className={isEdit ? 'book-view__mask-active' : 'book-view__mask'} data-id="delete">
                <Label className="book-view__icon" data-id="delete">
                  &#xe64f;
                </Label>
              </View>
            </Image>
            <Text className="book-view__name">{item.book.bookName}</Text>
          </View>
        ))}
      </View>
    );
  }
}
