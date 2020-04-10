import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';

import { getDecimals } from '@/utils/utils';
import './index.less';

type Props = {
  name: string | undefined;
  cover: string | undefined;
  score: number | undefined;
  author: { name: string } | undefined;
};

function Header({ name = '', cover = '', score = 0, author = { name: '' } }: Props) {
  return (
    <View className="header">
      <Image className="header__cover" src={cover} mode="aspectFill" />
      <View>
        <Text className="header__name">{name}</Text>
        <Text className="header__author">{author.name}</Text>
        <View className="header__rate grey">
          {score + ' '}
          <rate current={score.toFixed(0)} disabled active="#ffca3e" normal="#ececec" score={getDecimals(score)} />
        </View>
      </View>
    </View>
  );
}

Header.config = {
  usingComponents: {
    rate: '../../../../components/rate'
  }
};

Header.options = {
  addGlobalClass: true
};

export default Header;
