import Taro, { Component } from '@tarojs/taro';
import { View, Text, Slider, ScrollView } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';

import IconFont from '@/components/IconFont';
import './index.less';
import Theme from './Theme';
import Settings from './Settings';
import Capsule from './Capsule';
import { NavBarProps } from '../../data';

const Panel = {
  default: 'default',
  catalogue: 'catalogue',
  theme: 'theme',
  settings: 'settings'
};

@inject('bookPreviewStore')
@observer
class NavBar extends Component<NavBarProps> {
  config = {
    navigationBarTitleText: ''
  };

  static options = {
    addGlobalClass: true
  };

  state = {};

  panes = [
    {
      title: '目录',
      icon: '&#xe662;',
      id: 'catalogue'
    },
    {
      title: '主题',
      icon: '&#xe648;',
      id: 'theme'
    },
    {
      title: '设置',
      icon: '&#xe671;',
      id: 'settings'
    }
  ];

  handleBottomClick = e => {
    const id = e.target.dataset.id;
    switch (id) {
      case Panel.catalogue:
        Taro.navigateTo({
          url: '/pages/catalogue/index'
        });
        break;
      case Panel.theme:
      case Panel.settings:
        const { bookPreviewStore } = this.props;
        bookPreviewStore.setCurrentPane(id);
    }
  };

  handleThemeClick = theme => {
    const { bookPreviewStore } = this.props;
    bookPreviewStore.setTheme(theme);
    Taro.setNavigationBarColor({
      frontColor: theme.name === '暗黑' ? '#ffffff' : '#000000',
      backgroundColor: theme.backgroundColor
    });
  };

  handleFontChange = e => {
    const { bookPreviewStore } = this.props;
    bookPreviewStore.setFont({
      fontSize: e.detail.value
    });
  };

  handleSliderChange = e => {
    const { bookPreviewStore } = this.props;
    bookPreviewStore.setCurrentChapter(e.detail.value);
  };

  render() {
    const { animation, currentPane, font, theme, currentChapter, chapters } = this.props.bookPreviewStore;
    const { onToggleChapterClick } = this.props;

    return (
      <View className="nav-bar">
        {currentPane === 'default' ? (
          <View
            className="nav-bar__default"
            animation={animation}
            style={{ backgroundColor: theme.backgroundColor, color: theme.color }}
          >
            <ScrollView scrollX enableFlex className="chapter">
              {chapters[currentChapter]}
            </ScrollView>
            <View className="slider-wrapper">
              <Text className="icon" onClick={() => onToggleChapterClick(false)}>
                &#xe635;
              </Text>
              <Slider
                className="slider"
                step={1}
                activeColor="#f67280"
                blockColor="#f67280"
                blockSize={20}
                value={currentChapter}
                min={0}
                max={chapters.length - 1}
                onChange={this.handleSliderChange}
              />
              <Text className="progress grey">{Math.trunc(((currentChapter + 1) / chapters.length) * 100)}%</Text>
              <Text className="icon" onClick={() => onToggleChapterClick()}>
                &#xe636;
              </Text>
            </View>
            <View className="bottom" onClick={this.handleBottomClick}>
              {this.panes.map(item => (
                <View className="bottom__item grey" key={item.title} data-id={item.id}>
                  <IconFont unicode={item.icon} class-name="icon" color={theme.color} data-id={item.id} />
                  {item.title}
                </View>
              ))}
            </View>
            <Capsule />
          </View>
        ) : currentPane === 'theme' ? (
          <Theme onThemeClick={this.handleThemeClick} animation={animation} theme={theme} />
        ) : (
          <Settings onFontChange={this.handleFontChange} animation={animation} font={font} theme={theme} />
        )}
      </View>
    );
  }
}
export default NavBar;
