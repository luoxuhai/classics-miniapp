<template>
  <swiper
    indicator-dots
    indicator-active-color="#fff"
    skip-hidden-item-layout
    :duration="450"
    autoplay
    :interval="10000"
    previous-margin="30rpx"
    next-margin="30rpx"
    circular
  >
    <swiper-item>
      <ad unit-id="adunit-e1a27ccddca8d7e7" ad-type="video" ad-theme="white" :ad-intervals="30" />
    </swiper-item>
    <block v-for="item of banners" :key="item._id">
      <swiper-item>
        <img mode="aspectFill" :src="item.bannerImg" @click="handleEnter(item.type, item._id)" />
      </swiper-item>
    </block>
  </swiper>
</template>

<script>
export default {
  props: {
    banners: Array
  },
  methods: {
    handleEnter(type, id) {
      let url;
      switch (type) {
        case "article":
        case "affiche":
          url = `/pages/RichContent/index?id=${id}&type=${type}`;
          break;
        case "book":
          url = `/pages/HomeDetail/index?bookID=${id}`;
          break;
      }
      wx.navigateTo({ url });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/common.scss";
swiper {
  position: relative;
  z-index: 999;
  height: 300rpx;
  background-color: #fff;
  padding-bottom: 50rpx;
  swiper-item {
    @include flex(center);
    img {
      width: 98%;
      height: 100%;
      border-radius: 20rpx;
      background-color: #f7f7f7;
    }
  }
}
</style>