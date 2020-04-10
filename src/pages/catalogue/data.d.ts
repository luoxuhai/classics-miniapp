export interface Props {
  bookPreviewStore: {
    chapters: any[];
    bookmarks: any[];
    book: {};
    currentChapter: number;
    setChapters: Function;
    setBook: Function;
    setCurrentChapter: Function;
  };
}
