<template>
  <div v-if="isLoading" class="loading">
    <img src="/static/images/loading-white.gif">
  </div>
</template>

<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      default: true
    }
  },
};
</script>


<style lang="scss" scoped>
@import "@/assets/styles/common.scss";
.loading {
  @include center;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
  background-color: #fff;
}
</style>
