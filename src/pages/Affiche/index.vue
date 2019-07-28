<template>
  <main v-html="affiche.content" />
</template>
<script>
export default {
  data() {
    return {
      affiche: {}
    };
  },
  onLoad(options) {
    this.$api.getAffiche(options.id).then(res => {
      res.affiche.content = res.affiche.content.replace(
        /\<img/gi,
        '<img style="max-width:100%;height:auto;margin: 8px auto;"'
      );
      this.affiche = res.affiche;
    });
  }
};
</script>

<style lang="scss" scoped>
main {
  padding: 30rpx;
}
</style>
