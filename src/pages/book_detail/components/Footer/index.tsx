import Taro from '@tarojs/taro';
import { View, Navigator, Button } from '@tarojs/components';

import './index.less';

type Props = {
  isStar: boolean;
  check: boolean;
  _id: string;
  bookName: string;
  onBookrackClick: (e: any) => void;
};

function Footer({ isStar = false, _id = '', bookName = '', onBookrackClick, check = false }: Props) {
  return (
    <View className="footer main-bg-color ">
      <Button className="footer__share" openType="share">
        分享
      </Button>
      <Button className="footer__bookrack" disabled={isStar} onClick={onBookrackClick}>
        {isStar ? '已在书架' : '加入书架'}
      </Button>
      {!check && (
        <Navigator className="footer__read grey" url={`/pages/book_preview/index?id=${_id}&bookName=${bookName}`}>
          阅读
        </Navigator>
      )}
    </View>
  );
}

Footer.options = {
  addGlobalClass: true
};

export default Footer;
