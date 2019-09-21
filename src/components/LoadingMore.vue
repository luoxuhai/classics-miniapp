<template>
  <view>
    <view v-if="loading" class="box" :style="{color}">
      <label class="loader-13"></label>
    </view>
    <view v-if="!loading" :style="{color: fontColor}" class="tip">{{ tip }}</view>
  </view>
</template>

<script>
export default {
  name: "LoadingMore",
  props: {
    tip: {
      type: String,
      default: "你踩到我的底线了!"
    },
    loading: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: "#f67280"
    },
    fontColor: {
      type: String,
      default: "#888"
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100rpx;
}
.tip {
  @extend .box;
  font-size: 32rpx;
}
.loader-13 {
  display: inline-block;
  width: 1em;
  height: 1em;
  color: inherit;
  vertical-align: middle;
}
.loader-13:before,
.loader-13:after,
.loader-13 {
  border-radius: 50%;
  animation-fill-mode: both;
  animation: loader-13 1.6s infinite ease-in-out;
}
.loader-13 {
  color: currentcolor;
  position: relative;
  transform: translateZ(0);
  animation-delay: -0.16s;
  top: -1em;
}
.loader-13:before {
  right: 100%;
  animation-delay: -0.32s;
}
.loader-13:after {
  left: 100%;
}
.loader-13:before,
.loader-13:after {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  width: inherit;
  height: inherit;
}
@keyframes loader-13 {
  0%,
  80%,
  100% {
    box-shadow: 0 1em 0 -1em;
  }
  40% {
    box-shadow: 0 1em 0 -0.2em;
  }
}
</style>
