import Taro, { useEffect, useState } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

import './index.less';

interface Props {
  text: string;
  width?: string;
  onClick?: (e) => any;
}

function BookCover({ width = '160rpx', text = '', onClick = undefined }: Props) {
  const [texts, setTexts] = useState<string[]>([]);
  useEffect(() => {
    const arr: any[] = [];
    if (text.length <= 5) {
      arr.push(text);
    } else if (text.length > 5) {
      arr.push(text.slice(0, 5));
      arr.push(text.slice(5));
    } else {
      arr.push(text.slice(0, 5));
      arr.push(text.slice(5, 10));
      arr.push(text.slice(10));
    }
    setTexts(arr);
  }, [text]);

  return (
    <View
      className="class-name cover"
      style={{ width, height: `calc(${width} / 0.73)` }}
      onClick={e => {
        if (onClick) onClick(e);
      }}
    >
      {texts.map(item => (
        <Text
          className="cover__text"
          style={{ fontSize: `calc(${width} / 0.73 / 8.5)`, alignItems: texts.length === 1 ? 'center' : 'flex-start' }}
          key={item}
        >
          {item}
        </Text>
      ))}
    </View>
  );
}

BookCover.externalClasses = ['class-name'];

export default BookCover;
