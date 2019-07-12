<script>
import { mapMutations } from "vuex";
export default {
  methods: {
    ...mapMutations([
      "setProduction",
      "setUserInfo",
      "setSystemInfo",
      "setSearchHistory"
    ])
  },
  onLaunch() {
    const production = wx.getStorage({
      key: "production",
      success: res => {
        this.setProduction(res);
      }
    });
    let userInfo = {
      userID: "",
      token: "",
      nickName: "",
      avatarUrl: "",
      gender: "",
      birthday: "",
      province: "",
      city: ""
    };
    Object.keys(userInfo).forEach(key => {
      const value = wx.getStorageSync(key);
      if (value) {
        userInfo[key] = value;
      }
    });
    this.setUserInfo(userInfo);
    const searchHistoryArr = wx.getStorageSync("searchHistoryArr") || [];
    searchHistoryArr.forEach(val => {
      this.setSearchHistory(val);
    });
  }
};
</script>