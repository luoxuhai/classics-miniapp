<template>
  <parser class="about__desc" :html="affiche.content" selectable showWithAnimation />
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
      this.affiche = res.affiche;
    });
  }
};
</script>

<style lang="scss" scoped>
parser {
  padding: 30rpx;
}
</style>
