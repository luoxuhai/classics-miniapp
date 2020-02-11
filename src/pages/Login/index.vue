<template>
  <view class="login-container">
    <view class="section">
      <img
        src="https://classics.oss-cn-beijing.aliyuncs.com/app/logo.png?x-oss-process=style/o"
        mode="aspectFill"
      />
      <text class="name webfont">古典文学名著阅读</text>
    </view>
    <view class="section">
      <view class="hint">请授权小程序以继续使用古典文学名著阅读小程序服务</view>
      <view hover-class="hover-button" class="button-login">
        <form :report-submit="true" @submit="formSubmit">
          <!-- #ifdef MP-ALIPAY -->
          <button
            open-type="getAuthorize"
            onGetAuthorize="handleLogin"
            @click="handleLogin"
            scope="userInfo"
          />
          <!-- #endif -->

          <!-- #ifdef MP-WEIXIN || MP-QQ -->
          <button form-type="submit" open-type="getUserInfo" @getuserinfo="handleLogin" />
          <!-- #endif -->

          <!-- #ifdef MP-TOUTIAO -->
          <button @click="handleLogin" />
          <!-- #endif -->
        </form>微信授权登录
      </view>
    </view>
  </view>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      share: false,
      reqCount: 1,
      formId: ""
    };
  },
  methods: {
    ...mapMutations(["setUserInfo", "setProduction"]),
    formSubmit(e) {
      wx.showLoading({
        title: "登录中...",
        mask: true
      });
      this.formId = e.detail.formId;
    },
    handleLogin() {
      const date = new Date();
      const [year, month, day] = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      ];
      // #ifdef MP-WEIXIN || MP-QQ
      wx.getSetting({
        success: res => {
          if (res.authSetting["scope.userInfo"])
            this.getUserInfo(year, month, day);
        }
      });
      // #endif

      // #ifdef MP-TOUTIAO
      tt.authorize({
        scope: "scope.userInfo",
        success: res => {
          this.getUserInfo(year, month, day);
        }
      });
      // #endif

      // #ifdef MP-ALIPAY
      this.getUserInfo(year, month, day);
      // #endif
    },

    // #ifdef MP-WEIXIN || MP-QQ
    getUserInfo(year, month, day) {
      // 普通用户
      let userType = "common";
      this.setProduction(true);
      wx.setStorageSync("production", true);
      wx.getUserInfo({
        withCredentials: true,
        lang: "zh_CN",
        success: res => {
          let data = res.userInfo;
          // #ifdef MP-WEIXIN
          // 审核人员
          if (
            /mmhead/.test(data.avatarUrl) ||
            this.formId === "the formId is a mock one"
          ) {
            this.setProduction(false);
            wx.setStorageSync("production", false);
            userType = "temp";
          }
          // #endif

          wx.login({
            success: res => {
              if (res.code) {
                if (data.gender === 0) data.gender = "未知";
                else if (data.gender === 1) data.gender = "男";
                else if (data.gender === 2) data.gender = "女";
                Object.assign(data, {
                  birthday: `${year}-${month}-${day}`,
                  code: res.code
                });
                let client = "";
                // #ifdef MP-WEIXIN
                client = "weixin";
                // #endif

                // #ifdef MP-QQ
                client = "qq";
                // #endif

                this.$api
                  .login({
                    code: res.code,
                    formId: this.formId,
                    client
                  })
                  .then(res => {
                    const { userID, token } = res;
                    this.setUserInfo({ userID, token });
                    if (res.status === "register") {
                      delete data.code;
                      data.client = client;
                      this.$api.updateUserInfo(userID, data);
                    }
                    wx.hideLoading();
                    if (this.share)
                      wx.navigateBack({
                        delta: 1
                      });
                    else wx.switchTab({ url: "/pages/Home/index" });
                  })
                  .catch(err => {
                    if (err.response.data.errMsg) {
                      wx.showModal({
                        title: "提示",
                        content: err.response.data.errMsg,
                        showCancel: false,
                        confirmText: "确认"
                      });
                      return;
                    }
                    if ((this.reqCount = 3)) return;
                    setTimeout(() => {
                      this.reqCount++;
                      this.handleLogin();
                    }, 2000);
                  });
              }
            }
          });
        }
      });
    },
    // #endif

    // #ifdef MP-ALIPAY
    // 支付宝
    getUserInfo(year, month, day) {
      wx.getAuthCode({
        scopes: "auth_base",
        success: res => {
          if (res.authCode) {
            my.getOpenUserInfo({
              success: _res => {
                const { avatar, nickName, gender, province, city } = JSON.parse(
                  _res.response
                ).response;

                this.$api
                  .login({
                    code: res.authCode,
                    client: "alipay"
                  })
                  .then(res => {
                    const { userID, token } = res;
                    this.setUserInfo({ userID, token });
                    if (res.status === "register") {
                      this.$api.updateUserInfo(userID, {
                        avatarUrl: avatar,
                        nickName,
                        gender: gender === "m" ? "男" : "女",
                        province,
                        city,
                        birthday: `${year}-${month}-${day}`,
                        client
                      });
                    }
                    wx.hideLoading();
                    if (this.share)
                      wx.navigateBack({
                        delta: 1
                      });
                    else wx.switchTab({ url: "/pages/Home/index" });
                  })
                  .catch(err => {
                    if ((this.reqCount = 3)) return;
                    setTimeout(() => {
                      this.reqCount++;
                      this.handleLogin();
                    }, 2000);
                  });
              }
            });
          }
        }
      });
    },
    // #endif

    // #ifdef MP-TOUTIAO
    // 头条
    getUserInfo(year, month, day) {
      tt.login({
        success: res => {
          if (res.code) {
            tt.getUserInfo({
              withCredentials: true,
              success: _res => {
                const data = _res.userInfo;
                if (data.gender === 0) data.gender = "未知";
                else if (data.gender === 1) data.gender = "男";
                else if (data.gender === 2) data.gender = "女";
                Object.assign(data, {
                  birthday: `${year}-${month}-${day}`,
                  code: res.code
                });

                this.$api
                  .login({
                    code: res.code,
                    client: "toutiao"
                  })
                  .then(res => {
                    const { userID, token } = res;
                    this.setUserInfo({ userID, token });
                    if (res.status === "register") {
                      delete data.code;
                      data.client = "toutiao";
                      this.$api.updateUserInfo(userID, data);
                    }
                    if (this.share)
                      tt.navigateBack({
                        delta: 1
                      });
                    else tt.switchTab({ url: "/pages/Home/index" });
                  })
                  .catch(err => {
                    if ((this.reqCount = 3)) return;
                    setTimeout(() => {
                      this.reqCount++;
                      this.handleLogin();
                    }, 2000);
                  });
              }
            });
          }
        }
      });
    }
    // #endif
  },
  computed: {
    ...mapState(["production"])
  },
  onLoad(options) {
    this.share = options.share;
  }
};
</script>

<style lang="scss" scoped>
@import "@/lib/scss/common.scss";
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 100vh;
  .section {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  img {
    width: 180rpx;
    height: 180rpx;
    border-radius: 50%;
  }
  .name {
    margin-top: 40rpx;
    font-size: 46rpx;
    letter-spacing: 0.2em;
  }
  .hint {
    margin-bottom: 20rpx;
    font-size: 28rpx;
    color: #888;
  }
  .button-login {
    @extend .button;
    left: 0;
    transform: translateX(0);
    button {
      position: absolute;
      z-index: 999;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
}
</style>
