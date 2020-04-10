import Taro, { useState, useEffect } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

import './index.less';

type CollapseProps = {
  /** 面板id */
  _id: string;
  /** 文本内容 */
  content: string | undefined;
  /** 文本是否可选择 */
  selectable?: boolean;
  /** 面板是否可以打开或收起 */
  disabled?: boolean;
};

function Collapse({ content = '', selectable = true, disabled = false, _id }: CollapseProps) {
  const [animation, setAnimation] = useState<any>(undefined);
  const [contentHeight, setContentHeight] = useState(70);

  useEffect(() => {
    Taro.createSelectorQuery()
      .select(`#${_id} >>> .collapse__content`)
      .boundingClientRect(rect => {
        if (rect.height > 0) setContentHeight(rect.height);
      })
      .exec();
  }, [_id, content]);

  function handleToggleClick() {
    if (contentHeight < 70) return;
    const _animation = Taro.createAnimation({
      transformOrigin: '50% 50%',
      duration: 160,
      timingFunction: animation ? 'ease-out' : 'ease-in'
    })
      .height(animation ? 70 : contentHeight + 10)
      .step()
      .export();
    setAnimation(_animation);
    if (animation) {
      setTimeout(() => {
        setAnimation(undefined);
      }, 160);
    }
  }

  return (
    <View
      className="collapse"
      animation={animation}
      style={{ height: disabled || contentHeight < 70 ? undefined : '70px' }}
    >
      <Text className="collapse__content" onClick={handleToggleClick} selectable={selectable}>
        {content}
      </Text>
      {!disabled && contentHeight > 70 && <View className="collapse__footer" />}
    </View>
  );
}

Collapse.externalClasses = ['collapse-class'];

export default Collapse;
