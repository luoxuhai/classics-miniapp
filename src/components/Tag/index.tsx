import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

import './index.less';

interface Props {
  title: string;
  size?: string;
  space?: {
    h: string | number;
    v: string | number;
  };
  color?: string;
  bgColor?: string;
}

export default ({
  title,
  bgColor = '#f8b195',
  color = '#fff',
  size = 'mini',
  space = {
    h: 0,
    v: 0,
  },
}: Props) => {
  return (
    <View
      className="tag"
      style={{
        backgroundColor: bgColor,
        color,
        fontSize: size === 'mini' ? '22rpx' : '32rpx',
        height: size === 'mini' ? '35rpx' : '60rpx',
        margin: space.v + ' ' + space.h,
      }}
    >
      {title}
    </View>
  );
};
