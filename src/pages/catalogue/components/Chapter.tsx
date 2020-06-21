import Taro from '@tarojs/taro';
import { View, Navigator } from '@tarojs/components';

import './Chapter.less';

interface Props {
  simple?: boolean;
  selectIndex: number;
  currentChapter?: number | null;
  list: any[];
  book: any;
  onChapterClick: (index: number) => void;
}

function Chapter({ simple = true, list = [], book = {}, selectIndex = 0, currentChapter = 0, onChapterClick }: Props) {
  return (
    <View>
      {list.map((item, index) => (
        <Navigator
          className="chapter divider-color"
          url={`/pages/book_preview/index?id=${book._id}&bookName=${book.bookName}&index=${index}`}
          openType={simple ? 'navigate' : 'navigateBack'}
          delta={1}
          style={{
            color:
              (selectIndex === 0 ? index : item.bookmarkIndex) === currentChapter && !simple ? '#f67280' : undefined
          }}
          onClick={simple ? undefined : () => onChapterClick(selectIndex === 0 ? index : item.bookmarkIndex)}
          key={item + index}
        >
          {selectIndex === 0 ? item : item.title}
        </Navigator>
      ))}
    </View>
  );
}

Chapter.options = {
  addGlobalClass: true
};

export default Chapter;
