<template>
  <div class="nav" :class="{show: showHeader}">
    <span
      class="iconfont nav-item"
      :style="{color: isStar ? '#b2b2b2' : ''}"
      @click="handleAddToRackClick"
    >&#xe630;</span>
    <span class="iconfont nav-item" @click="handleToCommentClick">&#xe62d;</span>
    <div class="iconfont nav-item share" @click="handleShareClick">
      &#xe624;
      <button open-type="share" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      showHeader: false
    };
  },

  computed: {
    ...mapState(["isStar"])
  },

  methods: {
    handleAddToRackClick() {
      this.$emit("handleAddToRackClick");
    },
    handleToCommentClick() {
      this.$emit("handleToCommentClick");
    },
    handleShareClick() {
      this.$emit("handleShareClick");
    },
    handleControlTitle(scroll) {
      if (scroll) this.showHeader = false;
      else this.showHeader = !this.showHeader;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/common.scss";
.nav {
  @include flex(flex-end, center);
  position: fixed;
  z-index: 99;
  width: 100%;
  height: 120rpx;
  padding: 0 25rpx;
  background-color: #fff;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.12);
  opacity: 0;
  transition: all 0.3s ease-out;
  transform: translateY(-120rpx);
  &.show {
    transform: translateY(0);
    opacity: 1;
  }
  .nav-item {
    margin: 0 30rpx;
    font-size: 24px;
    color: #444c57;
  }
  .share {
    position: relative;
    button {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0;
    }
  }
}
</style>
