import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

import { getDecimals } from '@/utils/utils';
import BookCover from '@/components/BookCover';
import './index.less';

type Props = {
  name: string | undefined;
  score: number | undefined;
  author: { name: string } | undefined;
};

function Header({ name = '', score = 0, author = { name: '' } }: Props) {
  return (
    <View className="header">
      <BookCover class-name="header__cover" width="226rpx" text={name} />
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
