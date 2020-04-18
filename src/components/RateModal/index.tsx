import Taro, { PureComponent, Config } from '@tarojs/taro';
import { View, Button, Text } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';

import './index.less';

type Props = {
  userStore?: {
    token: string;
  };
  onClick?: Function;
};

@inject('userStore')
@observer
class LoginMask extends PureComponent<Props> {
  static defaultProps = {
    login: true
  };

  static options = {
    addGlobalClass: true
  };

  config: Config = {
    usingComponents: {
      rate: '../rate'
    }
  };

  handleTap(res) {
    console.log(res);
  }

  render() {
    return (
      <View className="rate-modal">
        <View className="rate-modal__body">
          <View className="rate-modal__rate">
            <rate
              size={36}
              disabled={false}
              active="#ffca3e"
              normal="#ececec"
              handleTap={this.handleTap}
              score={0.5}
            />
            <Text className="grey">一般</Text>
          </View>
          <Button className="rate-modal__affirm" type="primary">
            评分
          </Button>
        </View>
        <Text className="rate-modal__close icon">&#xe63f;</Text>
      </View>
    );
  }
}

export default LoginMask;
