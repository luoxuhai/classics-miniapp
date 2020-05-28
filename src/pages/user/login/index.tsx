import Taro, { Component, Config } from '@tarojs/taro';
import { View, Image, Button, Text } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';

import logo from '@/assets/images/logo.png';
import { Props } from '../data';
import './index.less';

@inject('userStore')
@observer
class User extends Component<Props> {
  config: Config = {
    navigationBarTitleText: '登录',
    navigationStyle: 'custom',
    navigationBarTextStyle: 'white'
  };

  menuButton = Taro.getMenuButtonBoundingClientRect();

  handleButtonClick = e => {
    const id = e.target.dataset.id;
    if (!id) return;

    if (id === 'affirm') {
      Taro.showLoading({
        title: '登录中...'
      });
    } else if (id === 'cancel') {
      if (Taro.getCurrentPages().length > 1)
        Taro.navigateBack({
          delta: 1
        });
      else Taro.switchTab({ url: '/pages/bookstore/index' });
    }
  };

  getUserInfo = () => {
    Taro.getUserInfo({
      withCredentials: true,
      lang: 'zh_CN'
    }).then(res => {
      const data: any = res.userInfo;
      const { userStore } = this.props;
      let check = false;
      if (/mmhead/.test(data.avatarUrl)) check = true;
      userStore.setCheck(check);
      Taro.setStorageSync('check', check);

      Taro.login().then(({ code }) => {
        if (code) {
          if (data.gender === 1 || data.gender === 0) data.gender = '男';
          else if (data.gender === 2) data.gender = '女';
          Object.assign(data, { code });
          const client = process.env.TARO_ENV === 'weapp' ? 'weixin' : 'qq';
          userStore.login({ code, client, data });
        }
      });
    });
  };

  render() {
    return (
      <View className="login">
        <Text
          className="login__slogan webfont"
          style={{
            left: `calc(100vw - ${this.menuButton.left + this.menuButton.width}px)`,
            top: this.menuButton.top + 5 + 'px',
            height: this.menuButton.height + 'px',
            lineHeight: this.menuButton.height + 'px'
          }}
        >
          古典文学名著阅读
        </Text>
        <View className="login__bg" />
        <Image className="login__logo" src={logo} mode="aspectFill" />
        <View className="login__group" onClick={this.handleButtonClick}>
          <Button
            className="login__affirm"
            type="primary"
            formType="submit"
            openType="getUserInfo"
            onGetUserInfo={this.getUserInfo}
            data-id="affirm"
          >
            微信登录
          </Button>
          <Button className="login__cancel" data-id="cancel">
            取消
          </Button>
        </View>
      </View>
    );
  }
}

export default User;
