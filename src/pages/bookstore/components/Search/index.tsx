import Taro from '@tarojs/taro';
import { View, Text, Navigator } from '@tarojs/components';

import './index.less';

function Search() {
  return (
    <View className="search">
      <Navigator className="search__wrapper light" url="/pages/bookstore/search/index">
        <Text className="icon">&#xe666;</Text>
        搜索你想看的书
      </Navigator>
    </View>
  );
}

Search.options = {
  addGlobalClass: true
};

export default Search;
