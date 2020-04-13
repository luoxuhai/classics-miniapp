import Taro, { Component, Config } from '@tarojs/taro';
import { View, Textarea, Button } from '@tarojs/components';

import { setFreeAD } from '@/services/servers';
import './index.less';

class AdminPage extends Component {
  config: Config = {
    navigationBarTitleText: '管理员页面'
  };

  state = {
    inputValue: ''
  };

  handleInput = e => {
    this.setState({
      inputValue: e.detail.value.trim()
    });
  };

  handleSubmit = () => {
    const { inputValue } = this.state;
    if (inputValue.replace(/(^\s*)|(\s*$)/g, '').length < 16) {
      Taro.showModal({
        title: '提示',
        content: 'ID格式错误',
        showCancel: false
      });
      return;
    }
    Taro.showLoading({ title: '修改中' });
    setFreeAD({
      id: inputValue
    })
      .then(() => {
        Taro.hideLoading();
        Taro.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000
        });
      })
      .catch(error => {
        Taro.hideLoading();
        Taro.showModal({
          title: '提示',
          content: JSON.stringify(error),
          showCancel: false,
          confirmColor: '#f67280'
        });
      });
  };

  render() {
    const { inputValue } = this.state;

    return (
      <View className="nickname">
        <Textarea
          className="nickname__input"
          value={inputValue}
          placeholder="请输入id"
          autoFocus
          showConfirmBar={false}
          onInput={this.handleInput}
          maxlength={36}
        />
        <Button
          className="nickname__save"
          disabled={inputValue.length < 16}
          onClick={this.handleSubmit}
          type="primary"
          data-id="settings-4"
        >
          免广告一个月
        </Button>
      </View>
    );
  }
}

export default AdminPage;
