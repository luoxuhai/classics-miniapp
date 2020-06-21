import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

import './Theme.less';

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
    onThemeClick(global.themes[index]);
  }
  return (
    <View
      className="theme"
      onClick={handleThemeClick}
      animation={animation}
      style={{ backgroundColor: theme.backgroundColor, color: theme.color }}
    >
      {global.themes.map((item, index) => (
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
