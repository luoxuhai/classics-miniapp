<template>
  <view class="select-list">
    <view
      class="list-item"
      hover-class="hover-button"
      @click="handleSelectItem(index)"
      v-for="(item, index) of selectList"
      :key="index"
    >
      <img :src="item.icon" />
      <button v-if="index === 4" open-type="feedback"></button>
      <!-- #ifdef MP-WEIXIN || MP-QQ -->
      <button v-if="index === 5" open-type="contact"></button>
      <!-- #endif -->
      <p class="title">{{item.text}}</p>
      <label v-if="index != 3" class="iconfont">&#xe667;</label>
    </view>
  </view>
</template>

<script>
import { developModal } from "@/libs/utils";
export default {
  name: "PerList",
  data() {
    return {
      selectList: [
        {
          icon: "/static/icons/comment.png",
          text: "我的点评"
        },
        {
          icon: "/static/icons/browse.png",
          text: "我的浏览"
        },
        {
          icon: "/static/icons/theme.png",
          text: "更换主题"
        },
        {
          icon: "/static/icons/setting.png",
          text: "设置"
        },
        {
          icon: "/static/icons/feedback.png",
          text: "我要反馈"
        },
        {
          icon: "/static/icons/feedback.png",
          text: "客服"
        },
        {
          icon: "/static/icons/about.png",
          text: "关于"
        }
      ]
    };
  },
  methods: {
    handleSelectItem(index) {
      switch (index) {
        case 0:
          wx.navigateTo({
            url: `/pages/UserComment/index`
          });
          break;
        case 1:
          wx.navigateTo({
            url: `/pages/UserBrowse/index`
          });
          break;
        case 2:
          developModal();
          break;
        case 3:
          wx.navigateTo({
            url: "/pages/Setting/index"
          });
          break;
        case 4:
          wx.showLoading({
            title: "打开中"
          });
          break;
        case 5:
          wx.showLoading({
            title: "打开中"
          });
          break;
        case 6:
          wx.navigateTo({
            url: `/pages/About/index`
          });
      }
    }
  },
  onShow() {
    wx.hideLoading();
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/common.scss";
.select-list {
  width: 100vw;
  overflow: hidden;
  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    height: 100rpx;
    padding: 0 35rpx;
    border-bottom: 2rpx solid#eee;
    button {
      position: absolute;
      z-index: 99;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      opacity: 0;
    }
    img {
      width: 40rpx;
      height: 40rpx;
    }
    p {
      flex: 1;
      padding-left: 20rpx;
      font-size: 32rpx;
    }
    &:nth-of-type(1),
    &:nth-of-type(4),
    &:nth-of-type(5) {
      position: relative;
      margin-top: 20rpx;
      &::after {
        content: "";
        position: absolute;
        bottom: 100%;
        left: calc(50% - 375rpx);
        width: 750rpx;
        height: 20rpx;
        background-color: $Place;
      }
    }
    .iconfont {
      color: $Grey;
    }
  }
}
</style>
