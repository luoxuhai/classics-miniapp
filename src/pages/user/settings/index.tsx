import Taro, { Component, Config } from '@tarojs/taro';
import { View, Image, Button, Text } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';

import { BASE_URL } from '@/utils/config';
import { putUser } from '@/services/user';
import { Props, SettingsState } from '../data';
import './index.less';

@inject('userStore')
@observer
class SettingsPage extends Component<Props, SettingsState> {
  config: Config = {
    navigationBarTitleText: '账户设置'
  };

  state: SettingsState = {
    currentSize: 0
  };

  genderSelector = ['男', '女'];

  componentWillMount() {
    this.getStorageSize();
  }

  handleClick = e => {
    const target = e.target.dataset.id;
    switch (target) {
      case 'settings-00':
      case 'settings-12':
        const title = target === 'panel-00' ? '去除广告' : '关于';
        const pathname = target === 'panel-00' ? '/remove-ad.html' : '/about.html';
        Taro.navigateTo({
          url: `/pages/rich_content/index?title=${title}&url=https://classics.oss-cn-beijing.aliyuncs.com/app/pages${pathname}`
        });
      case 'settings-0':
        this.handleSelectAvatar();
        break;
      case 'settings-1':
        Taro.navigateTo({ url: '/pages/user/nickname/index' });
        break;
      case 'settings-2':
        this.handleActionSheetClick();
        break;
      case 'settings-3':
        this.handleClear();
        break;
      case 'settings-4':
        this.handleLogout();
        break;
      case 'settings-5':
        Taro.navigateTo({
          url: '/pages/user/admin/index'
        });
    }
  };

  handleClear = () => {
    Taro.clearStorageSync();
    const { user, token } = this.props.userStore;
    Taro.setStorageSync('token', token);
    Taro.setStorageSync('user', user);
    Taro.showToast({
      title: '清除完成',
      icon: 'success'
    });
    this.getStorageSize();
  };

  getStorageSize = () => {
    Taro.getStorageInfo({
      success: res => {
        this.setState({
          currentSize: res.currentSize
        });
      }
    });
  };

  handleActionSheetClick = () => {
    Taro.showActionSheet({
      itemList: ['男', '女']
    })
      .then(({ errMsg, tapIndex }) => {
        if (errMsg === 'showActionSheet:ok') {
          const { userStore } = this.props;
          Taro.showLoading({ title: '修改中' });
          putUser({
            id: userStore.user._id,
            params: {
              gender: this.genderSelector[tapIndex]
            }
          })
            .then(() => {
              Taro.hideLoading();
              userStore.setUser({ gender: this.genderSelector[tapIndex] });
            })
            .catch(() => {
              Taro.hideLoading();
            });
        }
      })
      .catch(() => null);
  };

  handleSelectAvatar = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera']
    }).then(({ tempFilePaths }) => {
      Taro.showLoading({
        title: '上传中',
        mask: true
      });
      Taro.uploadFile({
        url: BASE_URL + '/v2/upload',
        filePath: tempFilePaths[0],
        name: 'avatar',
        formData: {
          path: 'users/avatars'
        },
        header: {
          Authorization: `Bearer ${global.$token}`
        }
      })
        .then((res: any) => {
          Taro.hideLoading();
          if (res.statusCode !== 200) {
            return Promise.reject(JSON.parse(res.data));
          }
          const { avatar } = JSON.parse(res.data);
          const { userStore } = this.props;
          userStore.setUser({ avatar });
          putUser({
            id: userStore.user._id,
            params: {
              avatar
            }
          });
        })
        .catch(error => {
          Taro.hideLoading();
          if (error.errcode === 87014) {
            Taro.showModal({
              title: '提示',
              content: '头像含有违法违规内容',
              showCancel: false,
              confirmColor: '#f67280'
            });
          }
        });
    });
  };

  handleLogout = () => {
    const { userStore } = this.props;
    Taro.showModal({
      title: '提示',
      content: '确认退出登录',
      confirmColor: '#f67280',
      success: res => {
        if (res.confirm) userStore.logout();
      }
    });
  };

  render() {
    const { currentSize } = this.state;
    const {
      userStore: { user }
    } = this.props;

    return (
      <View className="settings" onClick={this.handleClick}>
        <View className="settings__item black" data-id="settings-0">
          头像
          <Image className="avatar" src={user.avatar} mode="aspectFill" data-id="settings-0" />
        </View>
        <View className="settings__item black" data-id="settings-1">
          昵称
          <Text className="light">{user.nickname}</Text>
        </View>
        <View className="settings__item black" data-id="settings-2">
          性别
          <Text className="title light">{user.gender}</Text>
        </View>
        <View className="settings__item black" data-id="settings-3">
          清除缓存
          <Text className="light" data-id="settings-3">
            <Text className="clear-cache-icon red">&#xe60e;</Text>
            {currentSize}KB
          </Text>
        </View>
        {user.nickname === 'adminlxhclassics' && (
          <View className="settings__item black" data-id="settings-5">
            管理员
            <Text className="clear-cache-icon red">&#xe605;</Text>
          </View>
        )}

        <Button className="settings__logout red-bg" data-id="settings-4">
          退出登录
        </Button>
      </View>
    );
  }
}

export default SettingsPage;
