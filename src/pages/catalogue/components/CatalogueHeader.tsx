import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

import './CatalogueHeader.less';

function CatalogueHeader({ chapters }) {
  return (
    <View className="catalogue__header main-bg-color">
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
}

CatalogueHeader.options = {
  addGlobalClass: true
};

export default CatalogueHeader;
