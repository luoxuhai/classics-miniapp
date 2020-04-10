import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

import './index.less';

class Search extends Component {
  config = {
    navigationBarTitleText: '',
  };

  static options = {
    addGlobalClass: true,
  };

  state = {
    top: 0,
  };

  componentWillMount() {}
  componentDidMount() {
    const query = Taro.createSelectorQuery();

    query
      .select('#nav')
      .boundingClientRect((rect) => {
        this.setState({
          top: rect.height,
        });
      })
      .exec();
  }

  handleGoSearch() {
    Taro.navigateTo({
      url: '/pages/bookstore/search/index',
    });
  }

  render() {
    const { top } = this.state;
    return (
      <View className="search" style={{ top: `${top}px` }}>
        <View className="search__wrapper light" onClick={this.handleGoSearch}>
          <Text className="icon">&#xe666;</Text>
          搜索你想看的书
        </View>
      </View>
    );
  }
}
export default Search;
