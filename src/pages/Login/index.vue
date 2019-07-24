<template>
  <div class="login-container">
    <section>
      <img
        src="https://classics.oss-cn-beijing.aliyuncs.com/app/logo.png?x-oss-process=style/o"
        mode="aspectFill"
      />
      <text class="name webfont">古典名著书单小程序</text>
    </section>
    <section>
      <p class="hint">请授权小程序以继续使用古典名著苑小程序服务</p>
      <div hover-class="hover-button" class="button-login">
        <form :report-submit="true" @submit="formSubmit">
          <button form-type="submit" open-type="getUserInfo" @getuserinfo="handleLogin" />
        </form>微信授权登录
      </div>
    </section>
  </div>
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
      this.formId = e.detail.formId;
    },
    handleLogin() {
      wx.showLoading({
        title: "加载中"
      });
      const date = new Date();
      const [year, month, day] = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      ];
      wx.getSetting({
        success: res => {
          if (res.authSetting["scope.userInfo"]) {
            this.getUserInfo(year, month, day);
          }
        }
      });
    },
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
          // 审核人员
          if (/mmhead/.test(data.avatarUrl)) {
            this.setProduction(false);
            wx.setStorageSync("production", false);
            userType = "temp";
          }
          wx.login({
            success: res => {
              if (res.code) {
                if (data.gender === 0) data.gender = "未知";
                else if (data.gender === 1) data.gender = "男";
                else data.gender = "女";
                Object.assign(data, {
                  birthday: `${year}-${month}-${day}`,
                  code: res.code
                });
                this.$api
                  .login({
                    code: res.code,
                    formId: this.formId,
                    userType
                  })
                  .then(res => {
                    const { userID, token } = res;
                    this.setUserInfo({ userID, token });
                    if (res.status === "register") {
                      delete data.code;
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
    }
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
@import "@/assets/styles/common.scss";
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 100vh;
  section {
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
