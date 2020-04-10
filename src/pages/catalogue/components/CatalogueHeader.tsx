import Taro from '@tarojs/taro';
import { View, Button } from '@tarojs/components';

import './CatalogueHeader.less';

export default ({ chapters }) => {
  return (
    <View className="catalogue__header">
      共{chapters.length}章
      {/* <Button
        className="order__button"
        onClick={onOrderClick}
        disabled={!chapters.length}
        size="mini"
        type="primary"
      >
        {ascend ? '正序' : '倒序'}
      </Button> */}
    </View>
  );
};
