import Taro from '@tarojs/taro';
import { Text, View } from '@tarojs/components';

import './index.less';

interface Props {
  size?: string;
  color?: string;
}

function Empty({ size = '30px', color = '#b2b2b2' }: Props) {
  return (
    <View className="empty" style={{ color }}>
      <Text className="empty-icon" style={{ fontSize: size }}>
        &#xe600;
      </Text>
      暂无数据
    </View>
  );
}

export default Empty;
