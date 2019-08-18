<template>
  <parser class="about__desc" :html="content" selectable showWithAnimation />
</template>
<script>
export default {
  data() {
    return {
      content: ''
    };
  },
  onLoad(options) {
    if (options.type === "affiche") {
      wx.setNavigationBarTitle({ title: "公告" });
      this.$api.getAffiche(options.id).then(res => {
        this.content = res.affiche.content;
      });
    } else {
      this.$api.getArticle(options.id).then(res => {
        const { content, title } = res;

        this.content = content;
        wx.setNavigationBarTitle({ title });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
parser {
  padding: 30rpx;
}
</style>
