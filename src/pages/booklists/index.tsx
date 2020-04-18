import Taro, { Component, Config } from '@tarojs/taro';
import { View, Image, Navigator } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';

import LoginMask from '@/components/LoginMask';
import LoadMore from '@/components/LoadMore';
import { shareMixin } from '@/utils/utils';
import { State, Props } from './data';
import { queryBooklists } from './services';
import { queryRichContent } from '../rich_content/services';
import './index.less';

@shareMixin
@inject('userStore')
@observer
class BooklistsPage extends Component<Props, State> {
  config: Config = {
    navigationBarTitleText: '书单推荐',
    enablePullDownRefresh: true
  };

  state: State = {
    booklists: [],
    loading: true
  };

  pagination: Pagination = {
    current: 1,
    pageSize: 6,
    pageTotal: 1
  };

  shareConfig: ShareConfig = {};

  componentWillMount() {
    this.handleLoadData(false);
  }

  onPullDownRefresh() {
    this.pagination.current = 1;
    this.handleLoadData(false);
  }

  onReachBottom() {
    this.handleLoadData(true);
  }

  handleLoadData(reachBottom) {
    if (this.pagination.current > this.pagination.pageTotal) {
      this.setState({
        loading: false
      });
      return;
    } else
      this.setState({
        loading: true
      });

    queryBooklists({
      current: this.pagination.current,
      pageSize: this.pagination.pageSize
    })
      .then(res => {
        const { articles, current, pageTotal } = res;

        this.setState({
          booklists: reachBottom ? [...this.state.booklists, ...articles] : articles,
          loading: false
        });
        this.pagination.current = current + 1;
        this.pagination.pageTotal = pageTotal || 1;
      })
      .catch(() => null)
      .finally(() => {
        Taro.stopPullDownRefresh();
      });
  }

  handleBookListsClick = (url, title) => {
    queryRichContent({
      url
    }).then(res => {
      Taro.setStorage({
        key: title,
        data: res
      });
    });
  };

  render() {
    const { booklists, loading } = this.state;
    const { userStore } = this.props;

    return (
      <View className="booklists">
        {booklists.map(item => (
          <Navigator
            className="booklists__item"
            url={
              userStore.check
                ? '/pages/book_detail/index'
                : `/pages/rich_content/index?url=${item.content}&title=${item.title}`
            }
            key={item._id}
            onClick={() => this.handleBookListsClick(item.content, item.title)}
          >
            <Image className="booklists__cover" src={item.cover} mode="aspectFill" lazyLoad />
          </Navigator>
        ))}
        <LoadMore loading={loading} />
        <LoginMask />
      </View>
    );
  }
}

export default BooklistsPage;
