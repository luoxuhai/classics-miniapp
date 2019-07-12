<template>
  <main v-html="content" />
</template>
<script>
export default {
  data() {
    return {
      content: ""
    };
  },
  onLoad() {
    this.$api.getAffiche().then(res => {
      this.content = res.content.replace(
        /\<img/gi,
        '<img style="max-width:100%;height:auto;margin: 8px auto;"'
      );
    });
  }
};
</script>

<style lang="scss" scoped>
main {
  padding: 30rpx;
}
</style>
