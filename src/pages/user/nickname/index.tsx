import Taro, { Component, Config } from '@tarojs/taro';
import { View, Textarea, Button } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';

import { putUser } from '@/services/user';
import { Props } from '../data';
import './index.less';

@inject('userStore')
@observer
class User extends Component<Props> {
  config: Config = {
    navigationBarTitleText: '修改昵称'
  };

  state = {
    inputValue: this.props.userStore.user.nickName
  };

  handleInput = e => {
    this.setState({
      inputValue: e.detail.value.trim()
    });
  };

  handleSubmit = () => {
    const { inputValue } = this.state;
    if (inputValue.replace(/(^\s*)|(\s*$)/g, '').length === 0) {
      Taro.showModal({
        title: '提示',
        content: '昵称不能为空',
        showCancel: false
      });
      return;
    }
    const { userStore } = this.props;
    Taro.showLoading({ title: '修改中' });
    putUser({
      id: userStore.user._id,
      params: {
        nickName: inputValue
      }
    })
      .then(() => {
        userStore.setUser({ nickName: inputValue });
        setTimeout(() => {
          Taro.navigateBack({
            delta: 1
          });
        }, 500);
      })
      .catch(error => {
        if (error.errcode === 87014) {
          Taro.showModal({
            title: '提示',
            content: '昵称含有违法违规内容',
            showCancel: false,
            confirmColor: '#f67280'
          });
        }
      })
      .finally(() => {
        Taro.hideLoading();
      });
  };

  render() {
    const { user } = this.props.userStore;
    const { inputValue } = this.state;
    return (
      <View className="nickname">
        <Textarea
          className="nickname__input"
          value={user.nickName}
          placeholder="请输入昵称"
          autoFocus
          showConfirmBar={false}
          onInput={this.handleInput}
          maxlength={12}
        />
        <Button
          className="nickname__save"
          disabled={inputValue === user.nickName}
          onClick={this.handleSubmit}
          type="primary"
          data-id="settings-4"
        >
          保存
        </Button>
      </View>
    );
  }
}

export default User;
