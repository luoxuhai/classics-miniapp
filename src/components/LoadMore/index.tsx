import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

import Empty from '@/components/Empty';
import './index.less';

interface Props {
  loading?: boolean;
  empty?: boolean;
}

function LoadMore({ loading = true, empty = false }: Props) {
  return (
    <View className="loading-container" style={{ backgroundSize: !loading ? 0 : undefined }}>
      {empty ? (
        <Empty />
      ) : (
        <View className="loading-view">
          {loading && <View className="loading" />}
          {loading ? '加载中' : '没有更多了'}
        </View>
      )}
    </View>
  );
}

export default LoadMore;
