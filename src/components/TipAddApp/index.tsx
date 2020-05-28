import Taro, { useState, useEffect } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

import './index.less';

function TipAddApp() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    Taro.getStorage({
      key: 'tipAddApp'
    })
      .then(res => {
        setShow(res.data);
      })
      .catch(() => {
        setShow(true);
      });
  }, []);

  function handleCloseTip() {
    setShow(false);
    Taro.setStorage({
      key: 'tipAddApp',
      data: false
    });
  }

  return (
    <View>
      {show && (
        <View className="tip-container">
          <Text className="icon" onClick={handleCloseTip}>
            &#xe63f;
          </Text>
          <Text>添加到我的小程序,方便下次阅读</Text>
        </View>
      )}
    </View>
  );
}

TipAddApp.options = {
  addGlobalClass: true
};

export default TipAddApp;
