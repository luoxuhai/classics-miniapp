import Taro, { PureComponent, Config } from '@tarojs/taro';
import { View, Text, Image, Navigator } from '@tarojs/components';

import { getDecimals } from '@/utils/utils';
import Empty from '@/components/Empty';
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
      rate: '../rate',
      loading: '../weui/loading/loading'
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
            <Image
              src={`https://classics.oss-cn-beijing.aliyuncs.com/${item.bookCover}`}
              className="item__cover"
              mode="aspectFill"
            ></Image>
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
        {!loading && !books.length ? <Empty /> : <loading show={loading} type="circle" tips="加载中..." />}
      </View>
    );
  }
}
export default BookList;
