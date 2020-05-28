import Taro from '@tarojs/taro';
import { View, Text, Navigator } from '@tarojs/components';

import BookCover from '@/components/BookCover';
import { Recommend } from '../../data';
import './index.less';

type Props = {
  books: Recommend[];
};

function Recommend({ books = [] }: Props) {
  return (
    <View className="recommend">
      {books.map(item => (
        <Navigator
          className="recommend__item"
          url={`/pages/book_detail/index?bookName=${item.bookName}&id=${item._id}`}
          key={item._id}
          hoverClass="none"
        >
          <BookCover class-name="book__cover" text={item.bookName} width="190rpx" />
          <Text className="book__name">{item.bookName}</Text>
        </Navigator>
      ))}
    </View>
  );
}

export default Recommend;
