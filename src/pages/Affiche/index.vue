<template>
  <view>
    <HtmlParse :content="affiche.content" />
  </view>
</template>
<script>
import HtmlParse from "@/components/HtmlParse/parse.vue";
export default {
  components: {
    HtmlParse
  },
  data() {
    return {
      affiche: {}
    };
  },
  onLoad(options) {
    this.$api.getAffiche(options.id).then(res => {
      this.affiche = res.affiche;
    });
  }
};
</script>

<style lang="scss" scoped>
view {
  padding: 30rpx;
}
</style>
