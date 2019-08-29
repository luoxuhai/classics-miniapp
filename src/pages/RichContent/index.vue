<template>
  <parser class="about__desc" :html="content" @ready="onReady" selectable showWithAnimation />
</template>
<script>
export default {
  data() {
    return {
      content: ""
    };
  },
  methods: {
    onReady() {
      wx.hideNavigationBarLoading();
    }
  },

  onLoad(options) {
    if (options.type === "affiche") {
      wx.setNavigationBarTitle({ title: "公告" });
      this.$api.getAffiche(options.id).then(res => {
        this.content = res.affiche.content;
      });
    } else {
      this.$api
        .getArticle(options.id)
        .then(res => {
          const { content, title } = res;

          wx.setNavigationBarTitle({ title });
          return content;
        })
        .then(content => {
          this.$api.getOSSContent(content).then(res => {
            this.content = res;
          });
        });
    }
  },
  onReady() {
    wx.showNavigationBarLoading();
  }
};
</script>

<style lang="scss" scoped>
parser {
  padding: 30rpx;
}
</style>
