<template>
  <view class="tipsWrap" v-if="showTips">
    <view class="arrow"></view>
    <view class="tipsContent">
      <text>添加到我的小程序，下次使用更便捷</text>
      <text class="closeIcon" @tap="closeTips()">X</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "StarTip",
  data() {
    return {
      showTips: false //是否展示
    };
  },

  onReady() {
    //获取本地缓存
    const cache = uni.getStorageSync("isFirst");
    if (!cache) {
      this.showTips = false;
    } else {
      this.showTips = true;
      uni.setStorage({
        key: "isFirst",
        data: false
      });
      setTimeout(() => {
        this.showTips = false;
      }, 5000);
    }
  },

  methods: {
    //手动关闭
    closeTips() {
      this.showTips = false;
      uni.setStorage({
        key: "isFirst",
        data: false
      });
    }
  }
};
</script>

<style>
.tipsWrap {
  position: fixed;
  top: 0;
  /* 距离顶部高度，部分自定义标题栏会覆盖提示栏 */
  right: 0;
  z-index: 999;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  flex-direction: column;
  width: 600rpx;
  animation: rotate 0.9s linear infinite;
}

/* 弹跳动画 */
@keyframes rotate {
  0% {
    transform: translateY(0);
  }

  25% {
    transform: translateY(2rpx);
  }

  50% {
    transform: translateY(5rpx) scale(1.01, 0.99);
  }

  75% {
    ransform: translateY(2rpx);
  }

  100% {
    transform: translateY(0);
  }
}

.arrow {
  width: 0;
  height: 0;
  margin-right: 120rpx;
  border-width: 10rpx;
  border-style: solid;
  border-color: transparent transparent #f1f1f1 transparent;
  /* 箭头颜色 */
}

.tipsContent {
  background-color: #f1f1f1;
  /* 背景颜色 */
  box-shadow: 0 10rpx 20rpx -10rpx #f1f1f1;
  /* 阴影颜色 */
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70rpx;
  padding: 0 10rpx 0 15rpx;
  margin-right: 40rpx;
}

.tipsContent > text {
  color: #4d4d4d;
  font-size: 28rpx;
}

.closeIcon {
  font-size: 28rpx !important;
  margin-left: 10rpx;
  padding: 0 8rpx;
  background: #ffffff;
  border-radius: 12rpx;
}
</style>