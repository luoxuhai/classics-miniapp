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

  logout(state) {
    for (const key in state) state[key] = "";
    wx.clearStorageSync();
    wx.reLaunch({ url: `/pages/Login/index` });
  }
};
