export default {
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
      key: "searchHistoryArr",
      data: state.searchHistoryArr
    });
  },

  delSearchHistory(state, delMethod = {}) {
    if (delMethod.all) state.searchHistoryArr = [];
    else state.searchHistoryArr.splice(delMethod.index, 1);
    wx.setStorage({
      key: "searchHistoryArr",
      data: state.searchHistoryArr
    });
  },

  setSystemInfo(state, systemInfo) {
    state.systemInfo = { ...state.systemInfo, ...systemInfo };
  }
};
