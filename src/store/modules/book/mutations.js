export default {
  resetBookInfo(state) {
    state.catalogueList = [];
  },
  
  setBookInfo(state, bookInfo) {
    Object.keys(bookInfo).forEach(key => {
      state[key] = bookInfo[key];
    });
  },

  setReadView(state, readInfo) {
    Object.keys(readInfo).forEach(key => {
      state.readTheme[key] = readInfo[key];
    });
    wx.setStorage({
      key: "readTheme",
      data: readInfo
    });
  },
}