import Taro, { PureComponent, Config } from '@tarojs/taro';
import { View } from '@tarojs/components';

import { queryRichContent } from './services';
import './index.less';

class RichContent extends PureComponent {
  config: Config = {
    usingComponents: {
      parser: '../../components/parser/parser'
    }
  };

  componentDidMount() {
    const { url, title } = this.$router.params;
    Taro.showNavigationBarLoading();
    Taro.setNavigationBarTitle({ title });
    queryRichContent({
      url
    }).then(res => {
      if (!this.refs.parser.html) this.refs.parser.setContent(res);
      Taro.setStorage({
        key: title,
        data: res
      });
    });
    Taro.getStorage({ key: title })
      .then(res => {
        this.refs.parser.setContent(res.data);
      })
      .catch(() => null);
  }

  render() {
    return (
      <View className="rich-content">
        <parser ref="parser" selectable onLoad={() => Taro.hideNavigationBarLoading()} />
      </View>
    );
  }
}

export default RichContent;
