<template>
  <view class="about">
    <img :src="about.QRcode" mode="aspectFill" />
    <view class="about__title webfont">古典文学名著阅读</view>
    <view class="about__version">v{{ about.version }}</view>
    <parser v-if="production" class="about__log" :html="about.log" selectable />
    <parser class="about__desc" :html="about.intro" selectable />
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "about",
  data() {
    return {
      about: {}
    };
  },
  computed: {
    ...mapState(["production"])
  },
  onLoad() {
    this.about = wx.getStorageSync("about");
    this.$api.about().then(res => {
      this.about = res.about;
      wx.setStorageSync("about", res.about);
    });
  }
};
</script>
<style lang="scss" scoped>
@import "@/lib/scss/common.scss";;
.about {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  .ad {
    margin-top: 20px;
  }
  img {
    width: 160px;
    height: 160px;
    margin-top: 50px;
  }
  .about__log {
    margin: 30rpx 0;
    font-size: 14px;
    color: $Grey;
  }
  .about__title {
    margin: 20px 0;
    font: {
      size: 46rpx;
      weight: 500;
    }
  }
  .about__version {
    font: {
      size: 14px;
    }
    color: $Grey;
  }
  .about__desc {
    width: 80vw;
    flex: 1;
    margin-top: 40rpx;
    word-break: break-all;
    font: {
      size: 16px;
    }
    color: $Content;
  }
}
</style>
