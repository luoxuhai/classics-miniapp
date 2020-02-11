<template>
  <view class="container">
    <view
      class="container__block"
      v-for="(item, index) of blocks"
      :key="index"
      @click="handleClickEnter(index)"
    >
      <img :src="item.icon" mode="aspectFill" lazy-load />
      <text>{{item.title}}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      blocks: [
        {
          title: "新书",
          icon: "/static/icons/newbook.svg"
        },
        {
          title: "榜单",
          icon: "/static/icons/ranking.svg"
        },
        {
          title: "分类",
          icon: "/static/icons/classify.svg"
        }
      ]
    };
  },
  methods: {
    handleClickEnter(index) {
      let page = "classify";
      switch (index) {
        case 0:
          page = "newbook";
          break;
        case 1:
          page = "ranking";
      }
      wx.navigateTo({ url: `/pages/HomeBlock/index?page=${page}` });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/lib/scss/common.scss";

.container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 150rpx;
  .container__block {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100rpx;
    height: 100%;
    img {
      width: 60rpx;
      height: 60rpx;
    }
    text {
      margin-top: 10rpx;
      font-size: 28rpx;
    }
  }
}
</style>
