import Taro from '@tarojs/taro';
import { observable } from 'mobx';

const bookPreviewStore = observable({
  book: {
    _id: '',
    bookName: ''
  },
  chapters: [],
  currentChapter: -1,
  bookmarks: [],
  progress: [],
  toggleChapter: false,
  theme: {
    name: '默认',
    backgroundColor: '#fff',
    color: '#353535'
  },
  font: {
    fontSize: 20
  },
  animation: undefined,
  currentPane: 'default',

  setBook(book) {
    this.book = { ...this.book, ...book };
  },

  setProgress(progress) {
    this.progress = progress;
  },

  setBookmarkIndex(bookmarks) {
    this.bookmarks = bookmarks;
  },

  setTheme(theme) {
    this.theme = theme;
    Taro.setStorage({ key: 'theme', data: theme });
  },

  setAnimation(animation) {
    this.animation = animation;
  },

  setCurrentPane(currentPane) {
    this.currentPane = currentPane;
  },

  setFont(data) {
    this.font = { ...this.font, ...data };
    Taro.setStorage({ key: 'font', data: { ...this.font, ...data } });
  },

  setCurrentChapter(currentChapter) {
    this.currentChapter = currentChapter;
  },

  setChapters(chapters) {
    this.chapters = chapters;
  },

  setBookmarks(bookmarks) {
    this.bookmarks = bookmarks;
  }
});

export default bookPreviewStore;
