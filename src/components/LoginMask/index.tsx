import Taro, { PureComponent } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';

import './index.less';

type Props = {
  userStore?: {
    token: string;
  };
};

@inject('userStore')
@observer
class LoginMask extends PureComponent<Props> {
  static defaultProps = {
    login: true
  };

  handleClick() {
      Taro.showModal({
        title: '提示',
        content: '登录以继续',
        confirmText: '登录',
        confirmColor: '#f67280'
      }).then(res => {
        if (res.confirm)
          Taro.navigateTo({
            url: '/pages/user/login/index'
          });
      });
  }

  render() {
    const {
      userStore: { token }
    } = this.props;
    return !token ? <View className="mask" onClick={this.handleClick} /> : null;
  }
}

export default LoginMask;
