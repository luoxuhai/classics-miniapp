<template>
  <view class="wrapper">
    <view class="font" v-for="(item, index) of fonts" :key="index">
      <text class="font__name">{{item.name}}</text>
      <view class="font__footer">
        <text class="font__size">{{item.size}}</text>
        <view
          class="font__button"
          @click="handleLoadClock(index, item.name, item.url)"
        >{{index === loadIndex ? '取消' : '下载'}}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      loadIndex: null,
      fonts: [
        {
          name: "系统字体",
          size: "",
          url: ""
        },
        {
          name: "思源宋体",
          size: "10M"
        },
        {
          name: "阿里巴巴普惠体",
          size: "9M",
          url:'https://classics.oss-cn-beijing.aliyuncs.com/app/fonts/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E6%99%AE%E6%83%A0%E4%BD%93.ttf'
        }
      ]
    };
  },
  methods: {
    handleLoadClock(index, name, url) {
      this.loadIndex = index;
      wx.loadFontFace({
        family: name,
        source: `url(${url})`,
        success: console.log
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/common.scss";
.wrapper {
  padding: 40rpx;
  .font {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 120rpx;
    .font__name {
      font-size: 38rpx;
      color: $Title;
      font-family: '阿里巴巴普惠体'
    }
    .font__footer {
      display: flex;
      align-items: center;
      .font__size {
        margin-right: 30rpx;
        font-size: 30rpx;
        color: $Grey;
      }
      .font__button {
        @include center;
        width: 140rpx;
        height: 60rpx;
        border-radius: 70rpx;
        background-color: #f8b19571;
        font-size: 34rpx;
        color: $Theme;
      }
    }
  }
}
</style>