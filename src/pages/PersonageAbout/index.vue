<template>
  <div class="about">
    <img :src="about.QRcode" mode="aspectFill" />
    <h1 class="about__title">古典名著苑</h1>
    <p class="about__version">v{{ about.version }}</p>
    <div class="about__desc" v-html="about.desc" />
  </div>
</template>

<script>
export default {
  name: "about",
  data() {
    return {
      about: {}
    };
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
@import "@/assets/styles/common.scss";
.about {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  img {
    width: 160px;
    height: 160px;
    margin-top: 50px;
  }
  .about__title {
    margin: 10px 0;
    font: {
      size: 18px;
      weight: 500;
    }
  }
  .about__version {
    margin-bottom: 20px;
    font: {
      size: 14px;
    }
    color: $Grey;
  }
  .about__desc {
    width: 80vw;
    word-break: break-all;
    font: {
      size: 16px;
    }
    color: $Content;
  }
}
</style>
