import Taro, { Component } from '@tarojs/taro';
import { View, Navigator } from '@tarojs/components';

import './index.less';

const bookType = ['世态人情', '鬼怪神魔', '历史演义', '谴责公案', '唐传奇', '其他'];

class Classify extends Component {
  config = {
    navigationBarTitleText: '',
  };

  state = {};

  render() {
    return (
      <View className="book-type">
        {bookType.map((item) => (
          <Navigator url={`/pages/book_list_view/index?type=${item}`} className="book-type__item" key={item}>
            {item}
          </Navigator>
        ))}
      </View>
    );
  }
}
export default Classify;
