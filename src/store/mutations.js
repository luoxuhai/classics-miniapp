export default {
  setUserInfo(state, userInfo) {
    Object.keys(userInfo).forEach(key => {
      state[key] = userInfo[key];
      wx.setStorage({
        key,
        data: userInfo[key]
      });
    });
  },
  resetBookInfo(state) {
    state.catalogueList = []
  },
  setProduction(state, production) {
    state.production = production;
  },
  setSearchResult(state, result) {
    state.searchResult = result;
  },
  setSearchHistory(state, searchHistory) {
    state.searchHistoryArr = [
      ...new Set([searchHistory, ...state.searchHistoryArr])
    ];
    wx.setStorage({
      key: 'searchHistoryArr',
      data: state.searchHistoryArr
    });
    
  },

  delSearchHistory(state, delMethod = {}) {
    if (delMethod.all) state.searchHistoryArr = [];
    else state.searchHistoryArr.splice(delMethod.index, 1);
    wx.setStorage({
      key: 'searchHistoryArr',
      data: state.searchHistoryArr
    });
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
  },

  setSystemInfo(state, systemInfo) {
    state.systemInfo = {...state.systemInfo, ...systemInfo}
  }
};
