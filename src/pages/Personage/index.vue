<template>
  <div class="container">
    <PerHeader />
    <PerList />
  </div>
</template>

<script>
import YearProgress from "./components/YearProgress";
import PerHeader from "./components/PerHeader";
import PerList from "./components/PerList";
import { showShareMenu } from "@/libs/mixin";
export default {
  mixins: [showShareMenu],
  components: {
    YearProgress,
    PerList,
    PerHeader
  },
  onShow() {
    wx.hideLoading();
    this.$api.getUserInfo(this.$store.state.userID).then(res => {
      this.$store.commit("setUserInfo", res.userInfo);
    });
  }
};
</script>