<template>
  <div class="container"
       :class="[controlShow ? 'toggle-show' : 'toggle-fade']">
    <div class="header">
      <div class="exit"
           @click="handleExit">取消</div>
      <div class="title">发表评论</div>
      <div class="publish"
           @click="handlePublishClick">发送</div>
    </div>
    <div class="star-select">
      <StarComment :size="50"
                  :select="true"
                  :score="score"
                  @handleSelect="handleSelect" />
    </div>
    <div class="area">
      <textarea placeholder="输入评论"
                maxlength="200"
                fixed="true"
                :show-confirm-bar="false"
                v-model="inputValue"
                adjust-position="false">
              </textarea>
    </div>
  </div>
</template>
<script>
import StarComment from "@/components/StarComment";
export default {
  components: {
    StarComment
  },
  data() {
    return {
      controlShow: false,
      score: 1,
      inputValue: ''
    };
  },
  methods: {
    handleSelect(score) {
      this.score = score;
    },
    handleShow() {
      this.controlShow = true;
      wx.setNavigationBarTitle({
        title: this.$store.state.bookName
      });
    },
    handleExit() {
      this.controlShow = false;
      this.score = 1;
      this.inputValue = ''
      wx.setNavigationBarTitle({
        title: '点评'
      });
    },
    handlePublishClick() {
      this.$emit('handlePublishClick', {
        score: this.score,
        content: this.inputValue
      })
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/lib/scss/common.scss";
.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #fff;
  &.toggle-show {
    z-index: 999;
    transform: scale(1);
    opacity: 1;
    transition: all 0.3s ease-out;
  }
  &.toggle-fade {
    transform: scale(0);
    opacity: 0.5;
    z-index: 0;
    transition: all 0.2s ease-in;
  }
  .header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 120rpx;
    padding: 0 50rpx;
    div {
      line-height: 120rpx;
    }
    .exit {
      font-size: 36rpx;
      color: #888;
    }
    .title {
      font: {
        size: 40rpx;
        color: 700;
      }
      color: #000;
    }
    .publish {
      font-size: 36rpx;
      color: $Theme;
    }
  }
  .star-select {
    width: 100vw;
    height: 150rpx;
    padding: 0 60rpx;
    border: {
      top: 1rpx solid #efefef;
      bottom: 1rpx solid #efefef;
    }
  }
  .area {
    width: 100%;
    height: 65vh;
    padding: 25rpx;
    textarea {
      width: 100%;
      height: 100%;
      color: #888;
    }
  }
}
</style>