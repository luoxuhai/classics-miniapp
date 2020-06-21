import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Input, Ad } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';

import BookList from '@/components/BookList';
import Tag from '@/components/Tag';
import { search } from '../services';
import './index.less';

interface State {
  books: any[];
  searchHistory: string[];
  inputValue: string;
}
interface Props {
  globalStore: {
    freeAD: boolean;
  };
}

@inject('globalStore')
@observer
class SearchPage extends Component<Props, State> {
  config: Config = {
    navigationBarTitleText: '搜索'
  };

  state: State = {
    books: [],
    inputValue: '',
    searchHistory: []
  };

  componentWillMount() {
    Taro.getStorage({ key: 'searchHistory' }).then(({ data }) => {
      this.setState({
        searchHistory: data || []
      });
    }).catch(() => null)
  }

  handleClearClick = () => {
    this.setState({
      inputValue: '',
      books: []
    });
  };

  handleInputChange = e => {
    const value = e.detail.value;
    if (value.trim())
      this.setState({
        inputValue: value.trim()
      });
    else
      this.setState({
        books: [],
        inputValue: ''
      });
  };

  handleSearchClick = () => {
    const { inputValue } = this.state;
    if (inputValue) {
      Taro.showLoading({
        title: '搜索中...',
        mask: true
      });
      search({ inputValue })
        .then(res => {
          Taro.hideLoading();
          if (res.books.length === 0) {
            Taro.showToast({
              title: '没有找到相关书籍',
              icon: 'none',
              duration: 2000
            });
            return;
          }
          this.setState({
            books: res.books
          });
          this.saveSearchHistory(inputValue);
        })
        .catch(() => {
          Taro.hideLoading();
        });
    }
  };

  saveSearchHistory = (inputValue: string) => {
    const { searchHistory } = this.state;
    const newData = [...new Set([inputValue, ...searchHistory])];
    this.setState({
      searchHistory: newData
    });
    Taro.setStorage({
      key: 'searchHistory',
      data: newData
    });
  };

  clearSearchHistory = () => {
    if (!this.state.searchHistory.length) return;
    this.setState({
      searchHistory: []
    });
    Taro.removeStorage({ key: 'searchHistory' });
    Taro.showToast({
      title: '已清除搜索历史'
    });
  };

  handleSearchHistoryClick = ({ target }) => {
    if (target.dataset.id) {
      this.setState(
        {
          inputValue: target.dataset.id
        },
        () => {
          this.handleSearchClick();
        }
      );
    }
  };

  render() {
    const { books, inputValue, searchHistory } = this.state;
    const {
      globalStore: { freeAD }
    } = this.props;

    return (
      <View className="search-page">
        <View className="search main-bg-color">
          <View className="search__wrapper secondary-text-color bg-color">
            <Text className="icon">&#xe666;</Text>
            <Input
              onInput={this.handleInputChange}
              onConfirm={this.handleSearchClick}
              value={inputValue}
              placeholder="搜索你想看的书"
              confirmType="search"
              maxLength={12}
              focus
            />
            <Text
              className="icon close"
              style={{ display: inputValue ? undefined : 'none ' }}
              onClick={this.handleClearClick}
            >
              &#xe63f;
            </Text>
          </View>
          <Text className="search__button" onClick={this.handleSearchClick}>
            搜索
          </Text>
        </View>
        {books.length ? (
          <BookList books={books} loading={false} />
        ) : (
          <View className="search-history">
            <View className="search-history__title">
              搜索历史
              <Text className="icon" onClick={this.clearSearchHistory}>
                &#xe64f;
              </Text>
            </View>
            <View className="search-history__content" onClick={this.handleSearchHistoryClick}>
              {searchHistory.map(item => (
                <Tag
                  title={item}
                  bgColor="#f6f7fb"
                  color="#000"
                  size="default"
                  space={{ h: '10rpx', v: '10rpx' }}
                  key={item}
                  data-id={item}
                />
              ))}
            </View>
            {!freeAD && <Ad unitId="adunit-e1a27ccddca8d7e7" adType="video" adTheme="white" />}
            {!freeAD && <Ad unitId="adunit-c13ec7787695caea" adType="video" adTheme="white" />}
          </View>
        )}
      </View>
    );
  }
}

export default SearchPage;
