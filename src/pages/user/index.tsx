import Taro, { Component, Config } from '@tarojs/taro';
import { View, Image, Button, Text } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';

import IconFont from '@/components/IconFont';
import LoginMask from '@/components/LoginMask';
import avatar from '@/assets/images/avatar.svg';
import { Props } from './data';
import './index.less';

const options = [
  [
    {
      title: '去除广告',
      icon: '&#xe67a;'
    },
    {
      title: '阅读记录',
      icon: '&#xe660;'
    },
    {
      title: '账户设置',
      icon: '&#xe671;'
    }
  ],
  [
    {
      title: '问题反馈',
      icon: '&#xe65e;'
    },
    {
      title: '联系客服',
      icon: '&#xe665;'
    },
    {
      title: '关于',
      icon: '&#xe616;'
    }
  ]
];

@inject('userStore')
@observer
class UserPage extends Component<Props> {
  config: Config = {
    navigationBarTitleText: '我的',
    navigationStyle: 'custom',
    navigationBarTextStyle: 'white'
  };

  componentWillMount() {
    const { userStore } = this.props;
    if (userStore.user._id) userStore.fetchUser(userStore.user._id);
  }

  handleClick = e => {
    const target = e.target.dataset.id;
    switch (target) {
      case 'panel-01':
        Taro.navigateTo({
          url: `/pages/read_history/index`
        });
        break;
      case 'panel-02':
        Taro.navigateTo({
          url: `/pages/user/settings/index`
        });
        break;
      case 'panel-00':
      case 'panel-12':
        const title = target === 'panel-00' ? '去除广告' : '关于';
        const {
          userStore: { check }
        } = this.props;
        const pathname = target === 'panel-00' ? (check ? '/remove-ad-check.html' : '/remove-ad.html') : '/about.html';
        Taro.navigateTo({
          url: `/pages/rich_content/index?title=${title}&url=https://classics.oss-cn-beijing.aliyuncs.com/app/pages${pathname}`
        });
    }
  };

  render() {
    const {
      userStore: { user }
    } = this.props;
    return (
      <View className="user" onClick={this.handleClick}>
        <View className="user__header">
          <View className="cut">
            <View className="header__pane">
              <View className="pane__user" data-id="panel-02">
                <Image className="pane__avatar" src={user.avatarUrl || avatar} mode="aspectFill" data-id="panel-02" />
                <Text className="pane__nickname" data-id="panel-02">
                  {user.nickName}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {options.map((item, index) => (
          <View className="panel" key={`panel-${index}`}>
            {item.map((_item, _index) => (
              <View className="panel__item black" key={_item.title} data-id={`panel-${index}${_index}`}>
                {_item.title} <IconFont size="22px" unicode={_item.icon} />
                {index === 1 && _index === 0 && <Button className="hide-button" size="mini" openType="feedback" />}
                {index === 1 && _index === 1 && <Button className="hide-button" size="mini" openType="contact" />}
              </View>
            ))}
          </View>
        ))}
        <LoginMask />
      </View>
    );
  }
}

export default UserPage;
