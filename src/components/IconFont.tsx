import Taro from '@tarojs/taro';
import { RichText } from '@tarojs/components';

interface Props {
  unicode: string;
  size?: string;
  color?: string;
}

function IconFont({ size, unicode, color }: Props) {
  return <RichText className="class-name icon" style={{ color, fontSize: size }} nodes={unicode} space="nbsp" />;
}

IconFont.externalClasses = ['class-name'];

IconFont.options = {
  addGlobalClass: true
};

export default IconFont;
