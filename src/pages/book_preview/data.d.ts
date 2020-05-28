interface BookPreviewStore {
  bookPreviewStore: {
    book: {
      _id: string;
      bookName: string;
      content: string;
      isStar: boolean;
    };
    animation: any;
    currentPane: string;
    chapters: any[];
    currentChapter: number;
    bookmarkIndex: [];
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
    freeAD: number;
  };
}

export interface NavBarProps extends BookPreviewStore {
  onToggleChapterClick: Function;
}

export type Props = BookPreviewStore;
