import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

import './Theme.less';

const themes = [
  {
    name: '默认',
    backgroundColor: '#fff',
    color: '#353535',
  },
  {
    name: '护眼',
    backgroundColor: '#F1E5C9',
    color: '#353535',
  },
  {
    name: '清新',
    backgroundColor: '#C7EDCC',
    color: '#353535',
  },
  {
    name: '暗黑',
    backgroundColor: '#000',
    color: '#b2b2b2',
  },
];

interface Props {
  animation: any;
  onThemeClick: (event: any) => any;
  theme: {
    backgroundColor: string | undefined;
    color: string | undefined;
    name: string | undefined;
  };
}

export default ({
  onThemeClick,
  animation,
  theme = { backgroundColor: undefined, color: undefined, name: undefined },
}: Props) => {
  function handleThemeClick(e) {
    const index = e.target.dataset.id;
    if (index === undefined) return;
    onThemeClick(themes[index]);
  }
  return (
    <View
      className="theme"
      onClick={handleThemeClick}
      animation={animation}
      style={{ backgroundColor: theme.backgroundColor, color: theme.color }}
    >
      {themes.map((item, index) => (
        <View className="theme__item" key={item.color}>
          <View
            className={`${theme.name === item.name ? 'item__color-block-active' : undefined} item__color-block`}
            style={{ backgroundColor: item.backgroundColor }}
            data-id={index}
          />
          {item.name}
        </View>
      ))}
    </View>
  );
};
