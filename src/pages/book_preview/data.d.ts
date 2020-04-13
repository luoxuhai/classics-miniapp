interface BookPreviewStore {
  bookPreviewStore: {
    book: {
      _id: string;
      bookName: string;
      bookFile: string;
      isStar: boolean;
    };
    animation: any;
    currentPane: string;
    chapters: any[];
    currentChapter: number;
    bookMarkIndex: [];
    progress: any[];
    theme: {
      backgroundColor: any;
      color: any;
      name: any;
    };
    font: {
      fontSize: number;
    };
    setAnimation: Function;
    setProgress: Function;
    setBook: Function;
    setBookmarkIndex: Function;
    setCurrentPane: Function;
    setFont: Function;
    setCurrentChapter: Function;
    setChapters: Function;
    setTheme: Function;
  };
  globalStore: {
    freeAD: boolean;
  };
}

export interface NavBarProps extends BookPreviewStore {
  onToggleChapterClick: Function;
}

export type Props = BookPreviewStore;
