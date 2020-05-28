import Taro, { PureComponent, Config } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';

import { shareMixin } from '@/utils/utils';
import { queryRichContent } from './services';
import './index.less';

interface Props {
  globalStore: {
    freeAD: number;
  };
}

@inject('globalStore')
@observer
@shareMixin
class RichContent extends PureComponent<Props> {
  config: Config = {
    usingComponents: {
      parser: '../../components/parser/parser'
    }
  };

  shareConfig: ShareConfig = {};

  parser: any;

  componentWillMount() {
    const { url, title } = this.$router.params;
    Taro.showNavigationBarLoading();
    Taro.setNavigationBarTitle({ title });
    this.shareConfig = {
      title,
      path: `/pages/rich_content/index?url=${url}&title=${title}`
    };
    if (!/去除广告|关于/.test(title) && this.props.globalStore.freeAD !== 1) {
      const interstitialAd = Taro.createInterstitialAd({
        adUnitId: 'adunit-811e41cc3e61081f'
      });
      interstitialAd.show().catch(() => null);
    }
  }

  componentDidMount() {
    const { url, title } = this.$router.params;
    queryRichContent({
      url
    }).then(res => {
      if (!this.parser.__data__.html) this.parser.setContent(res);
      Taro.setStorage({
        key: title,
        data: res
      });
    });
    Taro.getStorage({ key: title })
      .then(res => {
        this.parser.setContent(res.data);
      })
      .catch(() => null);
  }

  render() {
    return (
      <View className="rich-content">
        <parser ref={e => (this.parser = e)} selectable onLoad={() => Taro.hideNavigationBarLoading()} />
      </View>
    );
  }
}

export default RichContent;
