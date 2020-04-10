import Taro, { PureComponent } from '@tarojs/taro';
import { View, Text, Slider } from '@tarojs/components';

import './Settings.less';

interface Props {
  animation: any;
  font: {
    fontSize: number;
  };
  theme: any;
  onFontChange: (e: any) => any;
}

class Settings extends PureComponent<Props> {
  static options = {
    addGlobalClass: true,
  };

  static defaultProps = {
    theme: { backgroundColor: undefined, color: undefined, name: undefined },
  };

  render() {
    const { animation, onFontChange, font, theme } = this.props;
    return (
      <View
        className="slider-wrapper"
        animation={animation}
        style={{ backgroundColor: theme.backgroundColor, color: theme.color }}
      >
        <Text className="icon">&#xe705;</Text>
        <Slider
          className="slider"
          step={2}
          activeColor="#f67280"
          blockColor="#f67280"
          blockSize={20}
          value={font.fontSize}
          showValue
          min={16}
          max={28}
          onChange={onFontChange}
        />
        <Text className="icon icon-large">&#xe705;</Text>
      </View>
    );
  }
}

export default Settings;
