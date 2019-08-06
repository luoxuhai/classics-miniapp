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
}