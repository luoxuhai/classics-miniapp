import Taro, { Component, Config } from '@tarojs/taro';
import { View, Image, Button, Text } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';

import IconFont from '@/components/IconFont';
import LoginMask from '@/components/LoginMask';
import { rewardedVideoAd } from '@/utils/utils';
import avatar from '@/assets/images/avatar.svg';
import { BASE_URL } from '@/utils/config';
import { Props } from './data';
import './index.less';

@inject('userStore')
@inject('globalStore')
@observer
class UserPage extends Component<Props> {
  config: Config = {
    navigationBarTitleText: '我的',
    navigationStyle: 'custom',
    navigationBarTextStyle: 'white'
  };

  state = {
    options: [
      [
        {
          title: '阅读记录',
          icon: '&#xe660;'
        },
        {
          title: '账户设置',
          icon: '&#xe671;'
        },
        {
          title: '去除广告',
          icon: '&#xe67a;'
        }
      ],
      [
        {
          title: '交流讨论',
          icon: '&#xe62c;'
        },
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
      ],
      [
        {
          title: '观看广告',
          icon: '&#xe67a;'
        }
      ]
    ]
  };

  componentWillMount() {
    const { userStore, globalStore } = this.props;
    if (userStore.user._id) userStore.fetchUser(userStore.user._id);
    if (globalStore.adCheck)
      this.setState({
        options: this.state.options
          .map((option, index) => {
            if (index === 0) {
              return option.slice(0, 2);
            }
            return option;
          })
          .slice(0, 2)
      });
  }

  handleClick = e => {
    const target = e.target.dataset.id;
    switch (target) {
      case 'panel-00':
        Taro.navigateTo({
          url: `/pages/read_history/index`
        });
        break;
      case 'panel-01':
        Taro.navigateTo({
          url: `/pages/user/settings/index`
        });
        break;
      case 'panel-02':
      case 'panel-13':
        const title = target === 'panel-02' ? '去除广告' : '关于';
        const {
          userStore: { check }
        } = this.props;
        const url =
          target === 'panel-02'
            ? check
              ? 'https://classics.oss-cn-beijing.aliyuncs.com/app/pages/remove-ad-check.html'
              : `${BASE_URL}/v2/pages/remove-ad`
            : 'https://classics.oss-cn-beijing.aliyuncs.com/app/pages/about.html';
        Taro.navigateTo({
          url: `/pages/rich_content/index?title=${title}&url=${url}`
        });
        break;
      case 'panel-10':
        Taro.navigateToMiniProgram({
          appId: 'wx8abaf00ee8c3202e',
          extraData: {
            id: '72770',
            customData: {
              clientInfo: global.systemInfo.system
            }
          }
        });
      case 'panel-20':
        rewardedVideoAd('adunit-7f9e5a42537d055c', () => {
          Taro.showModal({
            title: '您已观看完广告',
            confirmText: '确认',
            confirmColor: '#f67280',
            showCancel: false
          });
        });
    }
  };

  render() {
    const {
      userStore: { user },
      globalStore: { freeAD }
    } = this.props;
    return (
      <View className="user bg-color" onClick={this.handleClick}>
        <View className="user__header">
          <View className="cut">
            <View className="header__pane main-bg-color">
              <View className="pane__user" data-id="panel-02">
                <Image className="pane__avatar" src={user.avatar || avatar} mode="aspectFill" data-id="panel-02" />
                <Text
                  className="pane__nickname"
                  style={{ color: freeAD === 1 ? '#f67280' : undefined }}
                  data-id="panel-02"
                >
                  {user.nickname}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {this.state.options.map((item, index) => (
          <View className="panel main-bg-color" key={`panel-${index}`}>
            {item.map((_item, _index) => (
              <View
                className="panel__item title-color divider-color"
                key={_item.title}
                data-id={`panel-${index}${_index}`}
              >
                {_item.title} <IconFont size="22px" unicode={_item.icon} />
                {index === 1 && _index === 1 && <Button className="hide-button" size="mini" openType="feedback" />}
                {index === 1 && _index === 2 && <Button className="hide-button" size="mini" openType="contact" />}
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
