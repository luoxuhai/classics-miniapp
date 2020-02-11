<template>
  <view class="container">
    <PerHeader />
    <PerList />
    <view v-if="!token" class="mask" @touchstart="handleLoginClick"></view>
  </view>
</template>

<script>
import PerHeader from "./components/PerHeader";
import PerList from "./components/PerList";
import { mapState } from "vuex";
import { showShareMenu } from "@/lib/mixin";
export default {
  mixins: [showShareMenu],
  components: {
    PerList,
    PerHeader
  },
  methods: {
    handleLoginClick() {
      wx.showModal({
        title: "提示",
        content: "登录后查看更多内容",
        showCancel: true,
        confirmText: "登录",
        cancelText: "暂不登录",
        confirmColor: "#f67280",
        success: res => {
          if (res.confirm) wx.navigateTo({ url: "/pages/Login/index" });
        }
      });
    }
  },
  computed: {
    ...mapState(["token"])
  },
  onShow() {
    wx.hideLoading();
    if (this.token)
      this.$api.getUserInfo(this.$store.state.userID).then(res => {
        this.$store.commit("setUserInfo", res.userInfo);
      });
  },
  onShareAppMessage() {
    return {
      title: "古典名著苑-免费看海量中国古典小说",
      path: `/pages/Home/index`,
      imageUrl:
        "https://classics.oss-cn-beijing.aliyuncs.com/app/%E6%89%B9%E6%B3%A8%202019-08-29%2021584.jpg"
    };
  }
};
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
}
</style>