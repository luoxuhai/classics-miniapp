import Taro, { PureComponent, Config } from '@tarojs/taro';
import { View, Text, Navigator } from '@tarojs/components';

import { getDecimals } from '@/utils/utils';
import BookCover from '@/components/BookCover';
import LoadMore from '@/components/LoadMore';
import './index.less';
import Tag from '../Tag';

interface Props {
  books: any[];
  loading: boolean;
}

class BookList extends PureComponent<Props> {
  static defaultProps = {
    books: [],
    loading: true
  };

  config: Config = {
    usingComponents: {
      rate: '../rate'
    }
  };

  static options = {
    addGlobalClass: true
  };

  state = {};

  render() {
    const { books, loading } = this.props;

    return (
      <View className="book-list">
        {books.map(item => (
          <Navigator
            className="book-list__item"
            url={`/pages/book_detail/index?bookName=${item.bookName}&id=${item._id}&cover=${item.bookCover}`}
            key={item._id}
          >
            <BookCover class-name="item__cover" text={item.bookName} />
            <View className="item__desc">
              <Text className="item__name black">{item.bookName}</Text>
              <Text className="item__author grey">{item.author.name}</Text>
              <View className="item__rate grey">
                {item.bookScore + ' '}
                <rate
                  current={item.bookScore.toFixed(0)}
                  disabled
                  active="#ffca3e"
                  normal="#ececec"
                  score={getDecimals(item.bookScore)}
                />
              </View>
            </View>
            <View className="item__footer">
              <Tag title={item.bookType || '其他'} />
            </View>
          </Navigator>
        ))}
        <LoadMore loading={loading} empty={!loading && !books.length} />
      </View>
    );
  }
}
export default BookList;
