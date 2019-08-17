<script>
import { mapMutations } from "vuex";
export default {
  methods: {
    ...mapMutations([
      "setProduction",
      "setUserInfo",
      "setSystemInfo",
      "setSearchHistory",
      "setReadView"
    ]),
    warn(updateManager) {
      wx.showModal({
        title: "温馨提示~",
        content: "本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~",
        showCancel: false,
        confirmText: "确定更新",
        success: res => {
          if (res.confirm) {
            this.downLoadAndUpdate(updateManager);
          } else this.warn(updateManager);
        }
      });
    },
    autoUpdate() {
      if (wx.canIUse("getUpdateManager")) {
        const updateManager = wx.getUpdateManager();
        updateManager.onCheckForUpdate(res => {
          if (res.hasUpdate) {
            wx.showModal({
              title: "更新提示",
              content: "检测到新版本，是否下载新版本并重启小程序？",
              success: res => {
                if (res.confirm) {
                  this.downLoadAndUpdate(updateManager);
                } else this.warn(updateManager);
              }
            });
          }
        });
      } else {
        wx.showModal({
          title: "提示",
          content:
            "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
        });
      }
    },
    downLoadAndUpdate(updateManager) {
      wx.showLoading();
      updateManager.onUpdateReady(() => {
        wx.hideLoading();
        //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate();
      });
      updateManager.onUpdateFailed(() => {
        wx.showModal({
          title: "已经有新版本了哟~",
          content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~"
        });
      });
    }
  },
  onLaunch() {
    // #ifdef MP-QQ || MP-TOUTIAO || MP-ALIPAY
    this.$api.getEnv().then(res => {
      this.setProduction(res.production);
      wx.setStorageSync("production", res.production);
    });
    // #endif

    // #ifdef MP-WEIXIN
    this.autoUpdate();
    wx.getStorage({
      key: "production",
      success: res => {
        this.setProduction(res.data);
      }
    });
    // #endif
    let storage = {
      userInfo: {
        userID: "",
        token: "",
        nickName: "",
        avatarUrl: "",
        gender: "",
        birthday: "",
        province: "",
        city: ""
      }
    };
    Object.keys(storage.userInfo).forEach(key => {
      const value = wx.getStorageSync(key);
      if (value) {
        storage.userInfo[key] = value;
      }
    });

    this.setUserInfo(storage.userInfo);

    const readTheme = wx.getStorageSync("readTheme");
    if (readTheme) this.setReadView(readTheme);

    this.setSystemInfo({ windowWidth: wx.getSystemInfoSync().windowWidth });
    const searchHistoryArr = wx.getStorageSync("searchHistoryArr") || [];
    searchHistoryArr.forEach(val => {
      this.setSearchHistory(val);
    });
  }
};
</script>
<style>
@import url("/components/HtmlParse/parse.css");
</style>
