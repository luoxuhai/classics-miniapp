<template>
  <div class="login-container">
    <section>
      <img
        src="https://classics.oss-cn-beijing.aliyuncs.com/app/logo.png?x-oss-process=style/o"
        mode="aspectFill"
      />
      <text class="name">古典名著书单小程序</text>
    </section>
    <section>
      <p class="hint">请授权小程序以继续使用古典名著苑小程序服务</p>
      <div hover-class="hover-button" class="button-login">
        <button open-type="getUserInfo" @getuserinfo="handleLogin" />
        微信授权登录
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
      reqCount: 1
    };
  },
  methods: {
    ...mapMutations(["setUserInfo", "setProduction"]),
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
      wx.getUserInfo({
        withCredentials: true,
        lang: "zh_CN",
        success: res => {
          let data = res.userInfo;
          if (/mmopen/.test(data.avatarUrl)) {
            this.setProduction(true);
            wx.setStorageSync("production", true);
          } else {
            this.setProduction(false);
            wx.setStorageSync("production", false);
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
                    code: res.code
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
    width: 90px;
    height: 90px;
    border-radius: 50%;
  }
  .name {
    margin-top: 20px;
    font-size: 18px;
    letter-spacing: 0.2em;
  }
  .hint {
    margin-bottom: 10px;
    font-size: 14px;
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
